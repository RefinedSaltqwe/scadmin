import { ThreadMessage } from '@/atoms/chatAtoms';
import useRgbConverter from '@/hooks/useRgbConverter';
import { FilePresent } from '@mui/icons-material';
import { Avatar, Box, ListItemAvatar, Skeleton, Typography } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import moment from 'moment';
import React, { useState } from 'react';
import ScapAvatar from '../ScapComponents/Avatar';
import FlexBetween from '../ScapComponents/FlexBetween';
import Image from 'next/image';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';

type LeftMessageProps = {
    theme: any;
    colors: any;
    threadMessages:ThreadMessage | undefined; 
    threadType: string;
    fullName: string;
    setOpenImageModal: React.Dispatch<React.SetStateAction<{
        open: boolean;
        imgURL: string;
    }>>;
};

const LeftMessage:React.FC<LeftMessageProps> = ({theme, colors, threadMessages, threadType, fullName, setOpenImageModal}) => {
    
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
                ml: "0px",
                mr: "auto"
            }}
        >
            {/* "AVATAR" */}
            <ListItemAvatar sx={{mr: 0,}}>
                <Avatar 
                    sx={{ 
                        width:"37px", 
                        height:"37px", 
                        backgroundColor: threadType === 'group' ? colors.blueAccent[500] : threadType === "customer" ? deepOrange[400] : colors.greenAccent[500], 
                        color: "white"
                    }}
                >
                    {fullName && fullName.charAt(0)}
                </Avatar>
            </ListItemAvatar>
            {/* "BODY" */}
            <Box sx={{flexGrow: 1, maxWidth: "80%", mr: 0, ml: 0}}>
                {threadType === 'group' && 
                    <Box sx={{mb: "4px"}}>
                        <Typography variant="body2" sx={{color: colors.grey[300]}}>{fullName}</Typography>
                    </Box>
                }
                {/* TEXT */}
                {threadMessages?.text && 
                    <FlexBetween
                        sx={{
                            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                            backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.dark : colors.grey[900],
                            overflow: "hidden",
                            borderRadius: threadMessages?.photoURL ? "20px 20px 20px 3px" : threadMessages?.file.filename ? "20px 20px 20px 3px" : "3px 20px 20px 20px",
                            color: colors.grey[200],
                            p: "8px 16px",
                            boxShadow:"rgb(0 0 0 / 8%) 0px 5px 22px, rgb(0 0 0 / 6%) 0px 0px 0px 0.5px",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            width: "fit-content"
                        }}
                    >
                        <FlexBetween sx={{wordBreak: "break-word"}}>
                            <Typography variant="h6" sx={{color: colors.grey[100]}}>{threadMessages?.text}</Typography>
                        </FlexBetween>
                    </FlexBetween>
                }
                {/* IMAGE */}
                {threadMessages?.photoURL.url && 
                    <FlexBetween sx={{mt: threadMessages?.text ? 1 : 0}}>
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
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                width={0}
                                height={0}
                                style={{ 
                                    width: '100%', 
                                    height: 'auto', 
                                    borderRadius: threadMessages?.text ? "3px 20px 20px 20px" : "20px 20px 20px 20px",
                                    opacity:  threadMessages?.photoURL.isLoading ? 0.2 : imageLoading ? 0 : 1,
                                    maxWidth: "245px",
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
                                borderRadius: threadMessages?.text ? "3px 20px 20px 20px" : "20px 20px 20px 20px",
                                maxHeight: { xs: "220px", md: "245px" },
                                maxWidth: { xs: "220px", md: "245px" },
                                width: imageLoading ? "0px" : "auto",
                                opacity:  threadMessages?.photoURL.isLoading ? 0.2 : imageLoading ? 0 : 1
                            }}
                        />
                        {imageLoading && <Skeleton variant="rounded" animation="wave" width={210} height={120} /> }
                    </FlexBetween>
                }
                {/* FILE */}
                {threadMessages?.file.filename && 
                    <Box sx={{
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
                                backgroundColor: hex2rgb(colors.grey[600], "60").rgb,  
                                color: "white",
                                width:"35px", 
                                height:"35px", 
                                mr: 1
                            }}
                        >
                            <FilePresent/>
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
                <Box sx={{pr: "16px", pl: "16px", mt:"8px"}}>
                    <Typography variant="body2" sx={{color: theme.palette.text.secondary}} >{threadMessages?.createdAt?.seconds && moment(new Date(threadMessages?.createdAt?.seconds * 1000)).fromNow()}</Typography>
                </Box>
            </Box>
        </FlexBetween>
    )
}
export default LeftMessage;