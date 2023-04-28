import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { EmojiObjectsOutlined } from '@mui/icons-material';
import { Alert, Typography, Box, useTheme } from '@mui/material';
import React from 'react';

type AlertInfoProps = {
    text: string;
};

const AlertInfo:React.FC<AlertInfoProps> = ({text}) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { hex2rgb } = useRgbConverter();
    
    return (
        <Alert 
            icon={<EmojiObjectsOutlined fontSize="large" sx={{color: colors.grey[400]}}/>} 
            sx={{ 
                borderRadius: 3, 
                mb: 2, 
                width: "100%", 
                backgroundColor: 
                hex2rgb(theme.palette.primary.light, "20").rgb, 
                color: colors.grey[200]
            }}
        >
            <Box sx={{display: "flex", justifyContent: "center", flexDirection: "column", height: "100%"}}>
                <Typography variant='body1'><b>Tip. </b>{text}</Typography>
            </Box>
        </Alert>
    )
}
export default AlertInfo;