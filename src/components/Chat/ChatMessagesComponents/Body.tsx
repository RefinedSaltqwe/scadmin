import { chatThreadsState, nextThreadRef } from '@/atoms/chatAtoms';
import { loadingNavigateMessageState } from '@/atoms/loadingNavigateMessage';
import { threadMessageState } from '@/atoms/threadMessageAtom';
import { UsersInfo, usersAtomState } from '@/atoms/usersAtom';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapInsideLoading from '@/components/ScapComponents/insideLoadings';
import { auth, firestore } from '@/firebase/clientApp';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { ArrowDownwardOutlined, QuestionAnswerOutlined } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue } from 'recoil';

const LeftMessage = dynamic(()=> import("../LeftMessage"),{
    ssr: false,
});

const RightMessage = dynamic(()=> import("../RightMessage"),{
    ssr: false,
});

const ImageModal = dynamic(() => import("@/components/Modal/Chat/ImageModal"), {
    ssr: false,
});

type ChatMessagesBodyProps = {
    currentThread: string;
    threadType: string;
    dataFetchedOnSnapShotRef: React.MutableRefObject<boolean>;
    getUserThreadInfo: UsersInfo[];
    setSeenEntry: (threadId: string) => Promise<void>;
};

const ChatMessagesBody:React.FC<ChatMessagesBodyProps> = ({setSeenEntry, currentThread, threadType, dataFetchedOnSnapShotRef, getUserThreadInfo}) => {

    const [user] = useAuthState(auth);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { isMobile } = useMediaQueryHook();
    const { hex2rgb } = useRgbConverter();
    const usersAtomValue = useRecoilValue(usersAtomState);
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const [threadMessageValue, setThreadMessageValue] = useRecoilState(threadMessageState);
    const [loadingSelectThread, setLoadingSelectThread] = useRecoilState(loadingNavigateMessageState);
    const [loadingNewMessages, setLoadingNewMessages] = useState(false);
    const [showScrollToBottom, setShowScrollToBottom] = useState(true);
    const [newMessageNotification, setNewMessageNotification] = useState("");
    const [openImageModal, setOpenImageModal] = useState({open: false, imgURL:""});
    const topRef = useRef<null | HTMLElement>(null);
    const divRef = useRef<null | HTMLElement>(null);
    const insideDivRef = useRef<null | HTMLElement>(null);
    const activateScrollBottom = useRef(true);
    const endMessage = useRef('');
    const dataFetchedRef = useRef(false);
    const dataPopulatedLoader = useRef(true);
    const bottomRef = useRef<null | HTMLElement>(null);
    
    const scrollOffset = () =>{
        topRef.current?.scrollIntoView({behavior: "auto", block: "center"});
    }
    
    const scrollToBottom = (behavior: ScrollBehavior | undefined) => {
        bottomRef.current?.scrollIntoView({behavior: behavior});
    }
    
    const loadNextMessages = async() => {
        try{
            const lastVisible = chatThreadsValue.threadMessages.filter(item => item.threadId == currentThread);
            const next = query(collection(firestore, `threads/${currentThread}/messages`), orderBy("createdAt", "desc"), startAfter(lastVisible[0].createdAt), limit(25));
            const querySnapshot = await getDocs(next);
            const messages = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                threadId: doc.data().threadId,
                uid: doc.data().uid,
                text: doc.data().text,
                photoURL: doc.data().photoURL,
                file: doc.data().file,
                createdAt: doc.data().createdAt,
            })); 

            if(messages.length < 25){
                const nexThread: nextThreadRef = {
                    threadId: currentThread, 
                    document: "max"
                }
                setChatThreadsValue((prev) => ({
                    ...prev,
                    nextThread: [...prev.nextThread.filter(item => item.threadId !== currentThread), nexThread]
                }));
            }
            messages.forEach(item => 
                setChatThreadsValue((prev) => ({
                    ...prev,
                    threadMessages: [item, ...prev.threadMessages],
                }))
            );
            setLoadingNewMessages(false);
            scrollOffset();
        } catch(error){
            console.log("Error loadNextMessages: ", error);
        }
    }

    //SCROLL----------------
    const onScrollMessage = (event: any) => {
        const parentDivHeight = divRef?.current?.clientHeight;
        const childDivHeight = insideDivRef?.current?.clientHeight;
        const scrollHeight = event.currentTarget.scrollHeight;
        const clientHeight  = event.currentTarget.clientHeight;
        let scrollTop = event.currentTarget.scrollTop;
        let currentScrollHeight = Math.abs(scrollHeight - clientHeight - scrollTop) > 200;

        // console.log(scrollHeight-clientHeight ," == ", Math.abs(scrollHeight - clientHeight - scrollTop))

        if(scrollHeight-clientHeight == Math.abs(scrollHeight - clientHeight - scrollTop)){
            const getThreadNextItemIdentifier = chatThreadsValue.nextThread.filter(item => item.threadId === currentThread);
            if(getThreadNextItemIdentifier[0]){
                if(getThreadNextItemIdentifier[0].document === "more"){
                    setLoadingNewMessages(true);
                    loadNextMessages();
                    activateScrollBottom.current = false;
                }
            }
        }
    
        if(childDivHeight && parentDivHeight){
            if(childDivHeight > parentDivHeight){
                setShowScrollToBottom(currentScrollHeight);
            } 
        }

        if(!currentScrollHeight){
            setNewMessageNotification("");
        }
    }

    //Adds new message to recoil
    useEffect(() => {
        if(threadMessageValue.threadMessage){
            // Checks if new message fetched exists in threadMessage recoil
            if(chatThreadsValue.threadMessages.filter(item => item.id === threadMessageValue.threadMessage?.id!).length < 1){  
                if(chatThreadsValue.selectedThreadsArray.includes(threadMessageValue.threadMessage.threadId!)){
                    setChatThreadsValue((prev) => ({
                        ...prev,
                        threadMessages: [...prev.threadMessages, threadMessageValue.threadMessage!],
                    }));
                    setThreadMessageValue({threadMessage: undefined});
                }
            }
            if(threadMessageValue.threadMessage.threadId === currentThread){
                if(currentThread){
                    setSeenEntry(currentThread);
                }
            }
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadMessageValue]);

    // End of Message COntrol
    useEffect(() => {
        const getThreadNextItemIdentifier = chatThreadsValue.nextThread.filter(item => item.threadId === currentThread);
        if(getThreadNextItemIdentifier.length > 0){
            endMessage.current = getThreadNextItemIdentifier[0].document;
            // console.log("bs: ",getThreadNextItemIdentifier);
        }
        dataPopulatedLoader.current = true;
      }, [chatThreadsValue.nextThread, currentThread]);//eslint-disable-next-line react-hooks/exhaustive-deps

      // Auto Scroll Control
    useEffect(() => {
        // console.log(chatThreadsValue.threadMessages[chatThreadsValue.threadMessages.length-1])
        const parentDivHeight = divRef?.current?.clientHeight;
        const childDivHeight = insideDivRef?.current?.clientHeight;

        if(childDivHeight && parentDivHeight){
            if(childDivHeight < parentDivHeight){
                setShowScrollToBottom(false);
            } 
        }

        if(activateScrollBottom.current){
            if(showScrollToBottom && dataFetchedRef.current){
                if(chatThreadsValue.threadMessages.length > 0){
                    if(chatThreadsValue.threadMessages[chatThreadsValue.threadMessages.length-1].uid !== user?.uid){
                        setNewMessageNotification("New Message");
                    }else {
                        scrollToBottom("auto");
                    }
                }
            } else {
                scrollToBottom("auto");
            }
        }
        if(chatThreadsValue.threadMessages.length > 0 && !dataFetchedRef.current){
            dataFetchedRef.current = true;
        }
        activateScrollBottom.current = true;
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatThreadsValue.threadMessages]);
    // console.log(chatThreadsValue.threadMessages.filter(message => {return message.threadId === currentThread}).map((message, index) => { return message }))
    return (
        <>
            <ImageModal setOpenImageModal={setOpenImageModal} openImageModal={openImageModal}/>
            {loadingSelectThread && (
                <>
                    {/* LOADING */}
                    <Box sx={{display: "flex", position: "absolute", zIndex: 200, height: "100%", width: "100%", backgroundColor: theme.palette.primary.main}} >
                        <ScapInsideLoading/>
                    </Box>
                </>
            )}
            <FlexBetween 
                onScroll={onScrollMessage}
                ref={divRef}
                sx={{ 
                    width:"100%", 
                    height: "100%", 
                    flexGrow: 1, 
                    overflowX: "hidden",
                    overflowY: "auto",
                    paddingRight: "auto",
                    alignItems: "flex-start",
                    mb: isMobile ? "0px" : "64px"
                }}
            >
                <FlexBetween ref={insideDivRef} sx={{height:"auto", width: "100%", p: "24px 24px 4px 24px", display:"block"}}>
                    {chatThreadsValue.threadMessages.filter(item => item.threadId === currentThread).length > 1
                    ? (
                        <>
                            <FlexBetween sx={{flexDirection: "column", pb: "10px", display: endMessage.current === "max" ? "flex" : "none" }}>
                                <Typography variant='body2' sx={{color: colors.grey[300]}}>- End of Message -</Typography>
                            </FlexBetween>
                            <FlexBetween sx={{flexDirection: "column", pb: "10px", display: loadingNewMessages ? "flex" : "none" }}>
                                <CircularProgress 
                                    size={20}
                                    thickness={4}
                                    sx={{
                                        '&.MuiCircularProgress-root': {
                                            animation: "animation-61bdi0 .4s linear infinite"
                                        },
                                        color: colors.grey[300],
                                    }} 
                                />
                            </FlexBetween>
                        </>
                    ) : (
                        <FlexBetween sx={{width: "inherit", height: "100%", position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0}}>
                            <Box sx={{display: "flex", flexDirection:"column", width:"100%", alignItems: "center", color: hex2rgb(theme.palette.text.secondary, "35").rgb}}>
                                <QuestionAnswerOutlined sx={{width: "100px", height: "100px", mb: 1}} />
                                <Typography variant='h4' sx={{fontWeight: 600, width: "100%", textAlign: "center"}}>Start meaningful conversations!</Typography>
                            </Box>
                        </FlexBetween>
                    )}
                    {chatThreadsValue.threadMessages.filter(message => {return message.threadId === currentThread}).map((message, index) => {
                        const getNameObject = usersAtomValue.users.filter(item => item.uid === message.uid);
                        const fullName = getNameObject.length > 0 ? getNameObject[0].firstName + " " + getNameObject[0].lastName : "No Name";
                        const userBlocker = message!.uid!.split("=");
                        const kaChatInfo = getUserThreadInfo.filter(userInfo => userInfo.uid !== user?.uid);

                        // * Message Loader
                        // console.log(index +1 ," == ", chatThreadsValue.threadMessages.length)
                        if(index + 1  === chatThreadsValue.threadMessages.filter(item => {return item.threadId === currentThread}).length && dataPopulatedLoader.current){
                            dataPopulatedLoader.current = false;
                            setTimeout(() => {
                                scrollToBottom("auto");
                                setTimeout(() => {
                                    setLoadingSelectThread(false);
                                    dataFetchedOnSnapShotRef.current = true;
                                },100)
                            }, 900);
                        }

                        if(message.uid !== "_dummy"){
                            if(message.uid === user?.uid){
                                return (
                                    <FlexBetween key={index} sx={{alignItems: "flex-start", width: "100%", pb: "15px"}}>
                                        {index === 23 && <Box ref={topRef}></Box>}
                                        <RightMessage theme={theme} colors={colors} threadMessages={message} setOpenImageModal={setOpenImageModal} />
                                    </FlexBetween>
                                )
                            } else if(message.uid !== user?.uid && (message.uid && !message.uid.includes("chatSystem="))){
                                return (
                                    <FlexBetween key={index} sx={{alignItems: "flex-start", width: "100%", pb: "15px"}}>
                                        {index === 23 && <Box ref={topRef}></Box>}
                                        <LeftMessage theme={theme} colors={colors} threadMessages={message} fullName={fullName} threadType={threadType}  setOpenImageModal={setOpenImageModal} />
                                    </FlexBetween>
                                )
                            } else {
                                return (
                                    <FlexBetween key={index} sx={{alignItems: "flex-start", width: "100%", pb: "15px", justifyContent: "center"}}>
                                        {index === 23 && <Box ref={topRef}></Box>}
                                        <Typography variant="body2" sx={{color: theme.palette.text.secondary}} >
                                            {(message.text === "blocked" || message.text === "unblocked") 
                                            ? userBlocker[1] === user?.uid ? `You ${message.text} ${kaChatInfo[0].firstName}.` : `${kaChatInfo[0].firstName} ${message.text} you.`
                                            : message.text}
                                        </Typography>
                                    </FlexBetween>
                                )
                            }
                        }
                    })}
                    {chatThreadsValue.threadMessages.filter(item => item.threadId === currentThread).length > 0 &&
                        <FlexBetween 
                            sx={{
                                flexDirection: "column", 
                                position:"sticky", 
                                overflow: "hidden", 
                                bottom: 0, 
                                height: showScrollToBottom ? "48px" : "0px", 
                                transition: "height 500ms cubic-bezier(0, 0, 0.16, 1.01)"
                            }}
                        >
                            <Tooltip title="Scroll to Bottom" placement="top">
                                <IconButton
                                    size="small"
                                    aria-label="Scroll to Bottom"
                                    color="inherit"
                                    sx={{
                                        bottom: showScrollToBottom ? "0" : "-75px",
                                        mb: 2, 
                                        mt: "2px",
                                        bgcolor: theme.palette.mode === "dark" ? theme.palette.primary.dark : "#f6f6f6",
                                        boxShadow:"rgb(0 0 0 / 8%) 2px 2px 6px, rgb(0 0 0 / 6%) 0px 0px 0px 0.5px",
                                        p: newMessageNotification === "" ? "5px" : "8px",
                                        borderRadius: newMessageNotification === "" ? "50%" : "10px 10px",
                                        transition: "bottom 400ms cubic-bezier(0, 0, 0.16, 1.01)"
                                    }}
                                    onClick={() => {
                                        scrollToBottom("smooth");
                                    }}
                                >
                                    <Typography sx={{ color:theme.palette.text.secondary, mr: newMessageNotification === "" ? "0" : "5px", ml: newMessageNotification === "" ? "0" : "5px"}} variant="body2" >{newMessageNotification + " "}</Typography><ArrowDownwardOutlined sx={{fontSize: 20, color: theme.palette.secondary.main}}/>
                                </IconButton>
                            </Tooltip>
                        </FlexBetween>
                    }
                    <Box ref={bottomRef}></Box>
                </FlexBetween>
            </FlexBetween>
        </>
    )
}
export default memo(ChatMessagesBody);