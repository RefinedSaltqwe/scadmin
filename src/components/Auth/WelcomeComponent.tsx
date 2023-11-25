import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { Typography, useTheme } from '@mui/material';
import React from 'react';

const WelcomeComponent:React.FC = () => {
    const { isMobile } = useMediaQueryHook();
    const theme = useTheme();
    return (
        <>
            <Typography 
                variant={isMobile ? "h1" : "h3"}
                sx={{ 
                    fontWeight: 500,
                    color: theme.palette.primary.contrastText
                }}
            >
                Welcome to Scadmin
            </Typography>
            <Typography 
                variant="h5" 
                sx={{ 
                    fontWeight: 300,
                    color: theme.palette.text.secondary
                }}
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            </Typography>
        </>
    )
}
export default WelcomeComponent;