import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ImageListItems from '../Chat/ChatMessagesComponents/ImageListItems';
import AlertInfo from '../ScapComponents/AlertInfo';
import FlexBetween from '../ScapComponents/FlexBetween';
import FlexContainer from '../ScapComponents/FlexContainer';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import Dropzone from '../ScapComponents/Dropzone';
import { useRecoilState } from 'recoil';
import { Product, productState } from '@/atoms/productsAtom';

type MediaProps = {
    
};

const Media:React.FC<MediaProps> = () => {
    
    const { isMobile } = useMediaQueryHook();
    const [productValue, setProductValue] = useRecoilState(productState);
    const [selectedImageBlob, setSelectedImageBlob] = useState<Blob | Blob[]>();
    const [selectedImageBase64, setSelectedImageBase64] = useState<string | string[] | undefined>([]);

    useEffect(()=>{
        setProductValue((prev) => ({
            ...prev,
            productMedia: [...selectedImageBase64 as string []],
            product: {
                ...prev.product,
                images: [...selectedImageBase64 as string []]
            } as Product
        }))
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedImageBase64])

    // Pre-set the value to recoil
    useEffect(()=>{
        setSelectedImageBase64(() => [...productValue.productMedia]);
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <FlexContainer>
            <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
                    <Typography variant="h5" sx={{fontWeight: 600}}>Media</Typography>
                </Box>
            </Box>
            <AlertInfo text="Drag 'n' drop images, or click to select images. Up to 10 images at a time." />
            {selectedImageBase64 && selectedImageBase64.length > 0 ? (
                <FlexBetween sx={{ width: "100%", marginY: "8px", justifyContent: "center"}}>
                    {/* Image List */}
                    {selectedImageBase64.length > 0 &&
                        <ImageListItems selectedImagesBase64={selectedImageBase64 as string []} setSelectedImagesBase64={setSelectedImageBase64 as React.Dispatch<React.SetStateAction<string[]>>}/>
                    }
                    {/* ADD IMAGE */}
                    <Box sx={{width: isMobile ? "21%" : "30%", pb: isMobile ? "21%" : "30%", position: "relative", borderRadius: "12px", m: isMobile ? "15px" : "10px", cursor: "pointer"}}>
                        <Box sx={{position: "absolute", height: "100%", width: "100%"}}>
                            {/* <FlexBetween sx={{height: "100%", width: "100%", justifyContent: "center", borderWidth: "2px", borderRadius: "12px", borderColor: hex2rgb(theme.palette.primary.light, "80").rgb, borderStyle: "dashed"}}>
                                <AddPhotoAlternateOutlined sx={{width: "25%", height: "25%", color: hex2rgb(theme.palette.primary.light, "80").rgb}} />
                            </FlexBetween> */}
                            <Dropzone size="50%" multipleFiles={true} setSelectedImageBlob={setSelectedImageBlob} setSelectedImageBase64={setSelectedImageBase64} />
                        </Box>
                    </Box>
                </FlexBetween> 
            ):(
                <FlexBetween sx={{ width: "100%", mt: "24px", mb: "8px", justifyContent: "center", height: "100%"}}>
                    <Dropzone size="12%" multipleFiles={true} setSelectedImageBlob={setSelectedImageBlob} setSelectedImageBase64={setSelectedImageBase64} />
                </FlexBetween>
            )}
        </FlexContainer>
    )
}
export default Media;