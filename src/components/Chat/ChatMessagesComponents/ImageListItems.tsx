import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { tokens } from '@/mui/theme';
import { Close } from '@mui/icons-material';
import { Box, IconButton, useTheme } from '@mui/material';
import Image from 'next/image';
import React, { useEffect } from 'react';

type ImageListItemsProps = {
    selectedImageBase64: string[] ;
    setSelectedImageBase64: React.Dispatch<React.SetStateAction<string[]>>;
    setSendButoon?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageListItems:React.FC<ImageListItemsProps> = ({ selectedImageBase64, setSelectedImageBase64, setSendButoon }) => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { isMobile } = useMediaQueryHook();

    return (
        <>
            {selectedImageBase64.map((src, index) => {
                return (
                    <Box key={index} sx={{width: isMobile ? "21%" : "30%", pb: isMobile ? "21%" : "30%", position: "relative", borderRadius: "12px",  m: isMobile ? "15px" : "10px"}} >
                        <Box sx={{position: "absolute", height: "100%", width: "100%"}}>
                            <IconButton
                                size="small"
                                aria-label="Scroll to Bottom"
                                color="inherit"
                                onClick={() => {
                                    setSelectedImageBase64((prev) => [...prev.filter((item, index1) => index1 !== index)]);
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
            })}
        </>
    )
}
export default ImageListItems;