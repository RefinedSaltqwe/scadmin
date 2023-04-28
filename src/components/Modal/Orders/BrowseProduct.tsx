import AlertInfo from '@/components/ScapComponents/AlertInfo';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import ScapSecondaryButton from '@/components/ScapComponents/SecondaryButton';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { Backdrop, Box, Divider, Fade, Modal, Typography, useTheme } from '@mui/material';
import React from 'react';

type BrowseProductProps = {
    setOpen: React.Dispatch<React.SetStateAction<{
        open: boolean;
        text: string;
    }>>;
    open: {
        open: boolean;
        text: string;
    }
};

const BrowseProduct:React.FC<BrowseProductProps> = (props) => {

    const { setOpen, open } = props;
    const theme = useTheme();
    const { isMobile } = useMediaQueryHook();

    const handleCloseModal = () => {
        setOpen({open: false, text: ""});
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
                            <Typography variant="h5" sx={{fontWeight: 700, mb: 2, width: "100%"}}>Products</Typography>
                            <Divider/>
                                <Box sx={{width: "100%", display: "flex", justifyContent: "end", flexDirection: "column"}}>
                                    <AlertInfo text="Browse for products." />
                                    <Box sx={{flexGrow: 1}}>
                                        <ScapPrimaryTextField type="text" resetValue={open.text} label="Search" name="search" onChange={(e)=>{
                                            setOpen({open: true, text: e.target.value})
                                        }} />
                                    </Box>
                                    <Box sx={{flexGrow: 0}}>
                                        <ScapSecondaryButton type="button" theme={theme} color="primary" variant="contained" sx={{mt: 2, mr: 2}} onClick={handleCloseModal}>
                                            Cancel
                                        </ScapSecondaryButton>
                                        <ScapPrimaryButton type="button" theme={theme} color="primary" variant="contained" sx={{mt: 2}} onClick={()=>{}}>
                                            Add
                                        </ScapPrimaryButton>
                                    </Box>
                                </Box>
                        </FlexBetween>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
export default BrowseProduct;