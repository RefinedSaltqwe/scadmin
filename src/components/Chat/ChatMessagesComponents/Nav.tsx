import { addPeopleModalOpenState } from '@/atoms/addPeopleModalOpen';
import { chatThreadsState, ThreadRef } from '@/atoms/chatAtoms';
import { chatNavToggleState } from '@/atoms/chatNavToggleAtom';
import { openThreadInfoState } from '@/atoms/openThreadInfo';
import ScapAvatar from '@/components/ScapComponents/Avatar';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import { StyledBadge } from '@/components/ScapComponents/ScapAvatarBadge';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { ArrowBackIosNewOutlined, ArrowForwardIosOutlined, Info, InfoOutlined, PersonAddAlt1Outlined } from '@mui/icons-material';
import { Box, IconButton, List, ListItem, ListItemAvatar, ListItemText, Skeleton, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Image from 'next/image';

type MessageNavProps = {
    hex2rgb: (hex: any, opacity: string) => {
        rgb: string};
    dataType: string | undefined;
    currentThreadUsernames: string;
    colors: any;
    currentThread: string;
};

const MessageNav:React.FC<MessageNavProps> = ({currentThread, hex2rgb, dataType, currentThreadUsernames, colors}) => {
    
    const theme = useTheme();
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState);
    const [openThreadInfoValue, setOpenThreadInfoValue] = useRecoilState(openThreadInfoState);
    const [chatNavToggleValue, setChatNavToggleValue] = useRecoilState(chatNavToggleState);
    const setOpen = useSetRecoilState(addPeopleModalOpenState);
    const { isMobile, isTablet, isLaptop, isDesktop } = useMediaQueryHook();
    const specialQueryBreakpoint = useMediaQuery("(min-width:600px) and (max-width: 1340px)");
    const [openNavEnable, setOpenNavEnable] = useState(true);
    const [threadGroupName, setThreadGroupName] = useState("");
    const [threadGroupPhoto, setThreadGroupPhoto] = useState("");
    const [isImgLoading, setIsImgLoading] = useState(true);
    const addPeopleOpen = () => setOpen(true);
    const setSelectedThreads = useRef(()=>{});

    //FETCH
    setSelectedThreads.current = () => {
        const currentThreadObject = chatThreadsValue.threads.filter(item => item.id === currentThread);
        // console.log(currentThreadObject)
        setChatThreadsValue((prev) => ({
            ...prev,
            currentSelectedThread: currentThreadObject[0] as ThreadRef,
        }));
        // ? Update CurrentSelectedThread
        // setChatThreadsValue((prev) => ({
        //     ...prev,
        //     currentSelectedThread: prev.currentSelectedThread, ...threadUpdater, status: statusText
        // }))
    }

    //LISTENER
    useEffect(() => {
        setSelectedThreads.current();
    }, [chatThreadsValue.threads]) 

    // SET
    useEffect(()=>{
        const currentSelectedThread = chatThreadsValue.currentSelectedThread;
        if(currentSelectedThread !== undefined){
            setThreadGroupName(currentSelectedThread?.groupName);
            setThreadGroupPhoto(currentSelectedThread?.groupPhotoURL)
        } else {
            setThreadGroupName("");
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatThreadsValue.currentSelectedThread]) 
    return (
        <FlexBetween 
            sx={{
                    height: "75px", 
                    width: "100%", 
                    borderBottom: `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`,
                    backgroundColor: theme.palette.primary.main,
                    zIndex: 250,
                }}
            >
            <Box sx={{flexGrow: 0, width: "auto"}}>
                <Tooltip title="Toggle Chat Menu">
                    <IconButton 
                        size="large" 
                        aria-label="show 4 new mails" 
                        color="inherit" 
                        sx={{ml: 1}}
                        onClick={() => {
                            {specialQueryBreakpoint && (openNavEnable && (openThreadInfoValue && setOpenThreadInfoValue(bool => !bool)))}
                            {specialQueryBreakpoint && (!openThreadInfoValue && setOpenNavEnable(navTggle => !navTggle))}
                            {specialQueryBreakpoint && (!chatNavToggleValue && (!openNavEnable && (openThreadInfoValue && setOpenThreadInfoValue(bool => !bool))))}
                            {specialQueryBreakpoint && (!chatNavToggleValue && (!openNavEnable && (openThreadInfoValue && setOpenNavEnable(navTggle => !navTggle))))}
                            setChatNavToggleValue(navTggle => !navTggle)
                        }}
                    >
                        {chatNavToggleValue ? (
                            <ArrowBackIosNewOutlined sx={{fontSize: 18, color: theme.palette.text.secondary}}/>
                        ):(isMobile 
                            ? (<ArrowForwardIosOutlined sx={{fontSize: 18, color: theme.palette.text.secondary}}/>)
                            : (<ArrowBackIosNewOutlined sx={{fontSize: 18, color: theme.palette.text.secondary}}/>)
                        )}
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{flexGrow: 1, width: isTablet ? "auto" : "70px"}}>
                <List sx={{pb: 0, pt: 0}}>
                    <ListItem 
                        sx={{
                            pt: isTablet ? "8px" : "0px",
                            pb: isTablet ? "8px" : "0px",
                            maxWidth: isTablet ? isDesktop? "400px" : isLaptop ? "300px" :  "275px" : "275px"
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
                                    {threadGroupPhoto ? (
                                        <FlexBetween sx={{flexDirection: "row"}} >
                                            <Skeleton variant="circular" animation="wave" width={40} height={40} sx={{display: isImgLoading ? "block" : "none", position: "absolute", zIndex: 300}} />
                                            {/* <ScapAvatar sx={{display: isImgLoading ? "none" : "block"}} onLoad={()=>{setIsImgLoading(false)}} src={threadGroupPhoto}/> */}
                                            <ScapAvatar sx={{width: 40, height: 40, display: "block", backgroundColor: "transparent"}} >
                                                <Image onLoad={()=>{setIsImgLoading(false)}} src={threadGroupPhoto} alt="User Profile" fill loading='lazy' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover" }}/>
                                            </ScapAvatar>
                                        </FlexBetween>
                                    ):(
                                        <ScapAvatar
                                            sx={{
                                                backgroundColor: dataType === "group" ? colors.blueAccent[500] : dataType === "customer" ? deepOrange[400] : colors.greenAccent[500],
                                                color: "white"
                                            }}
                                        >
                                            {dataType === "group" ? threadGroupName ? threadGroupName.charAt(0) : "G" : currentThreadUsernames.charAt(0)}
                                        </ScapAvatar>
                                    )}
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
                                    {/* HERE-----if group name exist then use group name---------------------------------------------------------- */}
                                    {dataType === "group" ? threadGroupName ? threadGroupName : currentThreadUsernames : currentThreadUsernames} 
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
                {dataType === "group" && (
                    <Tooltip title="Add People">
                        <IconButton
                            size="large"
                            aria-label="Add People"
                            color="inherit"
                            sx={{mr: 1}}
                            onClick={addPeopleOpen}
                        >
                            <PersonAddAlt1Outlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="Chat Info">
                    <IconButton
                        size="large"
                        color="inherit"
                        aria-label="more"
                        id="long-button"
                        aria-haspopup="true"
                        onClick={()=>{
                            {specialQueryBreakpoint && (openNavEnable && setChatNavToggleValue(navTggle => !navTggle))}
                            setOpenThreadInfoValue(bool => !bool);
                        }}
                        sx={{mr: 1}}
                    >
                        {openThreadInfoValue 
                            ? (<Info sx={{fontSize: 20, color: theme.palette.text.secondary}}/>) 
                            : (<InfoOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>)
                        }
                    </IconButton>
                </Tooltip>
            </Box>
        </FlexBetween>
    )
}
export default memo(MessageNav);