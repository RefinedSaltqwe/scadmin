import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import { ArrowBack } from '@mui/icons-material';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from 'react';
import PageContentLayout from '../../ScapComponents/PageContent';
import WelcomeComponent from '../WelcomeComponent';

type ForgotPasswordProps = {
    setIsAuth: (value: React.SetStateAction<string>) => void;
};

const ForgotPassword:React.FC<ForgotPasswordProps> = ({setIsAuth}) => {
    
    const auth = getAuth();
    const theme = useTheme();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, seErrorMessage] = useState("");
    const [formEmailError, setEmailFormError] = useState({
        errorMessage:'',
        status: false
    });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!success){
            if (!email) {
                setEmailFormError({errorMessage: "This field is required.", status: true});
            } else {
                if (!email.includes("@")) {
                    setEmailFormError({errorMessage: "Must be a valid email.", status: true});
                }
            }
            
            if(formEmailError.status == true){
                return;
            } else {
                // console.log(formEmailError.status)
                setLoading(true);
                setSuccess(false);
                sendPasswordResetEmail(auth, email)
                .then(() => {
                    setLoading(false);
                    setSuccess(true);
                    seErrorMessage("");
                    setEmail("");
                })
                .catch((error) => {
                    seErrorMessage(error.message);
                    setLoading(false);
                    setSuccess(false);
                });
            }
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        if(event.target.name == "email"){
            setEmailFormError({...formEmailError, errorMessage: "", status: false});
        }
    };

    const textFieldOnBlur = (value: string) => {
        if(value == "email"){
            let errMsg = "";
            let stat = false;
            const completeEmail = email.split("@");

            if(!email){
                errMsg = "Email is required.";
                stat= true;
            }else {
                if(!email.includes("@")){
                    errMsg = "Must be a valid email.";
                    stat= true;
                }
            }
            if(completeEmail[1]== ""){
                errMsg = "Please enter a part following '@'. " + email + " is incomplete.";
                stat= true;
            }
            if(email.includes("@") && completeEmail[1] != ""){
                if(!completeEmail[1].includes(".")){
                    errMsg = "Email is incomplete.";
                    stat= true;
                }
            }
            setEmailFormError({...formEmailError, errorMessage: errMsg, status: stat});
        }
    }
    
    return (
        <PageContentLayout leftWidth="40%" rightWidth="60%" pageType="auth">
            {/* LEFT */}
            <Box width="100%">
                <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            marginBottom: 1
                        }}
                    >
                        Forgot Password
                </Typography>
                <FlexBetween>
                    <ArrowBack 
                        sx={{ 
                            fontWeight: 300,
                            color: theme.palette.text.secondary,
                            alignText: "center",
                            marginRight: 1
                    }}/>
                    <Typography 
                        onClick={() => {setIsAuth("login")}}
                        variant="h5"  
                        sx={{
                            color: theme.palette.secondary.main, 
                            fontWeight: 500,
                            cursor: "pointer",
                            '&:hover': {
                                textDecoration: "underline"
                            }
                        }}
                    > 
                        Log in
                    </Typography>
                </FlexBetween>
                <Box sx={{paddingTop: 2 }}>
                    <form onSubmit={onSubmit}>
                        {!success &&
                            <Box sx={{margin: "15px 0 20px 0"}}>
                                <ScapPrimaryTextField type="email" label="Email Address" name="email" isError={formEmailError} onBlur={textFieldOnBlur} onChange={onChange} resetValue={email} />
                            </Box>
                        }
                        <Typography fontSize="12px" color= '#f44336'>
                            {FIREBASE_ERRORS[errorMessage as keyof typeof FIREBASE_ERRORS]}
                        </Typography>
                        <Box sx={{margin: "20px 0"}}>
                            <ScapPrimaryButton type="submit" theme={theme} fullWidth color="primary" variant="contained">
                                {loading ? (<CircularProgress size={26} sx={{color: "white"}}/>)  : <>{success ? <>Email Sent!</> : <>Set reset link</>}</> }
                            </ScapPrimaryButton>
                        </Box>
                    </form>
                </Box>
            </Box>
            {/* RIGHT */}
            <Box>
                <WelcomeComponent/>
            </Box>
        </PageContentLayout>
    )
}
export default ForgotPassword;
