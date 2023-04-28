import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import { auth } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import PageContentLayout from '../../ScapComponents/PageContent';
import WelcomeComponent from '../WelcomeComponent';

type LoginProps = {
    setIsAuth: (value: React.SetStateAction<string>) => void;
    setIsAccessingFirestore: (value: React.SetStateAction<boolean>) => void;
};

const Login:React.FC<LoginProps> = ({setIsAuth, setIsAccessingFirestore}) => {
    
    const theme = useTheme();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginForm, setLoginForm] = useState({
        email:'',
        password:''
    });
    const [formEmailError, setEmailFormError] = useState({
        errorMessage:'',
        status: false
    });
    const [formPasswordError, setFormPasswordError] = useState({
        errorMessage:'',
        status: false
    });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsAccessingFirestore(true);
        if (!loginForm.email.includes("@")) {
            setEmailFormError({errorMessage: "Must be a valid email.", status: true});
        }
        if(!loginForm.password){
            setFormPasswordError({errorMessage: "Password is required", status: true});
        }
        if(formEmailError.status == true || formPasswordError.status == true){
            return;
        } else {
            if(loginForm.email != "" && loginForm.password != ""){
                setLoading(true);
                signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential?.user;
                    // console.log(user);
                    setLoading(false);
                    // ...
                })
                .catch((error) => {
                    setError(error.message);
                    setLoginForm({...loginForm, password: ""});
                    setFormPasswordError({errorMessage: "", status: true});
                    setLoading(false);
                });
                setIsAccessingFirestore(false);
            }
        }
    } 

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
        if(event.target.name == "email"){
            setEmailFormError({errorMessage: "", status: false});
        }
        if(event.target.name == "password"){
            setFormPasswordError({errorMessage: "", status: false});
        }
    };

    const textFieldOnBlur = (value: string) => {
        if(value == "email"){
            let errMsg = "";
            let stat = false;
            const completeEmail = loginForm.email.split("@");

            if(!loginForm.email){
                errMsg = "Email is required.";
                stat= true;
            }else {
                if(!loginForm.email.includes("@")){
                    errMsg = "Must be a valid email.";
                    stat= true;
                }
            }
            if(completeEmail[1]== ""){
                errMsg = "Please enter a part following '@'. " + loginForm.email + " is incomplete.";
                stat= true;
            }
            if(loginForm.email.includes("@") && completeEmail[1] != ""){
                if(!completeEmail[1].includes(".")){
                    errMsg = "Email is incomplete.";
                    stat= true;
                }
            }
            setEmailFormError({errorMessage: errMsg, status: stat});
        }
        if(value == "password"){
            let errMsg = "";
            let stat = false;
            if(!loginForm.password){
                errMsg = "Password is required.";
                stat= true;
            }
            setFormPasswordError({errorMessage: errMsg, status: stat});
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
                        Log in
                </Typography>
                <FlexBetween>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 300,
                            color: theme.palette.text.secondary,
                            alignText: "center",
                            marginRight: 1
                        }}
                    >
                        Dont have an account? 
                    </Typography>
                    <Typography 
                        onClick={() => {setIsAuth("signup")}}
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
                        Register
                    </Typography>
                </FlexBetween>
                <Box sx={{paddingTop: 2 }}>
                    <form onSubmit={onSubmit}>
                        <Box sx={{margin: "15px 0 20px 0"}}>
                            <ScapPrimaryTextField type="email" label="Email Address" name="email" isError={formEmailError} onBlur={textFieldOnBlur} onChange={onChange}  />
                        </Box>
                        <Box sx={{margin: "20px 0"}}>
                            <ScapPrimaryTextField type="password" resetValue={loginForm.password} label="Password" name="password" isError={formPasswordError} onBlur={textFieldOnBlur} onChange={onChange} />
                        </Box>
                        <Typography fontSize="12px" color= '#f44336'>
                            {FIREBASE_ERRORS[error as keyof typeof FIREBASE_ERRORS]}
                        </Typography>
                        <Box sx={{margin: "20px 0"}}>
                            <ScapPrimaryButton type="submit" theme={theme} fullWidth color="primary" variant="contained">
                                {loading ? (<CircularProgress size={26} sx={{color: "white"}}/>)  : <>Continue</> }
                            </ScapPrimaryButton>
                        </Box>
                        <Box sx={{
                            marginTop: "20px",
                            '& a:hover':{
                                  textDecoration: "underline !important"      
                            }
                            }}>
                            <Typography
                                onClick={() => {setIsAuth("forgotpassword")}} 
                                sx={{
                                    color: theme.palette.secondary.main, 
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    '&:hover': {
                                        textDecoration: "underline !important"   
                                    }
                                }} 
                            >
                                Forgot Password?
                            </Typography>
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
export default Login;