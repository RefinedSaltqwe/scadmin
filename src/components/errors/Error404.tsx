import FlexBetween from '@/components/ScapComponents/FlexBetween';
import { Box, Button, Typography, useTheme } from '@mui/material';
import React from 'react';
import Image from 'next/image'
import useNavigation from '@/hooks/useNavigation';

type Error404Props = {
    
};

const Error404:React.FC<Error404Props> = () => {

    const theme = useTheme();
    const { navigatePage } = useNavigation();
    
    return (
        <FlexBetween sx={{height: "100%", justifyContent: "center"}}>
            <FlexBetween sx={{flexDirection: "column"}}>
                <Box sx={{mb: 6}}>
                    <Image
                        src="/assets/img/error-404.png"
                        alt="Picture of the author"
                        width={300}
                        height={300}
                    />
                </Box>
                <Typography variant="h3" sx={{color: theme.palette.text.primary, fontWeight: 700, textAlign: "center"}} >404: The page you are looking for isn’t here</Typography>
                <Typography variant="h5" sx={{color: theme.palette.text.secondary, textAlign: "center"}} >You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation.</Typography>
                <Button 
                    variant="text" 
                    size="large" 
                    sx={{color: theme.palette.secondary.main, fontSize: 14, fontWeight: 700, borderRadius: 3, mt: 5}}
                    onClick={()=> navigatePage("/")}
                >
                    Back to Home
                </Button>
            </FlexBetween>
        </FlexBetween>
    )
}
export default Error404;