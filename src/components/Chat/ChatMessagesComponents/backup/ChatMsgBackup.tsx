import { chatThreadsState, nextThreadRef, ThreadMessage } from '@/atoms/chatAtoms';
import { usersAtomState, UsersInfo } from '@/atoms/usersAtom';
import { auth, firestore } from '@/firebase/clientApp';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { ArrowBackIosNewOutlined, ArrowDownwardOutlined, ArrowForwardIosOutlined, AttachFileOutlined, Bolt, CameraAltOutlined, Close, InsertPhotoOutlined, LocalPhoneOutlined, MoreHorizOutlined, SendOutlined } from '@mui/icons-material';
import { Avatar, Badge, Box, Button, CircularProgress, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from '@mui/material';
import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, startAfter, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue } from 'recoil';
import ScapAvatar from '../../../ScapComponents/Avatar';
import FlexBetween from '../../../ScapComponents/FlexBetween';
import ScapPrimaryTextField from '../../../ScapComponents/PrimaryTextField';
import { StyledBadge } from '../../../ScapComponents/ScapAvatarBadge';
import ImagePreview from '../ImagePreview';
import LeftMessage from '../../LeftMessage';
import RightMessage from '../../RightMessage';

type ChatMessagesProps = {
    theme: any;
    hex2rgb: (hex: any, opacity: string) => {rgb: string};
    colors: any;
    setNavToggle: (value: React.SetStateAction<boolean>) => void;
    navToggle: boolean;
    dataConnections?: [];
    messagesData?:ThreadMessage[];
    currentThread: string;
    dataType?: string;
};


const ChatMessages:React.FC<ChatMessagesProps> = ({theme, hex2rgb, colors, setNavToggle, navToggle, dataType, currentThread, dataConnections, messagesData}) => {
    
    const [user] = useAuthState(auth);
    const { isTablet, isLaptop, isDesktop } = useMediaQueryHook();
    const usersAtomValue = useRecoilValue(usersAtomState);
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const [loading, setLoading] = useState(true);
    const [messageButtons, setMessageButtons] = useState(true);
    const [threadType, setThreadType] = useState("");
    const [sendButton, setSendButoon] = useState(true);
    const [showScrollToBottom, setShowScrollToBottom] = useState(true);
    const [newMessageNotification, setNewMessageNotification] = useState("");
    const [currentThreadUsernames, setCurrentThreadUsernames] = useState("");
    const [loadingNewMessages, setLoadingNewMessages] = useState(false)
    const [style, setStyle] = useState({
        overflow: "hidden",
        paddingRight: "6px"
    });
    const topRef = useRef<null | HTMLElement>(null);
    const bottomRef = useRef<null | HTMLElement>(null);
    const divRef = useRef<null | HTMLElement>(null);
    const insideDivRef = useRef<null | HTMLElement>(null);
    const dataFetchedRef = useRef(false);
    const activateScrollBottom = useRef(true);
    const chatMessage = useRef('');
    const endMessage = useRef('');
    
    const toggleChatScrollBar = (value: string) => {
        let pr = '0px';
    
        if(value == "hidden"){
            pr="6px"
        }
        setStyle({
            overflow: value,
            paddingRight: pr
        })
    }

    const onChangeMessageText = (input: string) => {
        chatMessage.current = input;
    }

    const onMessageFieldFocus = (value: boolean) => {
        setMessageButtons(value)
    }
    
    const scrollToBottom = (behavior: ScrollBehavior | undefined) => {
        bottomRef.current?.scrollIntoView({behavior: behavior});
    }

    const scrollOffset = () =>{
        topRef.current?.scrollIntoView({behavior: "auto", block: "center"});
    }

    const sendMessage = async () => {
        
        //CREATE new post object => type Post
        const newMessage: ThreadMessage = {
            threadId: currentThread,
            uid: user?.uid,
            text: chatMessage.current,
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
        };
        // This is 'A'
        const newMessageRecoil: ThreadMessage = {
            id:"",
            threadId: currentThread,
            uid: user?.uid,
            text: chatMessage.current,
            photoURL: {
                url: "",
                isLoading: true
            },
            file: {
                filename: "",
                data: "",
                isLoading: true
            },
            createdAt: Timestamp.now() 
        };
        setChatThreadsValue((prev) => ({
            ...prev,
            threadMessages: [...prev.threadMessages, newMessageRecoil],
        }));
        //------------ end of 'A'
        setSendButoon(true);
        try{
            const postDocRef = await addDoc(collection(firestore, `threads/${currentThread}/messages`), newMessage);
            // ====== put 'A' here so we can get messageId ====
            // Update the timestamp field with the value from the server
            const docRef = doc(firestore, 'threads', currentThread);
            const updateTimestamp = await updateDoc(docRef, {
                latestMessageCreatedAt: serverTimestamp(),
                lastMessage: chatMessage.current,
                lastMessageId: postDocRef.id,
                lastMessageUID: user?.uid,
                changeType:"modified",
            });
        } catch (error: any) {
            console.log("Error ChatMessages: ", error);
        }
    }
    //Triggers when user presses ENTER on keyboard to submit
    const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
        
        const nonPrintableKeys = ['Insert', 'Enter', 'Shift', 'Control', 'Alt', 'Pause/Break', 'CapsLock', 'Escape', 
        'End', 'Home', 'Left', 'Up', 'Right', 'Down', 'Cmd', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Delete', 
        'Meta', 'Backspace', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

        if (event.key === 'Enter' && !sendButton) {
            sendMessage();
        } 
    };
    const loadNextMessages = async() => {
        // console.log("End of message => get next 10. Thread Messages: ", chatThreadsValue.threadMessages.filter(item => item.threadId == currentThread).length)
        
        const lastVisible = chatThreadsValue.threadMessages.filter(item => item.threadId == currentThread);
        // console.log("Prev: ",lastVisible)
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
        // console.log("Fetched: ",messages);

        if(messages.length < 25){

            const nexThread: nextThreadRef = {
                threadId: currentThread, 
                document: "max"
            }

            setChatThreadsValue((prev) => ({
                ...prev,
                nextThread: [...prev.nextThread.filter(item => item.threadId !== currentThread), nexThread]
            }))
        }
        messages.forEach(item => 
            setChatThreadsValue((prev) => ({
                ...prev,
                threadMessages: [item, ...prev.threadMessages],
            }))
        )
        setLoadingNewMessages(false);
        scrollOffset();
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
            if(getThreadNextItemIdentifier[0].document === "more"){
                setLoadingNewMessages(true);
                loadNextMessages();
                activateScrollBottom.current = false;
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
    
    // End of Message COntrol
    useEffect(() => {
        const getThreadNextItemIdentifier = chatThreadsValue.nextThread.filter(item => item.threadId === currentThread);
        if(getThreadNextItemIdentifier.length > 0){
            endMessage.current = getThreadNextItemIdentifier[0].document;
            // console.log("bs: ",getThreadNextItemIdentifier);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
      }, [chatThreadsValue.nextThread, currentThread]);

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
        activateScrollBottom.current = true
        //eslint-disable-next-line react-hooks/exhaustive-deps
      }, [chatThreadsValue.threadMessages]);

    //GET selected thread messages
    useEffect(() => {
        setTimeout(() => {
            scrollToBottom("auto");
        }, 500);
        const getThreadType = chatThreadsValue.threads.filter(item => item.id == currentThread);
        if(getThreadType.length > 0){
            setThreadType(getThreadType[0].type);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
      }, [currentThread]); 

    useEffect(() => {
        //GET uid name
        let arr: string[] = [];
        let getUserInfo: UsersInfo[] =[];
        let names ="";
        if(currentThread){setLoading(true);}
        if(dataConnections){
            const connections = dataConnections;
            //ELIMINATE MyName
            const eliminateMyName = connections.filter((item) => item !== user?.uid);
            //CONVERT 2 Dimensional Array into 1 Dimensional Array
            eliminateMyName.forEach((doc) =>  { arr.push(doc)}); 
            //ELIMINATE Duplicates
            const completedUIDs = arr.filter((item, index) => arr.indexOf(item) === index).filter(item2 => item2 !== "");
            //GET all user names
            getUserInfo = usersAtomValue.users.filter(item1 => completedUIDs.includes(item1.uid));
            getUserInfo.forEach((doc, index) => {
                if(getUserInfo.length-1 != index ){
                    names += doc.firstName + " " + doc.lastName + ", "
                } else {
                    names += doc.firstName + " " + doc.lastName
                }
            })
            setCurrentThreadUsernames(names);
            if(currentThread){setLoading(false);}
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataConnections]); 
    // console.log("re-rendering test");
    return ( 
        <Box sx={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
            {loading ? (
                <Box sx={{height: "100%", width: "100%", padding: "50vh 0", display: "flex", alignContent: "center"}}>
                    <FlexBetween sx={{justifyContent: "center", width: "100%"}}>
                        <CircularProgress 
                            size={60}
                            thickness={2}
                            sx={{
                                '&.MuiCircularProgress-root': {
                                    animation: "animation-61bdi0 .7s linear infinite"
                                },
                                color: theme.palette.secondary.main,
                                position: "absolute"
                            }} 
                        />
                        <Bolt sx={{position: "absolute", fontSize: 30}}/>
                    </FlexBetween>
                </Box>
            ):(
                <>
                    {/* HEADER */}
                    <FlexBetween 
                        sx={{
                            height: "67px", 
                            width:"100%", 
                            borderBottom: `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`,
                            backgroundColor: theme.palette.primary.main
                        }}
                    >
                        <Tooltip title="Toggle Chat Menu">
                            <IconButton 
                                size="large" 
                                aria-label="show 4 new mails" 
                                color="inherit" 
                                sx={{ml: 2}}
                                onClick={() => {
                                    setNavToggle(navToggle ? false : true)
                                }}
                            >
                                {navToggle ? (
                                    <ArrowBackIosNewOutlined sx={{fontSize: 18, color: theme.palette.text.secondary}}/>
                                ):(
                                    <ArrowForwardIosOutlined sx={{fontSize: 18, color: theme.palette.text.secondary}}/>
                                )}
                                
                            </IconButton>
                        </Tooltip>
                    </FlexBetween>
                    {/* NAV */}
                    <FlexBetween 
                        sx={{
                                height: "67px", 
                                width: "100%", 
                                borderBottom: `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`,
                                backgroundColor: theme.palette.primary.main
                            }}
                        >
                        <Box sx={{flexGrow: 1, height:"-webkit-fill-available", width: isTablet ? "auto" : "70px"}}>
                            <List sx={{pb: 0, pt: 0}}>
                                <ListItem 
                                    sx={{
                                        pt: isTablet ? "8px" : "0px",
                                        pb: isTablet ? "8px" : "0px",
                                        maxWidth: isTablet ? isDesktop? "500px" : isLaptop ? "370px" :  "275px" : "275px"
                                    }}
                                >
                                    <ListItemAvatar  sx={{ mr: 0, }} >
                                        <StyledBadge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                variant="dot"
                                                sx={{
                                                    '& .MuiBadge-badge': {
                                                        backgroundColor: true ? "#44b700" : "grey",
                                                        color: true ? "#44b700" : "transparent",
                                                    }
                                                }}
                                            >
                                                <ScapAvatar 
                                                    sx={{
                                                        backgroundColor: dataType === "group" ? colors.blueAccent[500] : colors.greenAccent[500], 
                                                        color: "white"
                                                    }}
                                                >
                                                    {dataType === "group" ? "G" : "P"}
                                                </ScapAvatar>
                                            </StyledBadge>
                                    </ListItemAvatar>

                                    <ListItemText 
                                        disableTypography
                                        primary={
                                            <Typography 
                                                variant='body1' 
                                                style={{
                                                    color: theme.palette.text.primary,
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    width: "100%"
                                                }}
                                            >
                                                    {currentThreadUsernames}
                                            </Typography>
                                        } 
                                        secondary={
                                            <Typography 
                                                variant='body2' 
                                                style={{
                                                    color: theme.palette.text.secondary,
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis"
                                                }}
                                                >
                                                    Last active 3 days ago.
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Box>
                        <Box sx={{flexGrow: 0}}>
                        
                            <Tooltip title="Video Call">
                                <IconButton
                                    size="large"
                                    aria-label="show 17 new notifications"
                                    color="inherit"
                                    sx={{mr: 1}}
                                >
                                    <LocalPhoneOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Video Call">
                                <IconButton
                                    size="large"
                                    aria-label="show 17 new notifications"
                                    color="inherit"
                                    sx={{mr: 1}}
                                >
                                    <CameraAltOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="More Options">
                                <IconButton
                                    size="large"
                                    aria-label="show 17 new notifications"
                                    color="inherit"
                                    sx={{mr: 1}}
                                >
                                    <MoreHorizOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                                </IconButton>
                            </Tooltip>

                        </Box>
                    </FlexBetween>
                    {/* BODY */}
                    <FlexBetween 
                        onMouseEnter={() => {toggleChatScrollBar("scroll")}}
                        onMouseLeave={() => {toggleChatScrollBar("hidden")}}
                        onScroll={onScrollMessage}
                        ref={divRef}
                        sx={{ 
                                width:"100%", 
                                height: "100%", 
                                flexGrow: 1, 
                                overflowY: isTablet ? style.overflow : "auto",
                                overflowX: "hidden",
                                paddingRight: isTablet ? style.paddingRight : "auto",
                                alignItems: "flex-start"
                        }}
                    >
                        <FlexBetween ref={insideDivRef} sx={{height:"auto", width: "100%", p: "24px 24px 4px 24px", display:"block"}}>
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
                            
                            {chatThreadsValue.threadMessages.map((message, index) => {
                                const getNameObject = usersAtomValue.users.filter(item => item.uid === message.uid);
                                const fullName = getNameObject.length > 0 ? getNameObject[0].firstName + " " + getNameObject[0].lastName : "No Name";
                                
                                if(message.threadId === currentThread){
                                    if(message.uid === user?.uid){
                                        return (
                                            <FlexBetween key={index} sx={{alignItems: "flex-start", width: "100%", pb: "20px"}}>
                                                {index === 23 && <Box ref={topRef}></Box>}
                                            </FlexBetween>
                                        )
                                    } else {
                                        return (
                                            <FlexBetween key={index} sx={{alignItems: "flex-start", width: "100%", pb: "20px"}}>
                                                {index === 23 && <Box ref={topRef}></Box>}
                                            </FlexBetween>
                                        )
                                    }
                                }
                            })}
                            
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
                            <Box ref={bottomRef}></Box>
                        </FlexBetween>
                    </FlexBetween>
                    {/* FOOTER */}
                    <FlexBetween 
                        sx={{
                            width:"100%", 
                            height: "85px", 
                            borderTop: `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`, 
                            backgroundColor: theme.palette.primary.main
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
                                    <ScapPrimaryTextField type="text" handleKeyDown={handleKeyDown} label="Message" name="message" setSendButoon={setSendButoon} onChangeMessageText={onChangeMessageText} sendButton={sendButton}/>
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
                                                >
                                                    <AttachFileOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                </Box>
                                <Box sx={{flexGrow: 1, ml: 2, width: "45%"}}>
                                    <ScapPrimaryTextField onMessageFieldFocus={onMessageFieldFocus} type="text" handleKeyDown={handleKeyDown} setSendButoon={setSendButoon} label="Message" name="message" onChangeMessageText={onChangeMessageText} sendButton={sendButton} />
                                </Box>
                            </>
                        )}

                        <Box sx={{flexGrow: 0, ml: 2}}>
                            {/* All */}
                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                                sx={{mr: 1}}
                                disabled={sendButton}
                                onClick={()=>{
                                    sendMessage();
                                }}
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
                                        >
                                            <AttachFileOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            }
                        </Box>
                    </FlexBetween>
                </>
                
            )}
            
        </Box>
    )
}
export default ChatMessages;