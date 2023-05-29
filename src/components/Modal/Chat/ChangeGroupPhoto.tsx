import { chatThreadsState } from '@/atoms/chatAtoms';
import { modalChangeGroupPhotoState } from '@/atoms/modalChangeGroupPhoto';
import { snackbarState } from '@/atoms/snackbarAtoms';
import { usersAtomState } from '@/atoms/usersAtom';
import Dropzone from '@/components/ScapComponents/Dropzone';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapInsideLoading from '@/components/ScapComponents/insideLoadings';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import ScapSecondaryButton from '@/components/ScapComponents/SecondaryButton';
import useChatThread from '@/hooks/useChatThread';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { Backdrop, Box, Divider, Fade, Modal, Typography, useTheme } from '@mui/material';
import { red } from '@mui/material/colors';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Resizer from "react-image-file-resizer";

type ChangeGroupPhotoProps = {
    
};

const ChangeGroupPhoto:React.FC<ChangeGroupPhotoProps> = () => {

    const theme = useTheme();
    const { isMobile } = useMediaQueryHook();
    const { storeMessage } = useChatThread();
    const [modalChangeGroupPhotoOpen, setModalChangeGroupPhotoOpen] = useRecoilState(modalChangeGroupPhotoState);
    const setSnackbarValue = useSetRecoilState(snackbarState);
    const chatThreadsValue = useRecoilValue(chatThreadsState)
    const usersAtomValue = useRecoilValue(usersAtomState)
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [imgIsUploading, setImgIsUploading] = useState(false);
    const [selectedImageBlob, setSelectedImageBlob] = useState<Blob>();
    const [selectedImageBase64, setSelectedImageBase64] = useState<string>();
    const [resizedImage, setResizedImage] = useState<string>();
    const imgRef = useRef<null | HTMLElement>(null);

    const handleCloseModal = () => {
        setModalChangeGroupPhotoOpen(false);
        setButtonDisabled(true);
        setSelectedImageBlob(undefined);
        setSelectedImageBase64("");
        setResizedImage("");
    };

    const resizeFile = (file: any, height: number, width: number, maxWidth: number) => new Promise(resolve => {
        let finalHeight: number = height;
        let finalWidth: number = width;

        if(maxWidth < width){
            finalWidth = maxWidth;
            finalHeight = height - (width - maxWidth);
        }

        Resizer.imageFileResizer(file, finalWidth, finalHeight, 'JPEG', 100, 0,
        uri => {
          resolve(uri);
        }, 'blob' );
    });

    const BlobToBase64 = async (file: Blob) => {
        const width = imgRef?.current?.clientWidth;
        const height = imgRef?.current?.clientHeight;
        const maxWidth = 75;
        const reader = new FileReader();

        const image = await resizeFile(file, height!, width!, maxWidth) as Blob;
        if(image){
            reader.readAsDataURL(image); //Base64
            // reader.readAsArrayBuffer(file) //File or Blob
        }

        reader.onabort = () => setSnackbarValue({ open: true, type: "error", text: `File reading was aborted.` });
        reader.onerror = () => setSnackbarValue({ open: true, type: "error", text: `File reading has failed.` });
        reader.onload = (readerEvent) => {
            setResizedImage(readerEvent.target?.result as string);
        }
    }

    const imgLoaded = () => {
        if(selectedImageBlob){
            BlobToBase64(selectedImageBlob!);
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevents to reload the page when submit is triggered
        setImgIsUploading(true);
        
        storeMessage("changeChatPhoto",chatThreadsValue.currentThreadId, `${usersAtomValue.myInfo.firstName + " " +usersAtomValue.myInfo.lastName} changed the chat photo.`, "","", resizedImage, setResizedImage)
        .then((isSuccess) => {
            if(isSuccess){
                handleCloseModal();
                setImgIsUploading(false);
                setSelectedImageBlob(undefined);
                setSelectedImageBase64("");
                setResizedImage("");
                setSnackbarValue({ open: true, type: "success", text: `You changed the chat photo.` });
                setButtonDisabled(true);
            } else {
                setSnackbarValue({ open: true, type: "error", text: "There was an error changing the chat photo. Try again. " });
            }
        })
        .catch((error) => {
            setSnackbarValue({ open: true, type: "error", text: "There was an error changing the chat photo. Try again. " });
            console.log("Error occured: ", error);
        });
    }

    useEffect(()=>{
        // console.log(imgRef?.current?.clientWidth + " == " + imgRef?.current?.clientHeight)
        if(selectedImageBlob){
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        } 
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedImageBlob])
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalChangeGroupPhotoOpen}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalChangeGroupPhotoOpen}>
                    <Box sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: 620,
                        width: "95%",
                        bgcolor: theme.palette.mode === "dark" ? theme.palette.primary.main : "#fff",
                        boxShadow: 24,
                        p: isMobile ? 4 : "27px",
                        borderRadius: 4
                    }}>
                        <form onSubmit={onSubmit}>
                            <FlexBetween sx={{flexDirection: "row"}}>
                                <Typography variant="h5" sx={{fontWeight: 700, mb: 2, width: "100%"}}>Change Chat Photo</Typography>
                                <Divider/>
                                    {imgIsUploading ? (
                                        <Box sx={{width: "100%", height:"150px", alignItems:"center", display: "flex", justifyContent: "center", flexDirection: "column"}}>
                                            <ScapInsideLoading />
                                        </Box>
                                    ):(
                                        <>
                                            {selectedImageBlob ? (
                                                <Box sx={{width: "100%", alignItems:"center", display: "flex", justifyContent: "center", flexDirection: "column"}}>
                                                    <Box
                                                        ref={imgRef}
                                                        component="img"
                                                        alt="Loading..."
                                                        src={selectedImageBase64}
                                                        srcSet={selectedImageBase64} 
                                                        loading="lazy" 
                                                        onLoad={() => {imgLoaded()}}
                                                        sx={{
                                                            cursor: "pointer",
                                                            maxHeight: { xs: "220px", md: "245px" },
                                                            maxWidth: { xs: "220px", md: "245px" },
                                                        }}
                                                    />
                                                </Box>
                                            ):(
                                                <Dropzone multipleFiles={false} setSelectedImageBlob={setSelectedImageBlob} setSelectedImageBase64={setSelectedImageBase64} />
                                            )}
                                        </>
                                    )}
                                    <Box sx={{width: "100%", display: "flex", justifyContent: "end"}}>
                                        {!imgIsUploading && 
                                            <>
                                                {selectedImageBlob && 
                                                    <ScapSecondaryButton type="button" onClick={() => {setSelectedImageBlob(undefined); setSelectedImageBase64("");}} sx={{mt: 2, mr: 2, color: "white", backgroundColor: red[500], '&:hover':{backgroundColor: red[700] }}} theme={theme} color="primary" variant="outlined">
                                                        Remove
                                                    </ScapSecondaryButton>
                                                }
                                            </>
                                        }
                                        <ScapSecondaryButton type="button" theme={theme} color="primary" variant="contained" sx={{mt: 2, mr: 2}} onClick={handleCloseModal}>
                                            Cancel
                                        </ScapSecondaryButton>
                                        <ScapPrimaryButton type="submit" theme={theme} color="primary" variant="contained" sx={{mt: 2}} disabled={buttonDisabled}>
                                            Upload
                                        </ScapPrimaryButton>
                                    </Box>
                            </FlexBetween>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}
export default ChangeGroupPhoto;