import { chatThreadsState, ThreadMessage } from '@/atoms/chatAtoms';
import ScapAvatar from '@/components/ScapComponents/Avatar';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import { auth, firestore, storage } from '@/firebase/clientApp';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { AttachFileOutlined, InsertPhotoOutlined, SendOutlined } from '@mui/icons-material';
import { Box, IconButton, List, ListItem, ListItemAvatar, Tooltip, useTheme } from '@mui/material';
import { addDoc, collection, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';

type ChatMessagesFooterProps = {
    currentThread: string;
    selectedFile: {
        filename: string;
        data: string;
    };
    setSelectedFile: React.Dispatch<React.SetStateAction<{
        filename: string;
        data: string;
    }>>;
    selectedImage: string;
    setSelectedImage: (value: string) => void;
    sendButton: boolean;
    setSendButoon: React.Dispatch<React.SetStateAction<boolean>>;
    selectImageRef: React.RefObject<HTMLInputElement>;
    selectFileRef: React.RefObject<HTMLInputElement>;
    onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ChatMessagesFooter:React.FC<ChatMessagesFooterProps> = ({ 
    currentThread, 
    selectImageRef, 
    selectFileRef, 
    onSelectImage,
    onSelectFile , 
    sendButton, 
    setSendButoon, 
    selectedFile, 
    setSelectedFile, 
    selectedImage, 
    setSelectedImage
}) => {
    
    const [user] = useAuthState(auth);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { isTablet, isMobile } = useMediaQueryHook();
    const { hex2rgb } = useRgbConverter();
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const [messageButtons, setMessageButtons] = useState(true);
    const chatMessage = useRef('');

    const onChangeMessageText = (input: string) => {
        chatMessage.current = input;
    }

    const onMessageFieldFocus = (value: boolean) => {
        setMessageButtons(value)
    }

    const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => { 
        event.preventDefault(); // prevents to reload the page when submit is triggered
        //CREATE new post object => type Post
        const newMessage: ThreadMessage = {
            threadId: currentThread,
            uid: user?.uid,
            text: chatMessage.current,
            photoURL: {
                url: selectedImage || "",
                isLoading: true
            },
            file: {
                filename: selectedFile.filename || "",
                data: selectedFile.data || "",
                isLoading: true
            },
        };
        // This is 'A'
        const temporaryId: string = user?.uid! + chatThreadsValue.threadMessages.length;

        setChatThreadsValue((prev) => ({
            ...prev,
            threadMessages: [...prev.threadMessages, {
                ...newMessage,
                id: temporaryId,
                createdAt: Timestamp.now()
            }],
        }));
        //------------ end of 'A'
        setSendButoon(true);
        try{
            //ADD Message
            const postDocRef = await addDoc(collection(firestore, `threads/${currentThread}/messages`), {
                ...newMessage,
                createdAt: serverTimestamp() as Timestamp
            });
            // ====== put 'A' here so we can get messageId ====
            //UPLOAD Image
            if (selectedImage) {
                setSelectedImage("");
                const imageRef = ref(storage, `chatImages/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedImage, "data_url");
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(postDocRef, {
                    photoURL: {
                        url: downloadURL,
                        isLoading: false
                    },
                });
                console.log(downloadURL)
                if(downloadURL){
                    const newMessageRecoilUpdate: ThreadMessage = {
                        id: postDocRef.id,
                        threadId: currentThread,
                        uid: user?.uid,
                        text: chatMessage.current,
                        photoURL:  {
                            url: downloadURL,
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
            if (selectedFile.filename) {
                setSelectedFile({filename: "", data: ""});
                const fileRef = ref(storage, `chatFiles/${postDocRef.id}/files`);
                await uploadString(fileRef, selectedFile.data as string, "data_url");
                const downloadURL = await getDownloadURL(fileRef);
                await updateDoc(postDocRef, {
                    file: {
                        filename: selectedFile.filename,
                        data: downloadURL,
                        isLoading: false
                    },
                });
                if(downloadURL){
                    const newMessageRecoilUpdate: ThreadMessage = {
                        id: postDocRef.id,
                        threadId: currentThread,
                        uid: user?.uid,
                        text: chatMessage.current,
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
            // Update the timestamp field with the value from the server
            const docRef = doc(firestore, 'threads', currentThread);
            await updateDoc(docRef, {
                latestMessageCreatedAt: serverTimestamp(),
                lastMessage: selectedImage ? "sent a photo." : selectedFile.filename ? "attached a file." : chatMessage.current,
                lastMessageId: postDocRef.id,
                lastMessageUID: user?.uid,
                changeType:"modified",
            });
            chatMessage.current = "";
        } catch (error: any) {
            console.log("Error ChatMessages: ", error);
        }
    }
    
    return (
        <form onSubmit={sendMessage}>
            <FlexBetween 
                sx={{
                    width:"100%", 
                    height: isMobile ? "65px" : "64px", 
                    borderTop: `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`, 
                    backgroundColor: theme.palette.primary.main,
                    position: isMobile ? "unset" : "fixed",
                    zIndex: 201,
                    bottom: 0
                }}
            >
                {isTablet ? (
                    <>
                        <Box sx={{flexGrow: 0}}>
                            <List sx={{pb: 0, pt: 0}}>
                                <ListItem sx={{p: "0px 0px 0px 16px"}}>
                                    <ListItemAvatar sx={{mr: 0,}}>
                                        <ScapAvatar 
                                            sx={{
                                                backgroundColor: colors.indigoAccent[500], 
                                                color: "white"
                                            }}
                                        >
                                            {user?.displayName?.charAt(0)}
                                        </ScapAvatar>
                                    </ListItemAvatar>
                                </ListItem>
                            </List>
                        </Box>
                        <Box sx={{flexGrow: 1}}>
                            <ScapPrimaryTextField type="text"  label="Message" name="message" setSendButoon={setSendButoon} onChangeMessageText={onChangeMessageText} sendButton={sendButton}/>
                        </Box>
                    </>
                ):(
                    <>
                        <Box sx={{flexGrow: 0, ml: 2}}>
                            {messageButtons && 
                                <>
                                    <Tooltip title="Attach Photo">
                                        <IconButton
                                            size="large"
                                            aria-label="Attach Photo"
                                            color="inherit"
                                            sx={{mr: 1}}
                                            onClick={() => selectImageRef.current?.click()}
                                        >
                                            <InsertPhotoOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Attach File">
                                        <IconButton
                                            size="large"
                                            aria-label="Attach File"
                                            color="inherit"
                                            sx={{mr: 1}}
                                            onClick={() => selectFileRef.current?.click()}
                                        >
                                            <AttachFileOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                                        </IconButton>
                                    </Tooltip>

                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        hidden
                                        ref={selectImageRef}
                                        onChange={onSelectImage}
                                    />
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="application/pdf,application/vnd.ms-excel,application/msword,application/vnd.ms-powerpoint,text/plain"
                                        hidden
                                        ref={selectFileRef}
                                        onChange={onSelectFile}
                                    />
                                </>
                            }
                        </Box>
                        <Box sx={{flexGrow: 1, ml: 2, width: "45%"}}>
                            <ScapPrimaryTextField onMessageFieldFocus={onMessageFieldFocus} type="text" setSendButoon={setSendButoon} label="Message" name="message" onChangeMessageText={onChangeMessageText} sendButton={sendButton} />
                        </Box>
                    </>
                )}

                <Box sx={{flexGrow: 0, ml: 2}}>
                    {/* All */}
                    <IconButton
                        type="submit"
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                        sx={{mr: 1}}
                        disabled={sendButton}
                        // onClick={()=>{
                        //     sendMessage();
                        // }}
                    >
                        <SendOutlined sx={{fontSize: 20, color: sendButton ? theme.palette.text.secondary : theme.palette.secondary.main}}/>
                    </IconButton>

                    {isTablet && 
                        <>
                            <Tooltip title="Attach Photo">
                                <IconButton
                                    size="large"
                                    aria-label="Attach Photo"
                                    color="inherit"
                                    sx={{mr: 1}}
                                    onClick={() => selectImageRef.current?.click()}
                                >
                                    <InsertPhotoOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Attach File">
                                <IconButton
                                    size="large"
                                    aria-label="Attach File"
                                    color="inherit"
                                    sx={{mr: 1}}
                                    onClick={() => selectFileRef.current?.click()}
                                >
                                    <AttachFileOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                                </IconButton>
                            </Tooltip>
                            
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/x-png,image/gif,image/jpeg"
                                hidden
                                ref={selectImageRef}
                                onChange={onSelectImage}
                            />
                            <input
                                id="file-upload"
                                type="file"
                                accept="application/pdf,application/vnd.ms-excel,application/msword,application/vnd.ms-powerpoint,text/plain"
                                hidden
                                ref={selectFileRef}
                                onChange={onSelectFile}
                            />
                        </>
                    }
                </Box>
            </FlexBetween>
        </form>
    )
}
export default ChatMessagesFooter;