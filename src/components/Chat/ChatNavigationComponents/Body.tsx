import { chatThreadsState, nextThreadRef, ThreadsValue } from '@/atoms/chatAtoms';
import { chatNavToggleState } from '@/atoms/chatNavToggleAtom';
import { loadingNavigateMessageState } from '@/atoms/loadingNavigateMessage';
import { modalLinksOpen } from '@/atoms/modalLinksAtom';
import { usersAtomState, UsersInfo } from '@/atoms/usersAtom';
import { auth, firestore } from '@/firebase/clientApp';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useNavigation from '@/hooks/useNavigation';
import { Add, FiberManualRecord } from '@mui/icons-material';
import { Avatar, Box, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Toolbar, Typography } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import Image from 'next/image';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import FlexBetween from '../../ScapComponents/FlexBetween';
import ScapPrimaryButton from '../../ScapComponents/PrimaryButton';
import ScapPrimaryTextField from '../../ScapComponents/PrimaryTextField';
import { StyledBadge } from '../../ScapComponents/ScapAvatarBadge';

type NavBodyProps = {
    hex2rgb: (hex: any, opacity: string) => {rgb: string};
    theme: any;
    colors: any;
    tabVal: string;
    setTabThreadExist: React.Dispatch<React.SetStateAction<string>>;
    setTabUnreadMessage: React.Dispatch<React.SetStateAction<{
        staff: boolean;
        customerSupport: boolean;
    }>>;
};

const NavBody:React.FC<NavBodyProps> = ({hex2rgb, theme, colors, tabVal, setTabThreadExist, setTabUnreadMessage}) => {
    
    const [user] = useAuthState(auth);
    const { navigatePage } = useNavigation();
    const { isMobile } = useMediaQueryHook();
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const [chatNavToggleValue, setChatNavToggleValue] = useRecoilState(chatNavToggleState);
    const setLoadingSelectThread = useSetRecoilState(loadingNavigateMessageState);
    const setOpen = useSetRecoilState(modalLinksOpen);
    const usersAtomValue = useRecoilValue(usersAtomState);
    const [search, setSearch] = useState("");
    const [isImgLoading, setIsImgLoading] = useState(true);
    const dataFetchedRef = useRef(false);
    const linksOpen = () => setOpen(true);
    let threadNamesArray: string = "";
    const getStaffThreadLength = useRef(0);
    const getCustomerThreadLength = useRef(0);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const getSelectedThreadMessages = async (threadId: string | undefined) => {
        try{
            //IF selected thread does not exist in recoil then get thread from firestore
            if(!chatThreadsValue.threadMessages.some(item => threadId === item.threadId)){
                const q = query(collection(firestore, `threads/${threadId}/messages`), orderBy("createdAt", "desc"), limit(25));
                const querySnapshot = await getDocs(q);
                const messages = querySnapshot.docs.reverse().map((doc) => ({
                    id: doc.id,
                    threadId: doc.data().threadId,
                    uid: doc.data().uid,
                    text: doc.data().text,
                    photoURL: doc.data().photoURL,
                    file: doc.data().file,
                    createdAt: doc.data().createdAt,
                })); 
                messages.forEach(item => 
                    setChatThreadsValue((prev) => ({
                        ...prev,
                        threadMessages: [...prev.threadMessages, item],
                    }))
                )
                if(messages.length < 25){
                    const nexThread: nextThreadRef = {
                        threadId: threadId!, 
                        document: "max"
                    }
                    setChatThreadsValue((prev) => ({
                        ...prev,
                        nextThread: [...prev.nextThread, nexThread]
                    }))
                } else {
                    const nexThread: nextThreadRef = {
                        threadId: threadId!, 
                        document: "more"
                    }
                    setChatThreadsValue((prev) => ({
                        ...prev,
                        nextThread: [...prev.nextThread, nexThread]
                    }))
                }

                setChatThreadsValue((prev) => ({
                    ...prev,
                    selectedThreadsArray: [...prev.selectedThreadsArray, threadId] as string[]
                }))
            }
        } catch(error){
            console.log("Error getSelectedThreadMessages: ", error);
        }
    }
    // TAB Unread Indicator Control
    useEffect(()=>{
        let staff = false;
        let customer = false
        const threadUnread = chatThreadsValue.threads.filter(thread => {
            let threadSeen: string [] = [];
                thread.threadSeen.map(item =>  threadSeen.push(item))
                return !threadSeen.includes(user!.uid!)
        });
        if(threadUnread.length > 0){
            threadUnread.map(field => {
                if(field.type === "private" || field.type === "group"){
                    staff = true;
                } 
                if(field.type === "customer"){
                    customer = true;
                }
            })
        }
        setTabUnreadMessage({
            staff: staff,
            customerSupport: customer
        })
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatThreadsValue.threads, chatThreadsValue.currentThreadId, user])

    //PRE-FETCH the current selected Thread if page is refreshed
    useEffect(()=>{
        if(chatThreadsValue.currentThreadId && !dataFetchedRef.current){
            getSelectedThreadMessages(chatThreadsValue.currentThreadId);
            const currThread = chatThreadsValue.threads.filter(item => item.id === chatThreadsValue.currentThreadId);
            if(currThread[0].type){
                if(currThread[0].type === "customer"){
                    setTabThreadExist("customer");
                } else {
                    setTabThreadExist("staff");
                }
                dataFetchedRef.current = true;
            }
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    },[chatThreadsValue.currentThreadId])

    //GET thread users name
    useEffect(() => {
        let arr: string[] = [];
        //ISOLATE the connections array from parent object
        const isolatedThreadConnections = chatThreadsValue.threads.map(item0 => item0.connections);
        //REMOVE current user's ID in connections array
        const slicedMyId = isolatedThreadConnections.map(item1 => item1.filter(item2 => item2 != user?.uid));
        //CONVERT 2 Dimensional Array into 1 Dimensional Array
        slicedMyId.forEach((doc) => doc.forEach(doc1 => { arr.push(doc1) }));
        //ELIMINATE Duplicates
        const completedUIDs = arr.filter((item, index) => arr.indexOf(item) === index);
        //GET all user names
        const getUserInfo = usersAtomValue.users.filter(item1 => completedUIDs.includes(item1.uid));
        //SET to Recoil State
        setChatThreadsValue(prev => ({
            ...prev,
            myThreadsUserInfo: getUserInfo as UsersInfo[]
        }));
        getCustomerThreadLength.current = chatThreadsValue.threads.filter(item => item.type === 'customer').length;
        getStaffThreadLength.current = chatThreadsValue.threads.filter(item => item.type !== 'customer').length;
    //eslint-disable-next-line react-hooks/exhaustive-deps
    },[chatThreadsValue.threads])
    
    return (
        <>
            {/* HEADER */}
            <Toolbar  sx={{pl: "2px !important", pr: "17px !important", padding: "20px 10px 0px 10px", justifyContent: "space-between" }} >
                {/* LEFT */}
                <FlexBetween>
                    {/* TEMPORARY BUTTON */}
                    <Typography variant="h4" sx={{fontWeight: 700}}>{tabVal === "staff" ? "Staff Chats" : "Assigned Customers"}</Typography>
                </FlexBetween>
                {/* RIGHT */}
                {tabVal === "staff" && 
                    <FlexBetween>
                        <ScapPrimaryButton onClick={linksOpen} sx={{padding: "4px 6px 4px 6px"}} type="submit" theme={theme} fullWidth color="primary" variant="contained">
                            <Add sx={{fontSize:"24px"}}/>
                        </ScapPrimaryButton>
                    </FlexBetween>
                }
            </Toolbar>
            {chatThreadsValue.threads.length > 0 ? (
                
                <>
                    {/* SEARCH */}
                    <Box sx={{margin: "20px 7px 20px 0px"}}>
                        <ScapPrimaryTextField type="text" resetValue={search} label="Search" name="search" onChange={onChange} />
                    </Box>
                    {/* BODY */}
                    <Box sx={{mr: "5px", flexGrow: 1}}>
                        {chatThreadsValue.threads.map((thread, index) => {
                            
                            let isNotCurrentThread = chatThreadsValue.currentThreadId !== thread.id;
                            let threadSeenArray: string[] = [];
                            const threadSeen = thread.threadSeen;
                            if(threadSeen){
                                threadSeen.map(item => threadSeenArray.push(item));
                            }

                            //GET uid name
                            let arr: string[] = [];
                            let names = "";
                            let arrWithMyName: string[] = [];
                            const connections = thread.connections;
                            //ELIMINATE MyName
                            const eliminateMyName = connections.filter((item) => item !== user?.uid);
                            connections.forEach((doc) =>  { arrWithMyName.push(doc)});
                            //CONVERT 2 Dimensional Array into 1 Dimensional Array
                            eliminateMyName.forEach((doc) =>  { arr.push(doc)}); 
                            //ELIMINATE Duplicates
                            const completedUIDs = arr.filter((item, index) => arr.indexOf(item) === index).filter(item2 => item2 !== "");
                            const completedUIDsWithCurrentUser = arrWithMyName.filter((item, index) => arrWithMyName.indexOf(item) === index).filter(item2 => item2 !== "");
                            //GET all user names for display
                            const getUserInfo = usersAtomValue.users.filter(item1 => completedUIDs.includes(item1.uid));

                            const getObjectLastUserMessage = getUserInfo.filter(item => item.uid === thread.lastMessageUID);
                            const firstNameLastMessage = getObjectLastUserMessage.length > 0 ? getObjectLastUserMessage[0].firstName : "";
                            const userBlocker = thread.lastMessageUID.split("=");
                            const chatUserName = usersAtomValue.users.filter(item1 => completedUIDsWithCurrentUser.includes(item1.uid));
                            const kaChatInfo = chatUserName.filter(userInfo => userInfo.uid !== user?.uid);

                            const tabThreads = (tabValue: string) => {
                                if(tabValue === "staff"){
                                    return thread.type !== "customer"
                                }
                                if(tabValue === "customer"){
                                    return thread.type === "customer"
                                }
                                if(tabValue === "archived"){
                                    return thread.status === "archived"
                                }
                            }

                            let name="";
                            if(thread.type === "group" && !threadNamesArray.includes(thread.groupName.toLowerCase())){
                                name +=  thread.groupName ? `${thread.groupName.toLowerCase().trim()} ` : `${name.toLowerCase().trim()}, `;
                            }
                            const myName = usersAtomValue.users.filter(item1 => user?.uid === item1.uid);
                            if(getUserInfo.length === 0){
                                name= myName[0].firstName + " " + myName[0].lastName;
                            }

                            {getUserInfo.map((item, index) => {
                                if(getUserInfo.length-1 != index ){
                                    if(item.firstName === "" && item.lastName === ""){
                                        name += "New User, "
                                    } else {
                                        name += `${item.firstName} ${item.lastName}, `
                                    }
                                } else {
                                    if(item.firstName === "" && item.lastName === ""){
                                        name += "New User"
                                    } else {
                                        name += `${item.firstName} ${item.lastName}`
                                    }
                                }
                                threadNamesArray += `${name.toLowerCase().trim()} `;
                                // return name
                            })}
                            
                            //SEARCH FILTER
                            getUserInfo.forEach(item => names += `${item.firstName} ${item.lastName} `);
                                if(names.toLowerCase().includes(search.toLowerCase()) && tabThreads(tabVal) || thread.groupName.toLowerCase().includes(search.toLowerCase()) && tabThreads(tabVal)){
                                
                                return (
                                    <ListItem key={index} disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                {!isMobile && setChatNavToggleValue(!chatNavToggleValue);}
                                                {isNotCurrentThread && 
                                                    getSelectedThreadMessages(thread.id)
                                                }
                                                {isNotCurrentThread && 
                                                    setChatThreadsValue(prev => ({
                                                        ...prev,
                                                        currentThreadId: thread.id
                                                    }) as ThreadsValue);
                                                }
                                                {isNotCurrentThread && setLoadingSelectThread(true)}
                                                {isNotCurrentThread && setTabThreadExist(tabVal)}
                                                {isNotCurrentThread && navigatePage(`/scenes/chat/u=${user?.uid}=threadKey=${thread.id}`);}
                                            }}
                                            sx={{
                                                display: "flex",
                                                marginTop: "4px",
                                                padding: "12px 15px",
                                                borderRadius: 4,
                                                backgroundColor: chatThreadsValue.currentThreadId === thread.id ? theme.palette.mode === "dark" ? hex2rgb(theme.palette.secondary.light, "50").rgb : hex2rgb(theme.palette.primary.light, "50").rgb : "transparent",
                                                color:theme.palette.primary.contrastText,
                                                '&:hover': {
                                                    backgroundColor: hex2rgb(theme.palette.primary.light, "30").rgb
                                                }
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
                                                    {thread.groupPhotoURL ? (
                                                        <FlexBetween sx={{flexDirection: "row"}} >
                                                            <Skeleton variant="circular" animation="wave" width={35} height={35} sx={{display: isImgLoading ? "block" : "none", position: "absolute", zIndex: 300}} />
                                                            <Avatar sx={{width:"35px", height:"35px", display: "block", backgroundColor: "transparent"}} >
                                                                <Image onLoad={()=>{setIsImgLoading(false)}} src={thread.groupPhotoURL} alt="User Profile" fill loading='lazy' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover" }}/>
                                                            </Avatar>
                                                        </FlexBetween>
                                                    ):(
                                                        <Avatar 
                                                            sx={{ 
                                                                width:"35px", 
                                                                height:"35px", 
                                                                backgroundColor: thread.type == "private" ? colors.greenAccent[500] : thread.type == "customer" ? deepOrange[400] : colors.blueAccent[500], 
                                                                color: "white"
                                                            }}
                                                        >
                                                            {thread.type === "group" ? thread.groupName ? thread.groupName.charAt(0) : "G" : getUserInfo[0].firstName.charAt(0)}
                                                        </Avatar>
                                                    )}
                                                </StyledBadge>
                                            </ListItemAvatar>

                                            <ListItemText 
                                                disableTypography
                                                primary={
                                                    <Typography variant='body1' style={{color: theme.palette.text.primary ,whiteSpace: "nowrap", width: "80%", overflow: "hidden", textOverflow: "ellipsis", fontWeight: !threadSeenArray.includes(user!.uid) ? 800 : 400}}>
                                                        {thread.type === "group" ? thread.groupName ? thread.groupName : name : name} 
                                                    </Typography>
                                                } 
                                                secondary={
                                                    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                        
                                                        <Typography variant='body2' style={{color: theme.palette.text.secondary ,whiteSpace: "nowrap", width: "90%", overflow: "hidden", textOverflow: "ellipsis", fontWeight: !threadSeenArray.includes(user!.uid) ? 800 : 400}}>
                                                            {thread.lastMessageUID === user?.uid 
                                                                ? `You: ${thread.lastMessage}` 
                                                                : thread.type === "group" 
                                                                    ? firstNameLastMessage != "" 
                                                                        ? `${firstNameLastMessage}: ${thread.lastMessage}`
                                                                        : thread.lastMessage
                                                                    : (thread.lastMessage === "blocked" || thread.lastMessage === "unblocked") 
                                                                        ? userBlocker[1] === user?.uid ? `You ${thread.lastMessage} ${kaChatInfo[0].firstName}.` : `${kaChatInfo[0].firstName} ${thread.lastMessage} you.`
                                                                        : thread.lastMessage
                                                                    } 
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <Box>
                                                {!threadSeenArray.includes(user!.uid) && <FiberManualRecord sx={{width: "10px", height: "10px", mr:"4px", color: theme.palette.secondary.main}} /> }
                                            </Box>
                                        </ListItemButton>
                                    </ListItem>
                                )
                            }
                            if(chatThreadsValue.threads.length -1 === index && search != "" && !threadNamesArray.includes(search.toLowerCase())) {
                                return (<Typography key={index} variant="body1" sx={{color: theme.palette.text.secondary}}>No user/group found.</Typography>)
                            }
                        })}
                        <FlexBetween sx={{width: "100%", height: "100%", aligntItems: "center", mt: 5}}>
                            <Typography variant='h4' sx={{fontWeight: 600, width: "100%", textAlign: "center", color: hex2rgb(theme.palette.text.secondary, "35").rgb}}>
                                <>
                                    {tabVal === "staff" && 
                                        <>
                                            {getStaffThreadLength.current == 0 && <>{`Start a new conversation [+]`}</> }
                                        </>
                                    }
                                    {tabVal === "customer" && 
                                        <>
                                            {getCustomerThreadLength.current == 0 && <>{`No assigned customer.`}</> }
                                        </>
                                    }
                                </>
                            </Typography>
                        </FlexBetween>
                    </Box>
                </>
            ):(
                <>
                    <FlexBetween sx={{width: "100%", height: "100%", aligntItems: "center", mt: 5}}>
                        <Typography variant='h4' sx={{fontWeight: 600, width: "100%", textAlign: "center", color: hex2rgb(theme.palette.text.secondary, "35").rgb}}>
                            {tabVal === "staff" ? (`Start a new conversation [+]`):(`No assigned customer.`)}
                        </Typography>
                    </FlexBetween>
                </>
                
            )}
        </>
    )
}
export default memo(NavBody);