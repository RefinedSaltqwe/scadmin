import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import ScapSecondaryButton from '@/components/ScapComponents/SecondaryButton';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { Backdrop, Box, Divider, Fade, Modal, Typography, useTheme } from '@mui/material';
import React from 'react';

type ConfirmModalProps = {
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    setOpen: React.Dispatch<React.SetStateAction<{
        open: boolean;
        text: string;
    }>>;
    open: {
        open: boolean;
        text: string;
    }
};

const ConfirmModal:React.FC<ConfirmModalProps> = ({open, setOpen,setConfirm }) => {
    
    const theme = useTheme();
    const { isMobile } = useMediaQueryHook();

    const handleCloseModal = () => {
        setOpen({open: false, text: ""});
        setConfirm(false);
    };
    
    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open.open}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open.open}>
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
                        <FlexBetween sx={{flexDirection: "row"}}>
                            <Typography variant="h5" sx={{fontWeight: 700, mb: 2, width: "100%"}}>{open.text}</Typography>
                            <Divider/>
                                <Box sx={{width: "100%", display: "flex", justifyContent: "end"}}>
                                    <ScapSecondaryButton type="button" theme={theme} color="primary" variant="contained" sx={{mt: 2, mr: 2}} onClick={handleCloseModal}>
                                        Cancel
                                    </ScapSecondaryButton>
                                    <ScapPrimaryButton type="button" theme={theme} color="primary" variant="contained" sx={{mt: 2}} onClick={()=>{setConfirm(true)}}>
                                        Confirm
                                    </ScapPrimaryButton>
                                </Box>
                        </FlexBetween>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
export default ConfirmModal;