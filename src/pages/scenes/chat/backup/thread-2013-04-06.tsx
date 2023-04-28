import { chatThreadsState, ThreadMessage, ThreadRef } from '@/atoms/chatAtoms';
import { usersAtomState, UsersInfo } from '@/atoms/usersAtom';
import ChatMessages from '@/components/Chat/ChatMessages';
import ChatNavigation from '@/components/Chat/ChatNavigation';
import AddPeople from '@/components/Modal/Chat/AddPeople';
import Links from '@/components/Modal/Chat/Links';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import PageContentLayout from '@/components/ScapComponents/PageContent';
import { auth, firestore } from '@/firebase/clientApp';
import useNavigation from '@/hooks/useNavigation';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { Typography, useTheme } from '@mui/material';
import { collection, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc, where, writeBatch } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';

type ChatProps = {
    currentThread: string;
    myUID: string;
};

const Chat:React.FC<ChatProps> = ({ currentThread , myUID }) => {

    const [user] = useAuthState(auth);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { hex2rgb } = useRgbConverter();
    const { navigatePage } = useNavigation();
    const setUsersAtomValue = useSetRecoilState(usersAtomState);
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const [threadMessage, setThreadMessage] =useState<ThreadMessage>();
    const [messageData, setMessageData] = useState<ThreadRef>();
    const [navToggle, setNavToggle] = useState(true);
    const dataFetchedRef = useRef(false);
    const dataFetchedOnSnapShotRef = useRef(false);

    //LISTEN to thread changes
    const listenToNewThread = async () => {
        const controller = new AbortController();
        const q = query(collection(firestore, "threads"), where("connections", 'array-contains', user?.uid), orderBy("latestMessageCreatedAt", "desc"), limit(1));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let thread: any[] = [];
            const source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
            //START listening  to the query
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    thread.push({id: change.doc.id, ...change.doc.data()});
                }
                if (change.type === "modified") {
                    thread.push({id: change.doc.id, ...change.doc.data()});
                }
            });
            
            // PREVENTS the listener to execute twice when the createdAt changes from null to Timestamp
            // Server when timestamp is changed
            thread.forEach(threadItem => {
                if(source == "Server" &&  thread.length > 0 && dataFetchedOnSnapShotRef.current){
                    if(threadItem.changeType === "added"){
                        if(threadItem.createdBy === user?.uid){
                            setChatThreadsValue((prev) => ({
                                ...prev,
                                threads: [threadItem, ...prev.threads],
                                currentThreadId: threadItem.id,
                                selectedThreadsArray: [...prev.selectedThreadsArray, threadItem.id] as string[]
                            }));
                            navigatePage(`/scenes/chat/u=${user?.uid}=threadKey=${threadItem.id}`);
                        }
                        else {
                            setChatThreadsValue((prev) => ({
                                ...prev,
                                threads: [threadItem, ...prev.threads],
                            }));
                        }
                    }
                    else if(threadItem.changeType === "modified"){
                        
                        const messageId = threadItem.lastMessageId.split("=");
                        const removedUID = messageId[3];

                        getNewMessage(threadItem.lastMessageId ? threadItem.lastMessageId : "_dummy", threadItem.id);

                        if(threadItem.lastMessageId.includes("addPeople")){
                            setMessageData(threadItem);
                        }

                        if(threadItem.lastMessageId.includes(`removeUser`)){
                            removeUserConnectionToThread(removedUID, threadItem.id, threadItem.connections);
                            if(removedUID === user?.uid){
                                setChatThreadsValue((prev) => ({
                                    ...prev,
                                    threads: [...prev.threads.filter(item => item.id !== threadItem.id)],
                                }));
                                return
                            }
                        }
                        //DELETE the modified thread. Then, add it at the top
                        setChatThreadsValue((prev) => ({
                            ...prev,
                            threads: [threadItem, ...prev.threads.filter(item => item.id !== threadItem.id)],
                        }));
                    }
                } 
                else if(source == "Local" && threadItem.latestMessageCreatedAt !== null){
                    if(threadItem.changeType === "modified" ){
                        setChatThreadsValue((prev) => ({
                            ...prev,
                            threads: [threadItem, ...prev.threads.filter(item => item.id !== threadItem.id)],
                        }));
                    }
                }
            })
        });
        
        return () => {
            unsubscribe();
            controller.abort();
        }
    }
    // LISTENS to seen messages
    const listenToUnseenMessages = async() => {
        const controller = new AbortController();
        const q = query(collection(firestore, "threads"), where("connections", 'array-contains', user?.uid), orderBy("lastSeen", "desc"), limit(1));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let thread: any[] = [];
            const source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
            //START listening  to the query
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    thread.push({id: change.doc.id, ...change.doc.data()});
                }
                if (change.type === "modified") {
                    thread.push({id: change.doc.id, ...change.doc.data()});
                }
            });
            thread.forEach(threadItem => {
                if(source == "Server" &&  thread.length > 0 && dataFetchedOnSnapShotRef.current){
                    let threadSeen: string[] = [];
                    threadSeen = [...threadItem.threadSeen];
                
                    if(threadSeen.includes(myUID)){
                        // const indexOfSeenThread = chatThreadsValue.threads.findIndex(thread => {
                        //     if(thread.id === seenMessage.id){
                        //         return true
                        //     }
                        // })
                        // ? UPDATING State with multiple Objects without deleting
                        setChatThreadsValue((prev) => ({
                            ...prev,
                            threads: prev.threads.map((thread, index) => 
                                // index === indexOfSeenThread ? seenMessage : obj
                                thread.id === threadItem.id ? threadItem : thread
                            ),
                        }));
                    }
                }
            });
        });

        return () => {
            unsubscribe();
            controller.abort();
        }
    }

    const getUpdatedThread = async(threadId: string) => {
        const docRef = doc(firestore, "threads", threadId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const thread: ThreadRef =  {
                id: docSnap.id,
                type: docSnap.data().type,
                groupName: docSnap.data().groupName,
                groupPhotoURL: docSnap.data().groupPhotoURL,
                createdAt: docSnap.data().createdAt,
                latestMessageCreatedAt: docSnap.data().latestMessageCreatedAt,
                connections: docSnap.data().connections,
                threadSeen: docSnap.data().threadSeen,
                lastSeen: docSnap.data().lastSeen,
                lastMessage: docSnap.data().lastMessage,
                lastMessageUID: docSnap.data().lastMessageUID,
                lastMessageId: docSnap.data().lastMessageId,
                changeType:docSnap.data().changeType,
                createdBy: docSnap.data().createdBy,
                status: docSnap.data().status,
            }
        setMessageData(thread);
        } else {
            // console.log("getUpdatedThread: No such document!");
        }
    }

    const removeUserConnectionToThread = async(uid: string, threadId: string, currentConnections: string []) => {
        try{
            
            const batch = writeBatch(firestore);

            //UPDATE new connections in thread
            batch.update(doc(firestore, `threads/${threadId}`), {
                connections: currentConnections.filter(prevUid => prevUid !== uid) as [] // DELETE connection
            });
            //DELETE user threadSnippets
            batch.delete(doc(firestore, `users/${uid}/threadSnippits`, threadId));

            if(currentConnections.length < 2){
                batch.delete(doc(firestore, `threads`, threadId));
            }

            await batch.commit();

            //GET user info from database
            const docRef = doc(firestore, "users", myUID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                if(docSnap.data().currentThread === threadId){
                    getUpdatedThread(threadId);
                    if(uid === user?.uid){
                        setNavToggle(true);
                        setChatThreadsValue((prev) => ({
                            ...prev,
                            currentSelectedThread: undefined,
                            currentThreadId: ""
                        }));
                        navigatePage(`/scenes/chat/u=${user?.uid}=threadKey=`);
                    }
                }
            } else {
            // doc.data() will be undefined in this case
                // console.log("removeUserConnectionToThread: No such document! Users");
            }
        } catch(error) {
            console.log("Error Removing user: ", error)
        }
    }

    const setSeenEntry = async(threadId: string) => {
        let newThreadSeen: string [] = [];
        const docRef = doc(firestore, "threads", threadId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const threadSean = docSnap.data().threadSeen;
            threadSean.map((item: any) => newThreadSeen.push(item));
            if(!newThreadSeen.includes(user!.uid!)){
                newThreadSeen.push(user!.uid!);
                setChatThreadsValue((prev) => ({
                    ...prev,
                    threadSeen: newThreadSeen as []
                }));

                await updateDoc(docRef, {
                    threadSeen: newThreadSeen as [],
                    lastSeen:  serverTimestamp() as Timestamp,
                });
            }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
    }
    
    const getNewMessage = async (messageId: string, threadId: string) => {
        const docRef = doc(firestore, `threads/${threadId}/messages`, messageId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const newMessage: ThreadMessage = {
                id: docSnap.id,
                threadId: docSnap.data().threadId,
                uid: docSnap.data().uid,
                text: docSnap.data().text,
                photoURL: docSnap.data().photoURL,
                file: docSnap.data().file,
                createdAt: docSnap.data().createdAt,
            }; 
            setThreadMessage(newMessage);
        } else {
            console.log("No such document!");
        } 
    }

    //Adds new message to recoil
    useEffect(() => {
        if(threadMessage){
            // Checks if new message fetched exists in threadMessage recoil
            if(chatThreadsValue.threadMessages.filter(item => item.id === threadMessage.id!).length < 1){  
                if(chatThreadsValue.selectedThreadsArray.includes(threadMessage.threadId!)){
                    setChatThreadsValue((prev) => ({
                        ...prev,
                        threadMessages: [...prev.threadMessages, threadMessage],
                    }));
                    setThreadMessage(undefined);
                }
            }
            if(threadMessage.threadId === currentThread){
                if(currentThread){
                    setSeenEntry(currentThread);
                }
            }
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadMessage])

    const getAllUsers = async () => {
        const userRef = query(collection(firestore, "users"));
        const querySnapshot = await getDocs(userRef);
        const allUsers = querySnapshot.docs.map((doc) => ({
            uid: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            userType: doc.data().userType
        })); 
        const myInfo = allUsers.filter(users => users.uid === user?.uid);
        //SET USERS to Atom
        setUsersAtomValue((prev) => ({
            ...prev,
            users: allUsers as UsersInfo[],
            myInfo: myInfo[0] as UsersInfo
        }))
    }

    const getUserThreads = async () => {
        const myThreadSnippitsRef = query(collection(firestore, `users/${user?.uid}/threadSnippits`));
        const querySnapshot = await getDocs(myThreadSnippitsRef);
        const myThreadsSnippits = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        const itemsDocs = await Promise.all(myThreadsSnippits.map(item => getDoc(doc(firestore, 'threads', item.id))));
        const threads = itemsDocs.map((item) => ({
            id: item.id,
            ...item.data()
        } as ThreadRef ));
        const spreadThreadsForSorting = [...threads];
        const sortedThreads = spreadThreadsForSorting.sort((a,b) =>  b.latestMessageCreatedAt!.seconds - a.latestMessageCreatedAt!.seconds);

        setChatThreadsValue((prev) => ({
            ...prev,
            threads: sortedThreads as ThreadRef[],
            currentThreadId: currentThread
        }));
        //PRE-SET the names
        const msgData = sortedThreads.filter(item => item.id === currentThread);
        setMessageData(msgData[0]);
        dataFetchedOnSnapShotRef.current = true;
        setSelectedThreads();
    }

    const setSelectedThreads = () => {
        const currentThreadObject = chatThreadsValue.threads.filter(item => item.id === currentThread);
        setChatThreadsValue((prev) => ({
            ...prev,
            currentSelectedThread: currentThreadObject[0] as ThreadRef,
        }));
    }

    // GET user data
    useEffect(() => {
        //RESTRICTS useEffect to run only once
        const controller = new AbortController();
        if (dataFetchedRef.current){
            return; 
        } else {
            listenToNewThread();
            listenToUnseenMessages();
            getAllUsers();
            getUserThreads();
            dataFetchedRef.current = true;
        } 
        
        
        return () => {
            controller.abort();
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    // LISTENS to selected thread and SETS to localState
    useEffect(() => {
        const controller = new AbortController();

        if(currentThread === 'error'){return}
        const msgData = chatThreadsValue.threads.filter(item => item.id === currentThread);
        setMessageData(msgData[0]);
        if(currentThread){
            setSeenEntry(currentThread);
        }
        setSelectedThreads();

        return () => {
            controller.abort();
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentThread])

    return (
        <>
            {/* <Links/>
            <AddPeople/>
            <PageContentLayout leftWidth="30%" pageType="scene" isCollapsable={true} isNotCollapsed={navToggle}>
                <ChatNavigation hex2rgb={hex2rgb} theme={theme} colors={colors} setNavToggle={setNavToggle} navToggle={navToggle} />
                {currentThread ? (
                    <ChatMessages dataConnections={messageData?.connections} dataType={messageData?.type}  currentThread={currentThread} hex2rgb={hex2rgb} theme={theme} colors={colors} setNavToggle={setNavToggle} navToggle={navToggle}/>
                ):(
                    <FlexBetween sx={{width: "100%", height: "100%", aligntItems: "center"}}>
                        <Typography variant='h4' sx={{fontWeight: 600, width: "100%", textAlign: "center", color: hex2rgb(theme.palette.text.secondary, "35").rgb}}>Select a chat or start a new conversation</Typography>
                    </FlexBetween>
                )}
            </PageContentLayout> */}
        </>
    )
}
export async function getServerSideProps(context: GetServerSidePropsContext){
    try {
        //GET threads
        const url = context.query.threads as string;
        const urlArr = url.split("=");
        const uid = urlArr[1];
        const threadId=urlArr[3];
        let docRef: DocumentReference<DocumentData>;
        let docSnap: DocumentSnapshot<DocumentData>;

        if(threadId){
            docRef = doc(firestore, "threads", threadId);
            docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                 
                const checkIfUserIsMemberRef = doc(firestore, `users/${uid}/threadSnippits`, threadId);
                const checkIfUserIsMemberSnap = await getDoc(checkIfUserIsMemberRef);
                if (checkIfUserIsMemberSnap.exists()) {
                    const userRef = doc(firestore, "users", uid);
                    await updateDoc(userRef, {
                        currentThread: threadId,
                    });
                    return {
                        props: {
                            currentThread: threadId,
                            myUID: uid
                        },
                    };
                } else {
                    return {
                        redirect: {
                            destination: `/scenes/error/404`,
                            permanent: false,
                        },
                    };
                }
            } else {
                if(threadId != undefined || threadId != ""){
                    return {
                        redirect: {
                            destination: '/scenes/error/404',
                            permanent: false,
                        },
                    };
                }
            }
        }  else {
            return {
                props: {
                    currentThread: threadId,
                    myUID: uid
                },
            };
        }
        
      } catch (error) {
        console.log("getServerSideProps error - [threads.tsx]", error);
        return { 
            props: {
                ok: false, 
                reason: "some error description for your own consumption, not for client side"
            },
        }
    }
}
export default Chat;