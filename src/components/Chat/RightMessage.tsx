import { ThreadMessage } from '@/atoms/chatAtoms';
import useRgbConverter from '@/hooks/useRgbConverter';
import { FilePresent } from '@mui/icons-material';
import { Box, CircularProgress, Skeleton, Typography } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import ScapAvatar from '../ScapComponents/Avatar';
import FlexBetween from '../ScapComponents/FlexBetween';
import Image from 'next/image';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';

type RightMessageProps = {
    theme: any;
    colors: any;
    threadMessages?:ThreadMessage | undefined; 
    setOpenImageModal: React.Dispatch<React.SetStateAction<{
        open: boolean;
        imgURL: string;
    }>>;
};

const RightMessage:React.FC<RightMessageProps> = ({theme, colors, threadMessages, setOpenImageModal}) => {
    
    const { hex2rgb } = useRgbConverter();
    const { isMobile, isSmallMobile} = useMediaQueryHook();
    const [imageLoading, setImageLoading] = useState(true);

    return (
        <FlexBetween
            sx={{
                flexDirection: "row",
                alignItems: "flex-start",
                width: "inherit",
                maxWidth: "500px",
                ml: "auto",
                mr: "0px"
            }}
        >  
            {/* "BODY" */}
            <Box sx={{flexGrow: 0, maxWidth: "80%", mr: "0", ml: "auto"}}>
                {/* TEXT */}
                {threadMessages?.text && 
                    <FlexBetween
                        sx={{
                            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                            backgroundColor: theme.palette.secondary.main,
                            overflow: "hidden",
                            borderRadius: "20px 20px 3px 20px",
                            color: colors.grey[200],
                            p: "8px 16px",
                            boxShadow: "rgb(0 0 0 / 8%) 0px 5px 22px, rgb(0 0 0 / 6%) 0px 0px 0px 0.5px",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "fit-content",
                            ml: "auto"
                        }}
                    >
                        <FlexBetween sx={{wordBreak: "break-word"}}>
                            <Typography variant="h6" sx={{color: theme.palette.primary.contrastText}}>{threadMessages?.text}</Typography>
                        </FlexBetween>
                    </FlexBetween>
                }   
                {/* IMAGE */}
                {threadMessages?.photoURL.url && 
                    <FlexBetween sx={{mt: threadMessages?.text ? 1 : 0}}>
                        <Box sx={{width: "inherit", height: "inherit", display: "flex", justifyContent: "center", alignItems:"center", mr: 0, ml: "auto"}}>
                            <CircularProgress 
                                size={20}
                                thickness={4}
                                sx={{
                                    '&.MuiCircularProgress-root': {
                                        animation: "animation-61bdi0 .7s linear infinite"
                                    },
                                    color: theme.palette.text.primary,
                                    position: "relative",
                                    right: "5px",
                                    display: threadMessages?.photoURL.isLoading ? "block" : "none"
                                }} 
                            />
                            {/* <Box
                                onClick={()=>{setOpenImageModal({open: true, imgURL: threadMessages?.photoURL.url})}}
                                sx={{
                                    cursor: "pointer",
                                    maxHeight: { xs: "220px", md: "245px" },
                                    maxWidth: { xs: "220px", md: "245px" },
                                    opacity:  threadMessages?.photoURL.isLoading ? 0.2 : imageLoading ? 0 : 1,
                                    position: "relative"
                                }}
                            >
                                {imageLoading && <Skeleton variant="rounded" animation="wave" width={210} height={120} sx={{position: "absolute", zIndex: 300}}/> }
                                <Image 
                                    id={threadMessages?.id}
                                    onLoad={() => {setImageLoading(false)}} 
                                    src={threadMessages?.photoURL.url} 
                                    alt="Chat Images" 
                                    sizes="100vw" 
                                    width={0}
                                    height={0}
                                    style={{ 
                                        width: '100%', 
                                        height: 'auto', 
                                        borderRadius: threadMessages?.text ? "20px 3px 20px 20px" : "20px 20px 20px 20px",
                                        opacity:  threadMessages?.photoURL.isLoading ? 0.2 : imageLoading ? 0 : 1,
                                        maxHeight: "245px",
                                    }}
                                    loading='lazy'
                                />
                            </Box> */}
                            <Box
                                component="img"
                                alt="Loading..."
                                src={threadMessages?.photoURL.url}
                                srcSet={threadMessages?.photoURL.url} 
                                loading="lazy" 
                                onLoad={() => {setImageLoading(false)}}
                                onClick={()=>{setOpenImageModal({open: true, imgURL: threadMessages?.photoURL.url})}}
                                sx={{
                                    cursor: "pointer",
                                    marginRight: 0,
                                    marginLeft: "auto",
                                    borderRadius: threadMessages?.text ? "20px 3px 20px 20px" : "20px 20px 20px 20px",
                                    maxHeight: { xs: "220px", md: "245px" },
                                    maxWidth: { xs: "220px", md: "245px" },
                                    width: imageLoading ? "0px" : "auto",
                                    opacity:  threadMessages?.photoURL.isLoading ? 0.2 : imageLoading ? 0 : 1
                                }}
                            />
                            {imageLoading && <Skeleton variant="rounded" animation="wave" width={210} height={120} /> }
                        </Box>
                    </FlexBetween>
                }
                {/* FILE */}
                {threadMessages?.file.filename && 
                    <Box 
                        sx={{
                            mt: 1,
                            height: "50px", 
                            maxWidth: "200px", 
                            borderRadius:"5px 5px 5px 5px", 
                            backgroundColor:theme.palette.mode === "dark" ? theme.palette.primary.dark : hex2rgb(colors.grey[900], "60").rgb, 
                            padding: "5px 8px", 
                            display: "flex", 
                            flexDirection: "row", 
                            alignItems: "center"
                        }} 
                    >
                        <ScapAvatar 
                            variant="circular"
                            sx={{
                                backgroundColor: colors.indigoAccent[500],
                                color: "white",
                                width:"35px", 
                                height:"35px", 
                                mr: 1
                            }}
                        >
                            {threadMessages?.file.isLoading ? (
                                <CircularProgress 
                                    size={20}
                                    thickness={4}
                                    sx={{
                                        '&.MuiCircularProgress-root': {
                                            animation: "animation-61bdi0 .7s linear infinite"
                                        },
                                        color: "#fff",
                                        position: "absolute"
                                    }} 
                                />
                            ):(
                                <FilePresent/>
                            )}
                            
                            
                        </ScapAvatar>
                        <Typography 
                            sx={{ 
                                '& > a':{color: theme.palette.text.primary},
                                whiteSpace: "nowrap", 
                                width:"80%", 
                                overflow:"hidden", 
                                textOverflow: "ellipsis"
                            }} 
                        >
                            <a href={threadMessages.file.data} target="_blank" download={threadMessages.file.filename} rel="noreferrer">
                                {threadMessages.file.filename}
                            </a>
                        </Typography>
                    </Box>
                }
                <Box sx={{pr: "16px", pl: "16px", mt: 1, minWidth: "110px"}}>
                    <Typography variant="body2" sx={{width: "fit-content", ml:"auto", color: theme.palette.text.secondary}} >{ threadMessages?.createdAt?.seconds && moment(new Date(threadMessages?.createdAt?.seconds * 1000)).fromNow()}</Typography>
                </Box>
            </Box>
            {/* "AVATAR" */}
            {/* <ListItemAvatar sx={{ml: 1,}}>
                <Avatar 
                    sx={{ width:"35px", height:"35px", backgroundColor: colors.greenAccent[500], color: "white", mr: "0", ml: "20px"}}
                >
                    S
                </Avatar>
            </ListItemAvatar> */}
        </FlexBetween>
    )
}
export default RightMessage;