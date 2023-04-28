import FlexBetween from '@/components/ScapComponents/FlexBetween';
import { Backdrop, Box, Fade, Modal, Skeleton } from '@mui/material';
import React, { useState } from 'react';

type ImageModalProps = {
    setOpenImageModal: React.Dispatch<React.SetStateAction<{
        open: boolean;
        imgURL: string;
    }>>;
    openImageModal: {
        open: boolean;
        imgURL: string;
    };
};

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: "90%",
    boxShadow: 24,
  };

const ImageModal:React.FC<ImageModalProps> = ({setOpenImageModal ,openImageModal}) => {
    
  const handleClose = () => setOpenImageModal(prev => ({ ...prev, open: false}));
  const [imageLoading, setImageLoading] = useState(true);
    
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openImageModal.open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
        <Fade in={openImageModal.open}>
            <FlexBetween sx={style}>
                <Box
                    component="img"
                    alt="Loading..."
                    src={openImageModal.imgURL}
                    srcSet={openImageModal.imgURL}
                    loading="lazy" 
                    onLoad={() => {setImageLoading(false)}}
                    sx={{
                        maxHeight: { xs: "650px", md: "900px" },
                        maxWidth: { xs: "350px", sm:"550px", md: "1000px", lg: "1150px", xl: "1500px" },
                        width: imageLoading ? "0px" : "auto",
                        opacity: imageLoading ? 0 : 1
                    }}
                />
                {imageLoading && <Skeleton variant="rounded" animation="wave" width={350} height={650} /> }
            </FlexBetween>
        </Fade>
      </Modal>
    )
}
export default ImageModal;