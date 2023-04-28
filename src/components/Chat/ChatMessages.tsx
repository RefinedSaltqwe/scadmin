import { chatThreadsState, ThreadRef } from '@/atoms/chatAtoms';
import { messageDataState } from '@/atoms/messageData';
import { usersAtomState, UsersInfo } from '@/atoms/usersAtom';
import { auth } from '@/firebase/clientApp';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue } from 'recoil';
import ScapInsideLoading from '../ScapComponents/insideLoadings';
import ChatMessagesBody from './ChatMessagesComponents/Body';
import ChatInfo from './ChatMessagesComponents/ChatInfo';
import ChatMessagesFooter from './ChatMessagesComponents/Footer';
import MessageNav from './ChatMessagesComponents/Nav';

const FilePreview = dynamic(() => import("./ChatMessagesComponents/FilePreview"), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

const ImagePreview = dynamic(() => import("./ChatMessagesComponents/ImagePreview"), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

type ChatMessagesProps = {
    theme: any;
    hex2rgb: (hex: any, opacity: string) => {rgb: string};
    colors: any;
    currentThread: string;
    dataFetchedOnSnapShotRef: React.MutableRefObject<boolean>;
    setSeenEntry: (threadId: string) => Promise<void>;
    setSelectedThreads: () => void;
};

const ChatMessages:React.FC<ChatMessagesProps> = ({setSelectedThreads, setSeenEntry, theme, hex2rgb, colors, currentThread, dataFetchedOnSnapShotRef}) => {
    
    const [user] = useAuthState(auth);
    const { isMobile } = useMediaQueryHook();
    const usersAtomValue = useRecoilValue(usersAtomState);
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const [messageDataValue, setMessageDataValue] = useRecoilState(messageDataState);
    const [loading, setLoading] = useState(true);
    const [threadType, setThreadType] = useState("");
    const [threadCreator, setThreadCreator] = useState("");
    const [currentThreadUsernames, setCurrentThreadUsernames] = useState("");
    const [selectedFile, setSelectedFile] = useState({
        filename: "",
        data:""
    });
    const [selectedImage, setSelectedImage] = useState<string>();
    const [getUserThreadInfo, setGetUserThreadInfo] = useState<UsersInfo[]>([]);
    const [sendButton, setSendButoon] = useState(true);
    const selectFileRef = useRef<HTMLInputElement>(null);
    const selectImageRef = useRef<HTMLInputElement>(null);

    const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile({filename: "", data: ""});
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
            setSendButoon(false)
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedImage(readerEvent.target?.result as string);
            }
        };
    };
    
    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedImage("");
        let filename: string ="";
        
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
            filename = event.target.files[0].name;
            setSelectedFile(prev => ({
                ...prev,
                filename: filename,
            }));
            // console.log(event.target.files?.[0].name)
            setSendButoon(false)
        }
        // console.log(reader.name)
        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(prev => ({
                    ...prev,
                    data: readerEvent.target?.result as string
                }));
            }
        };
    };

    // * GET selected thread messages
    useEffect(() => {
        const controller = new AbortController();
        //GET uid name
        let arr: string[] = [];
        let arrWithMyName: string[] = [];
        let getUserInfo: UsersInfo[] = [];
        let names ="";
        const getThread = chatThreadsValue.threads.filter(item => item.id === currentThread);
        setMessageDataValue({messageData: getThread[0]});
        
        if(currentThread){
            setLoading(true);
            setSeenEntry(currentThread);
        }
        setSelectedThreads();
        if(messageDataValue.messageData.connections){
            const dataConnections = messageDataValue.messageData.connections;
            //ELIMINATE MyName
            const eliminateMyName = dataConnections.filter((item) => item !== user?.uid);
            //CONVERT 2 Dimensional Array into 1 Dimensional Array
            eliminateMyName.forEach((doc) =>  { arr.push(doc)});
            dataConnections.forEach((doc) =>  { arrWithMyName.push(doc)});
            //ELIMINATE Duplicates
            const completedUIDs = arr.filter((item, index) => arr.indexOf(item) === index).filter(item2 => item2 !== "");
            const completedUIDsWithCurrentUser = arrWithMyName.filter((item, index) => arrWithMyName.indexOf(item) === index).filter(item2 => item2 !== "");
            //GET all user names
            getUserInfo = usersAtomValue.users.filter(item1 => completedUIDs.includes(item1.uid));

            const myName = usersAtomValue.users.filter(item1 => user?.uid === item1.uid);
            if(getUserInfo.length === 0){
                names= myName[0].firstName + " " + myName[0].lastName;
            }
            
            getUserInfo.forEach((doc, index) => {
                if(getUserInfo.length-1 != index ){
                    names += doc.firstName + " " + doc.lastName + ", "
                } else {
                    names += doc.firstName + " " + doc.lastName
                }
            })
            setCurrentThreadUsernames(names);
            setGetUserThreadInfo(usersAtomValue.users.filter(item1 => completedUIDsWithCurrentUser.includes(item1.uid)));
            if(currentThread){setLoading(false);}
        }
        
        if(getThread.length > 0){
            setThreadType(getThread[0].type);
            if(getThread[0].createdBy){
                setThreadCreator(getThread[0].createdBy);
            }
            setChatThreadsValue((prev) => ({
                ...prev,
                currentSelectedThread: getThread[0] as ThreadRef,
            }));
        }
        
        return () => {
            controller.abort();
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentThread, messageDataValue.messageData.connections]);

    return ( 
        <>
            {/* MESSAGES */}
            <Box sx={{ flexGrow:1, height: "100%", display: "flex", flexDirection: "column", position: "relative", borderRight: isMobile ? `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid` : ""}}>
                {loading ? (
                    <ScapInsideLoading/>
                ):(
                    <>
                        {/* NAV */}
                        <MessageNav currentThread={currentThread} hex2rgb={hex2rgb} dataType={messageDataValue.messageData.type} currentThreadUsernames={currentThreadUsernames} colors={colors}/>
                        {/* BODY */}
                        <ChatMessagesBody setSeenEntry={setSeenEntry} getUserThreadInfo={getUserThreadInfo} dataFetchedOnSnapShotRef={dataFetchedOnSnapShotRef} currentThread={currentThread} threadType={threadType}/>
                        {/* IMAGE PREVIEW */}
                        {selectedImage &&
                            <ImagePreview  selectedImage={selectedImage} setSelectedImage={setSelectedImage} setSendButoon={setSendButoon} />
                        }
                        {selectedFile.filename &&
                            <FilePreview  selectedFile={selectedFile} setSelectedFile={setSelectedFile} setSendButoon={setSendButoon} />
                        }
                        {/* FOOTER */}
                        {chatThreadsValue.currentSelectedThread?.status !== "blocked" && 
                            <ChatMessagesFooter 
                                selectedFile={selectedFile}
                                setSelectedFile={setSelectedFile}
                                selectedImage={selectedImage as string}
                                setSelectedImage={setSelectedImage}
                                sendButton={sendButton}
                                setSendButoon={setSendButoon}
                                currentThread={currentThread} 
                                selectFileRef={selectFileRef}
                                selectImageRef={selectImageRef}
                                onSelectImage={onSelectImage}
                                onSelectFile={onSelectFile}
                            />
                        }
                    </>
                )}
            </Box>
            {/* THREAD INFORMATION */}
            <ChatInfo currentThread={currentThread} hex2rgb={hex2rgb} threadType={threadType} getUserThreadInfo={getUserThreadInfo} threadCreator={threadCreator} />
            
        </>
    )
}
export default memo(ChatMessages);