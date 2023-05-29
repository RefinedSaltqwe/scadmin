import React from 'react';
import FlexBetween from './FlexBetween';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import useRgbConverter from '@/hooks/useRgbConverter';
import ScapPrimaryButton from './PrimaryButton';
import ScapSecondaryButton from './SecondaryButton';
import { red } from '@mui/material/colors';

type SaveChangesBarProps = {
    errorMessage: string;
};

const SaveChangesBar:React.FC<SaveChangesBarProps> = ({ errorMessage }) => {

    const theme = useTheme();
    const { hex2rgb } = useRgbConverter();
    
    return (
        <FlexBetween 
            sx={{
                position: "fixed",
                width: "inherit",
                bottom: "0",
                left: "auto",
                right: "0",
                height:"64px",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: hex2rgb(theme.palette.primary.dark, "80").rgb,
                zIndex: 400,
                boxShadow: "none",
                backdropFilter: "blur(6px)",
            }}
        >
            <FlexBetween sx={{maxWidth: "1440px", justifyContent: "center", width: "100%", paddingX: "25px"}}>
                <Box sx={{flexGrow: 1}}>
                    <Typography variant="h5" sx={{fontWeight: 600, color: errorMessage ? red[500] : theme.palette.primary.contrastText}}>{errorMessage ? errorMessage : "Unsaved Changes"}</Typography>
                </Box>
                <Box sx={{flexGrow: 0}}>
                <Stack spacing={2} direction="row">
                    <ScapSecondaryButton onClick={()=>{}} color="primary" variant="contained" sx={{padding: "5px 13px 5px 13px"}} >
                        Discard
                    </ScapSecondaryButton>
                    <ScapPrimaryButton onClick={()=>{}} color="primary" variant="contained" sx={{padding: "5px 13px 5px 13px", ml: "12px"}} disabled={errorMessage !== ""}>
                        Save
                    </ScapPrimaryButton>
                </Stack>
                </Box>
            </FlexBetween>
        </FlexBetween>
    )
}
export default SaveChangesBar;