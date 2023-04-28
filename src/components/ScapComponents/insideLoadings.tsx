import { Bolt } from '@mui/icons-material';
import { Box, CircularProgress, useTheme } from '@mui/material';
import React from 'react';
import FlexBetween from './FlexBetween';

type ScapInsideLoadingProps = {
    
};

const ScapInsideLoading:React.FC<ScapInsideLoadingProps> = () => {
    const theme = useTheme();
    
    return (
        <Box sx={{margin: 0, position: "absolute", top: "50%", width: "100%", transform: "translateY(-50%)" }}>
            <FlexBetween sx={{justifyContent: "center", width: "100%"}}>
                <CircularProgress 
                    size={60}
                    thickness={2}
                    sx={{
                        '&.MuiCircularProgress-root': {
                            animation: "animation-61bdi0 .7s linear infinite"
                        },
                        color: theme.palette.secondary.main,
                        position: "absolute"
                    }} 
                />
                <Bolt sx={{position: "absolute", fontSize: 30}}/>
            </FlexBetween>
        </Box>
    )
}
export default ScapInsideLoading;