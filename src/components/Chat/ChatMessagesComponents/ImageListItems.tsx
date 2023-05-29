import ScapAvatar from '@/components/ScapComponents/Avatar';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { tokens } from '@/mui/theme';
import { Close } from '@mui/icons-material';
import { Badge, Box, IconButton, ListItem, ListItemAvatar, useTheme } from '@mui/material';
import Image from 'next/image';
import React, { useEffect } from 'react';

type ImageListItemsProps = {
    selectedImagesBase64?: string[];
    selectedImageBase64?: string;
    setSelectedImagesBase64?: React.Dispatch<React.SetStateAction<string[]>>;
    setSelectedImageBase64?: (value: string) => void;
    setSendButoon?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageListItems:React.FC<ImageListItemsProps> = ({ selectedImagesBase64, selectedImageBase64, setSelectedImageBase64, setSelectedImagesBase64, setSendButoon }) => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { isMobile } = useMediaQueryHook();

    return (
        <>
            {(selectedImagesBase64 && selectedImagesBase64.length > 0) ? selectedImagesBase64.map((src, index) => {
                return (
                    <Box key={index} sx={{width: isMobile ? "21%" : "30%", pb: isMobile ? "21%" : "30%", position: "relative", borderRadius: "12px",  m: isMobile ? "15px" : "10px"}} >
                        <Box sx={{position: "absolute", height: "100%", width: "100%"}}>
                            <IconButton
                                size="small"
                                aria-label="Scroll to Bottom"
                                color="inherit"
                                onClick={() => {
                                    setSelectedImagesBase64 && setSelectedImagesBase64((prev) => [...prev.filter((item, index1) => index1 !== index)]);
                                    setSendButoon && setSendButoon(true);
                                }}
                                sx={{
                                    '&:hover': {
                                        bgcolor: theme.palette.mode === "dark" ? "#b8b8b8" : theme.palette.primary.dark,
                                    },
                                    width: "20px",
                                    height: "20px",
                                    bgcolor: theme.palette.mode === "dark" ? "#b8b8b8" : theme.palette.primary.dark,
                                    zIndex: 400,
                                    position: "absolute",
                                    right: "-3px",
                                    top: "-3px"
                                }}
                            >
                                <Close sx={{fontSize: "15px", color: colors.grey[900]}} />
                            </IconButton>
                            <Image src={src as string} alt="User Profile" fill loading='lazy' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover", borderRadius: "12px" }}/>
                        </Box>
                    </Box>
                )
            }) : (
                <ListItem sx={{p: "0px 0px 0px 16px"}}>
                    <ListItemAvatar sx={{mr: 0,}}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            badgeContent={
                                <IconButton
                                    size="small"
                                    aria-label="Scroll to Bottom"
                                    color="inherit"
                                    onClick={() => {
                                        setSelectedImageBase64 && setSelectedImageBase64("");
                                        setSendButoon && setSendButoon(true);
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
                            <ScapAvatar 
                                variant="rounded"
                                src={selectedImageBase64}
                                sx={{
                                    backgroundColor: colors.indigoAccent[500], 
                                    color: "white",
                                    width:"50px", 
                                    height:"50px", 
                                }}
                            >
                            </ScapAvatar>
                        </Badge>
                    </ListItemAvatar>
                </ListItem>
            )}
        </>
    )
}
export default ImageListItems;