import { chatThreadsState, ThreadMessage } from '@/atoms/chatAtoms';
import { auth, firestore, storage } from '@/firebase/clientApp';
import { addDoc, collection, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';

const useChatThread= () => {
    const [user] = useAuthState(auth);
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const imgURL = useRef("");

    const storeMessage = async (
        identifyer: string,
        currentThread: string, 
        text: string,
        newGroupName: string,
        statusText: string,
        selectedImage?: string,
        setSelectedImage?: (value: string) => void,
        selectedFile?: {
            filename: string;
            data: string;
        },
        setSelectedFile?: (value: React.SetStateAction<{
            filename: string;
            data: string;
        }>) => void,
    ) => {
        const temporaryId: string = user?.uid! + chatThreadsValue.threadMessages.length;

        const newMessage = {
            threadId: currentThread,
            uid: identifyer === "changeChatName" || identifyer === "changeChatPhoto" || identifyer === "statusUpdate" 
                ? "chatSystem=" + user?.uid 
                : user?.uid,
            text: text,
        };

        setChatThreadsValue((prev) => ({
            ...prev,
            threadMessages: [...prev.threadMessages, {
                ...newMessage,
                id: temporaryId,
                photoURL: {
                    url: selectedImage || "",
                    isLoading: true
                },
                file: {
                    filename: selectedFile?.filename || "",
                    data: selectedFile?.data || "",
                    isLoading: true
                },
                createdAt: Timestamp.now()
            }],
        }));

        try{
            //ADD Message
            const messageDocRef = await addDoc(collection(firestore, `threads/${currentThread}/messages`), {
                ...newMessage,
                photoURL: {
                    url: "",
                    isLoading: true
                },
                file: {
                    filename: "",
                    data: "",
                    isLoading: true
                },
                createdAt: serverTimestamp() as Timestamp
            });
            //UPDATE latest Message ID if 
            if(!selectedImage && !selectedFile?.filename){
                setChatThreadsValue((prev) => ({
                    ...prev,
                    threadMessages: [...prev.threadMessages.filter(item => item.id !== temporaryId), {
                        ...newMessage,
                        id: messageDocRef.id,
                        photoURL: {
                            url: selectedImage || "",
                            isLoading: true
                        },
                        file: {
                            filename: selectedFile?.filename || "",
                            data: selectedFile?.data || "",
                            isLoading: true
                        },
                        createdAt: Timestamp.now()
                    }],
                }));
            }

            //UPLOAD Image
            if(selectedImage){
                if(setSelectedImage){setSelectedImage("");}
                const imageRef = ref(storage, `chatImages/${messageDocRef.id}/image`);
                await uploadString(imageRef, selectedImage, "data_url");
                const downloadURL = await getDownloadURL(imageRef);

                if(identifyer === "chatMessage"){
                    await updateDoc(messageDocRef, {
                        photoURL: {
                            url: downloadURL,
                            isLoading: false
                        },
                    });
                } else if(identifyer === "changeChatPhoto"){
                    if(chatThreadsValue.currentSelectedThread?.groupPhotoURL !== ""){
                        // Create a reference to the file to delete
                        const desertRef = ref(storage, chatThreadsValue.currentSelectedThread?.groupPhotoURL);
                        // Delete the file
                        deleteObject(desertRef)
                        .then(() => {
                            //do something here
                        }).catch((error) => {
                            console.log("Delete Photo Error: ", error)
                        });
                    }
                }
                
                imgURL.current=downloadURL;
                if(downloadURL){
                    const newMessageRecoilUpdate: ThreadMessage = {
                        id: messageDocRef.id,
                        threadId: currentThread,
                        uid: identifyer === "changeChatPhoto" 
                            ? "chatSystem=" + user?.uid 
                            : user?.uid,
                        text: text,
                        photoURL: {
                            url: identifyer === "changeChatPhoto" ? "" :  selectedImage,
                            isLoading: false
                        },
                        file: {
                            filename: "",
                            data: "",
                            isLoading: false
                        },
                        createdAt: Timestamp.now() 
                    };

                    setChatThreadsValue((prev) => ({
                        ...prev,
                        threadMessages: [...prev.threadMessages.filter(item => item.id !== temporaryId), newMessageRecoilUpdate] as ThreadMessage[],
                    }));
                }
            }

            //UPLOAD File
            if (selectedFile?.filename) {
                if(setSelectedFile){setSelectedFile({filename: "", data: ""});}
                const fileRef = ref(storage, `chatFiles/${messageDocRef.id}/files`);
                await uploadString(fileRef, selectedFile.data as string, "data_url");
                const downloadURL = await getDownloadURL(fileRef);
                await updateDoc(messageDocRef, {
                    file: {
                        filename: selectedFile.filename,
                        data: downloadURL,
                        isLoading: false
                    },
                });
                if(downloadURL){
                    const newMessageRecoilUpdate: ThreadMessage = {
                        id: messageDocRef.id,
                        threadId: currentThread,
                        uid: user?.uid,
                        text: text,
                        photoURL:  {
                            url: "",
                            isLoading: false
                        },
                        file: {
                            filename: selectedFile.filename,
                            data: downloadURL,
                            isLoading: false
                        },
                        createdAt: Timestamp.now() 
                    };
                    setChatThreadsValue((prev) => ({
                        ...prev,
                        threadMessages: [...prev.threadMessages.filter(item => item.id !== temporaryId), newMessageRecoilUpdate] as ThreadMessage[],
                    }));
                }
            }

            let threadSeen: string[] = [];
            threadSeen.push(user!.uid);
            
            const threadUpdater = {
                changeType:"modified",
                threadSeen: threadSeen as [],
                lastMessage: selectedImage 
                    ? identifyer === "changeChatPhoto" 
                        ? text 
                        : "sent a photo." 
                    : selectedFile?.filename 
                        ? "attached a file." 
                        : text,
                lastMessageId: messageDocRef.id,
                lastMessageUID: identifyer === "changeChatName" || identifyer === "changeChatPhoto" || identifyer === "statusUpdate"  
                    ? "chatSystem=" + user?.uid 
                    : user?.uid,
                latestMessageCreatedAt: serverTimestamp(),
            }
            // Update the timestamp field with the value from the server
            const threadRef = doc(firestore, 'threads', currentThread);
            if(identifyer === "changeChatName"){
                await updateDoc(threadRef, {
                    ...threadUpdater,
                    groupName: newGroupName.trimStart()
                });
            } else if(identifyer === "changeChatPhoto"){
                await updateDoc(threadRef, {
                    ...threadUpdater,
                    groupPhotoURL: imgURL.current
                });
            } else if(identifyer === "statusUpdate"){
                await updateDoc(threadRef, {
                    ...threadUpdater,
                    status: statusText
                });
            } else {
                await updateDoc(threadRef, {
                    ...threadUpdater,
                });
            }
            return true
        } catch (error: any) {
            console.log("Error storeMessage: ", error);
            return false
        }
    }
    return { storeMessage }
}
export default useChatThread;