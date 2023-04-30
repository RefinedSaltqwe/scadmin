import { chatThreadsState, ThreadMessage } from '@/atoms/chatAtoms';
import { modalChangeGroupNameState } from '@/atoms/modalChangeGroupName';
import { modalChangeGroupPhotoState } from '@/atoms/modalChangeGroupPhoto';
import { openThreadInfoState } from '@/atoms/openThreadInfo';
import { usersAtomState, UsersInfo } from '@/atoms/usersAtom';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import { StyledBadge } from '@/components/ScapComponents/ScapAvatarBadge';
import { auth, firestore } from '@/firebase/clientApp';
import useChatThread from '@/hooks/useChatThread';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { tokens } from '@/mui/theme';
import { ArchiveOutlined, ArrowBackIosNewOutlined, BlockOutlined, EditOutlined, ExitToAppOutlined, ExpandLess, ExpandMore, HighlightOffOutlined, InsertPhotoOutlined, MarkChatReadOutlined, NotificationsOffOutlined, PeopleOutlined, PersonRemoveAlt1Outlined } from '@mui/icons-material';
import { Avatar, Box, Collapse, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography, useTheme } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { doc, runTransaction, serverTimestamp, Timestamp } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import React, { memo, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const ChangeGroupName = dynamic(() => import("@/components/Modal/Chat/ChangeGroupName"), {
    ssr: false
});

const ChangeGroupPhoto = dynamic(() => import("@/components/Modal/Chat/ChangeGroupPhoto"), {
    ssr: false
});

const ConfirmModal = dynamic(() => import("@/components/Modal/Confirm/Confirm"), {
    ssr: false
});

type ChatInfoProps = {
    hex2rgb: (hex: any, opacity: string) => {rgb: string};
    threadType: string;
    getUserThreadInfo: UsersInfo[];
    threadCreator: string;
    currentThread: string;
};

const ChatInfo:React.FC<ChatInfoProps> = ({ hex2rgb, threadType, getUserThreadInfo, threadCreator, currentThread}) => {

    const [user] = useAuthState(auth);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { storeMessage } = useChatThread();
    const usersAtomValue = useRecoilValue(usersAtomState);
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const [openThreadInfoValue, setOpenThreadInfoValue] = useRecoilState(openThreadInfoState);
    const setModalChangeGroupNameOpen = useSetRecoilState(modalChangeGroupNameState);
    const setModalChangeGroupPhotoOpen = useSetRecoilState(modalChangeGroupPhotoState);
    const { isMobile } = useMediaQueryHook();
    const [openMembers, setOpenMembers] = React.useState(false);
    const [UID, setUID] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [openConfirm, setOpenConfirm] = useState({
        open: false,
        text: ""
    });
    const [isBlocked, setIsBlocked] = useState({
        status: false,
        isUser: false
    });
    const myName = usersAtomValue.myInfo.firstName + " " + usersAtomValue.myInfo.lastName;

    const toggleMembers = () => {
        setOpenMembers(!openMembers);
    };

    const changeChatStatus = (status: string) => {
        let text: string = "";
        if(status === "blocked"){
            text = `blocked`;
        } else if(status === "active"){
            text = `unblocked`;
        }
        storeMessage("statusUpdate",currentThread, text,"",status);
    }

    const handleRemoveUser = async(uid: string) => {
        setConfirm(false);
        setUID("");

        const messageId: string = user?.uid + "=" + chatThreadsValue.threadMessages.length + "=removeUser=" + uid;
        const getFirstPerson = usersAtomValue.users.filter(user => user.uid === uid)
        let text: string = "";

        if(usersAtomValue.myInfo.uid === getFirstPerson[0].uid){
            text = `${myName} left the group.`;
        } else {
            text = `${myName} removed ${getFirstPerson[0].firstName + " " + getFirstPerson[0].lastName} from the group.`;
        }
        
        try {
            const threadRef = doc(firestore, "threads", chatThreadsValue.currentThreadId);
            
            await runTransaction(firestore, async (transaction) => {
                //READ
                const threadDoc = await transaction.get(threadRef);
                if(!threadDoc.exists()){
                    throw new Error(`Sorry, thread doesn't exist.`);
                }

                const message: ThreadMessage = {
                    threadId: threadDoc.id,
                    uid: "chatSystem=" + user?.uid,
                    text: text,
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

                setChatThreadsValue((prev) => ({
                    ...prev,
                    threadMessages: [...prev.threadMessages, {
                        ...message,
                        id: messageId
                    }],
                }));
                //WRITE
                //CREATE system message
                transaction.set(doc(firestore, `threads/${threadDoc.id}/messages`, messageId), message);

                let threadSeen: string[] = [];
                threadSeen.push(user!.uid);

                const threadUpdater = {
                    changeType:"modified",
                    threadSeen: threadSeen as [],
                    lastMessage: text,
                    lastMessageId: messageId,
                    lastMessageUID: "chatSystem=" + user?.uid,
                    latestMessageCreatedAt: serverTimestamp(),
                }
                // UPDATE latest updates
                transaction.update(doc(firestore, `threads`, threadDoc.id), threadUpdater);
            });
        } catch (error){
            console.log("Remove User Error: ", error)
        }
    }

    useEffect(()=>{
        if(chatThreadsValue.currentSelectedThread?.status === "blocked"){
            const userBlocker = chatThreadsValue.currentSelectedThread?.lastMessageUID.split("=");
            setIsBlocked({status: true, isUser: userBlocker[1] === user?.uid})
        } else if(chatThreadsValue.currentSelectedThread?.status === "active"){
            setIsBlocked({status: false, isUser: false})
        }
    }, [chatThreadsValue.currentSelectedThread, user])

    useEffect(()=>{
        if(confirm){
            handleRemoveUser(UID);
            setOpenConfirm({open: false, text:""});
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirm])
    
    return (
        <>
            <Box 
                sx={{
                    width: isMobile ? openThreadInfoValue ? "30%" : "0" : openThreadInfoValue ? "100%" : "0%", 
                    transform: openThreadInfoValue ? "translateX(0px)" : "translateX(50px)",
                    transition: "width 500ms cubic-bezier(0, 0, 0.16, 1.01), transform 150ms cubic-bezier(0, 0, 0.16, 1.01)", 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column", 
                    position: isMobile ? "relative" : "fixed",
                    zIndex: 500,
                    right: 0
                }}
            >
                <ConfirmModal setOpen={setOpenConfirm}  open={openConfirm} setConfirm={setConfirm}/>
                {/* HEADER */}
                <FlexBetween 
                        sx={{
                            height: "auto", 
                            width:"100%", 
                            borderBottom: `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`,
                            backgroundColor: theme.palette.primary.main,
                            paddingY: isMobile ? "22.2px" : "20.5px",
                            zIndex: 250,
                            justifyContent: "center"
                        }}
                >
                    {!isMobile && 
                        <Tooltip title="Thread Info">
                            <IconButton
                                size="large"
                                color="inherit"
                                aria-label="more"
                                id="long-button"
                                aria-haspopup="true"
                                onClick={()=>{
                                    setOpenThreadInfoValue(false);
                                }}
                                sx={{mr: 1, position: "absolute", left: 0}}
                            >
                                <ArrowBackIosNewOutlined sx={{fontSize: 18, color: theme.palette.text.secondary}}/>
                            </IconButton>
                        </Tooltip>
                    }
                    <Typography variant="h5" sx={{color: theme.palette.text.secondary, fontWeight: 500}}>Chat Info</Typography>
                </FlexBetween>
                {/* BODY */}
                <FlexBetween 
                    sx={{
                        height: "inherit", 
                        width:"100%", 
                        backgroundColor: theme.palette.primary.main,
                        zIndex: 250,
                        alignItems: "flex-start",
                        p: "10px",
                        overflowY: "auto",
                        paddingRight: "auto",
                        overflowX: "hidden",
                    }}
                >
                    <ChangeGroupName />
                    <ChangeGroupPhoto />
                    {threadType === "private" && 
                        <List sx={{width: "100%", pr: "5px"}}>
                            <ListItem disablePadding>
                                <ListItemButton sx={{borderRadius: "8px 8px"}} onClick={()=>{changeChatStatus("muted")}}>
                                    <ListItemIcon>
                                        <NotificationsOffOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary="Mute" />
                                </ListItemButton>
                            </ListItem>
                            {(isBlocked.isUser || !isBlocked.status) &&
                                <ListItem disablePadding>
                                    <ListItemButton sx={{borderRadius: "8px 8px", color:isBlocked.status ? green[400] : red[400]}} onClick={()=>{changeChatStatus(isBlocked.status ? "active" : "blocked")}}>
                                        <ListItemIcon sx={{color: isBlocked.status ? green[400] : red[400]}}>
                                            {isBlocked.status ? (
                                                <MarkChatReadOutlined />
                                            ):(
                                                <BlockOutlined />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={isBlocked.status ? "Unblock" : "Block"} />
                                    </ListItemButton>
                                </ListItem>
                            }
                        </List>
                    }
                    {threadType === "group" && 
                        <List sx={{width: "100%", pr: "5px"}}>
                            <ListItem disablePadding>
                                <ListItemButton sx={{borderRadius: "8px 8px"}} onClick={()=> {setModalChangeGroupNameOpen(true);}}>
                                    <ListItemIcon>
                                        <EditOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary="Change chat name" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton sx={{borderRadius: "8px 8px"}} onClick={()=> {setModalChangeGroupPhotoOpen(true);}}>
                                    <ListItemIcon>
                                        <InsertPhotoOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary="Change photo" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton sx={{borderRadius: "8px 8px"}} onClick={toggleMembers}>
                                    <ListItemIcon>
                                        <PeopleOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary="Chat members" />
                                    {openMembers ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                            </ListItem>

                            <Collapse in={openMembers} timeout="auto" unmountOnExit>
                                <List 
                                    component="div" 
                                    disablePadding
                                    sx={{padding: "5px 10px"}}
                                >
                                    {getUserThreadInfo.map((item, index) => {
                                        return(
                                            <ListItem 
                                                key={index}
                                                disablePadding 
                                                secondaryAction={
                                                    threadCreator === user?.uid && (item.uid !== threadCreator &&
                                                        <IconButton edge="end" aria-label="comments" onClick={()=> {setOpenConfirm({open: true, text: `Are you sure you want to remove ${item.firstName + " " + item.lastName} from the group chat?`}); setUID(item.uid)}}>
                                                            <PersonRemoveAlt1Outlined />
                                                        </IconButton>)
                                                }
                                                sx={{
                                                    marginY: "10px"
                                                }}
                                            >
                                                <ListItemAvatar sx={{mr: 1}}>
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
                                                        <Avatar 
                                                            sx={{ 
                                                                width:"35px", 
                                                                height:"35px", 
                                                                backgroundColor:colors.greenAccent[500], 
                                                                color: "white"
                                                            }}
                                                        >
                                                            {item.firstName.charAt(0)}
                                                        </Avatar>
                                                    </StyledBadge>
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    disableTypography
                                                    primary={
                                                        <Typography variant='body1' style={{color: theme.palette.text.primary ,whiteSpace: "nowrap", width: "80%", overflow: "hidden", textOverflow: "ellipsis",}}>
                                                            {item.firstName + " " + item.lastName}
                                                        </Typography>
                                                    } 
                                                    secondary={
                                                        <Typography variant='body2' style={{color: theme.palette.text.secondary ,whiteSpace: "nowrap", width: "90%", overflow: "hidden", textOverflow: "ellipsis",}}>
                                                            {item.uid === threadCreator ? "Created this group chat" : "Member"}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Collapse>

                            <ListItem disablePadding>
                                <ListItemButton sx={{borderRadius: "8px 8px", color: red[400]}} onClick={()=> {setOpenConfirm({open: true, text: "Are you sure you want to leave the group?" }); setUID(user?.uid ? user?.uid : "")}}>
                                    <ListItemIcon sx={{color: red[400]}}>
                                        <ExitToAppOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary="Leave group" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    }
                    {threadType === "customer" && 
                        <List sx={{width: "100%", pr: "5px"}}>

                            <ListItem disablePadding>
                                <ListItemButton sx={{borderRadius: "8px 8px"}} >
                                    <ListItemIcon>
                                        <NotificationsOffOutlined />
                                    </ListItemIcon>
                                <ListItemText primary="Mute" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton sx={{borderRadius: "8px 8px"}} >
                                    <ListItemIcon>
                                        <ArchiveOutlined />
                                    </ListItemIcon>
                                <ListItemText primary="Archive" />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton sx={{borderRadius: "8px 8px", color: red[400]}} >
                                    <ListItemIcon sx={{color: red[400]}}>
                                        <HighlightOffOutlined />
                                    </ListItemIcon>
                                <ListItemText primary="Close conversation" />
                                </ListItemButton>
                            </ListItem>
                            
                        </List>
                    }
                </FlexBetween>
            </Box>
        </>
    )
}
export default memo(ChatInfo);