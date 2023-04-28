import ScapAvatar from '@/components/ScapComponents/Avatar';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { Close, FilePresent } from '@mui/icons-material';
import { Badge, Box, IconButton, ListItem, ListItemAvatar, Typography, useTheme } from '@mui/material';
import React from 'react';

type FileListItemsProps = {
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

const FileListItems:React.FC<FileListItemsProps> = ({ selectedFile, setSelectedFile, setSendButoon }) => {
    
    const theme = useTheme();
    const { hex2rgb } = useRgbConverter();
    const colors = tokens(theme.palette.mode);

    return (
        <ListItem sx={{p: "0px 0px 0px 16px"}}>
            <ListItemAvatar 
                sx={{
                    '& .MuiBadge-badge.MuiBadge-standard': {
                        position: "relative",
                        top: "5px",
                        right: "38px"
                    },
                    mr: 0,
                }}>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    badgeContent={
                        <IconButton
                            size="small"
                            aria-label="Delete"
                            color="inherit"
                            onClick={() => {
                                setSelectedFile({filename: "", data: ""});
                                setSendButoon(true);
                            }}
                            sx={{
                                '&:hover': {
                                    bgcolor: theme.palette.mode === "dark" ? "#b8b8b8" : theme.palette.primary.dark,
                                },
                                width: "20px",
                                height: "20px",
                                bgcolor: theme.palette.mode === "dark" ? "#b8b8b8" : theme.palette.primary.dark,
                            }}
                        >
                            <Close sx={{fontSize: "15px", color: colors.grey[900]}} />
                        </IconButton>
                    }
                >
                    <Box sx={{
                            height: "50px", 
                            width: "200px", 
                            borderRadius:"5px 5px 5px 5px", 
                            backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.dark : hex2rgb(colors.grey[900], "60").rgb, 
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
                            <FilePresent/>
                        </ScapAvatar>
                        <Typography sx={{whiteSpace: "nowrap", width:"80%", overflow:"hidden", textOverflow: "ellipsis"}} >{selectedFile.filename}</Typography>
                    </Box>
                </Badge>
            </ListItemAvatar>
        </ListItem>
    )
}
export default FileListItems;