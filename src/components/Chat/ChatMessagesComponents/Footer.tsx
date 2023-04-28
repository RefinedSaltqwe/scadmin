import ScapAvatar from '@/components/ScapComponents/Avatar';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import { auth } from '@/firebase/clientApp';
import useChatThread from '@/hooks/useChatThread';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { AttachFileOutlined, InsertPhotoOutlined, SendOutlined } from '@mui/icons-material';
import { Box, IconButton, List, ListItem, ListItemAvatar, Tooltip, useTheme } from '@mui/material';
import React, { memo, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

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
    const { storeMessage } = useChatThread();
    const { hex2rgb } = useRgbConverter();
    const [messageButtons, setMessageButtons] = useState(true);
    const chatMessage = useRef('');

    const onChangeMessageText = (input: string) => {
        chatMessage.current = input;
    }

    const onMessageFieldFocus = (value: boolean) => {
        setMessageButtons(value)
    }

    const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => { 
        event.preventDefault(); 

        setSendButoon(true);
        storeMessage("chatMessage", currentThread, chatMessage.current, "", "", selectedImage, setSelectedImage, selectedFile, setSelectedFile)
        .then((isSuccess) => {
            if(isSuccess){
                chatMessage.current = "";
            } 
        })
        .catch((error) => {
            console.log("Error occured: ", error);
        });
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
                            <ScapPrimaryTextField type="text" label="Message" name="message" setSendButoon={setSendButoon} onChangeMessageText={onChangeMessageText} sendButton={sendButton}/>
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
export default memo(ChatMessagesFooter);