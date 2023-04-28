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
                A professional kit that comes with ready-to-use MUI components developed with one common goal in mind, help you build faster & beautiful applications.
            </Typography>
        </>
    )
}
export default WelcomeComponent;