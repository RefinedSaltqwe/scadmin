import ScapAvatar from '@/components/ScapComponents/Avatar';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { AddPhotoAlternateOutlined } from '@mui/icons-material';
import { Box, List, ListItem, ListItemAvatar, useTheme } from '@mui/material';
import React, { memo, useEffect } from 'react';
import FileListItems from './FileItems';
import ImageListItems from './ImageListItems';

type FilePreviewProps = {
    selectedFile: {
        filename: string;
        data: string;
    };
    setSelectedFile: React.Dispatch<React.SetStateAction<{
        filename: string;
        data: string;
    }>>;
    setSendButoon: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilePreview:React.FC<FilePreviewProps> = ({selectedFile, setSelectedFile, setSendButoon}) => {
    
    const { hex2rgb } = useRgbConverter();
    const { isMobile } = useMediaQueryHook();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    return (
        <FlexBetween 
            sx={{
                width:"100%", 
                height: "auto", 
                borderTop: `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`, 
                backgroundColor: theme.palette.primary.main,
                position: isMobile ? "unset" : "relative",
                bottom: "63px"
            }}
        >
            <Box sx={{flexGrow: 0, pt: 1, pb: 1, flexDirection: "column"}}>
                <List sx={{pb: 0, pt: 0, display: "flex", flexDirection: "row"}}>
                    <ListItem sx={{p: "0px 0px 0px 16px", cursor: "pointer"}} onClick={()=>{}}>
                        <ListItemAvatar sx={{mr: 0,}}>
                            <ScapAvatar 
                                variant="rounded"
                                sx={{
                                    backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.dark : hex2rgb(colors.grey[900], "60").rgb, 
                                    color: "white",
                                    width:"50px", 
                                    height:"50px", 
                                }}
                            >
                                <AddPhotoAlternateOutlined sx={{width: "30px", height: "30px", color: theme.palette.mode === "dark" ? colors.grey[100] : theme.palette.primary.dark,}} />
                            </ScapAvatar>
                        </ListItemAvatar>
                    </ListItem>
                    <FileListItems selectedFile={selectedFile} setSelectedFile={setSelectedFile} setSendButoon={setSendButoon} />
                </List>
            </Box>
            
        </FlexBetween>
    )
}
export default memo(FilePreview);