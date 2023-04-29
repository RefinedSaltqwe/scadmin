import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import { auth, firestore } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { sendEmailVerification, updateProfile, User } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import PageContentLayout from '../../ScapComponents/PageContent';
import WelcomeComponent from '../WelcomeComponent';

type RegisterProps = {
    setIsAuth: (value: React.SetStateAction<string>) => void;
    setIsAccessingFirestore: (value: React.SetStateAction<boolean>) => void;
};

const Register:React.FC<RegisterProps> = ({ setIsAuth, setIsAccessingFirestore }) => {
    
    const theme = useTheme();
    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
      ] = useCreateUserWithEmailAndPassword(auth);

    const [loginForm, setLoginForm] = useState({
        firstName:'',
        lastName:'',
        email:'',
        password:'',
        confirmPassword:''
    });
    const [formEmailError, setEmailFormError] = useState({
        errorMessage:'',
        status: false
    });
    const [formPasswordError, setFormPasswordError] = useState({
        errorMessage:'',
        status: false
    });
    const [formConfirmPasswordError, setConfirmFormPasswordError] = useState({
        errorMessage:'',
        status: false
    });
    const [formFirstname, setFormFirstname] = useState({
        errorMessage:'',
        status: false
    });
    const [formLastname, setFormLastname] = useState({
        errorMessage:'',
        status: false
    });
    const [passwordCharLeft, setPasswordCharLeft] = useState(21);

    const passwordSecurity=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*].{5,20}$/;

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!loginForm.firstName){
            setFormFirstname({...formFirstname, errorMessage: "This field is required", status: true});
        }
        if(!loginForm.lastName){
            setFormLastname({...formLastname, errorMessage: "This field is required", status: true});
        }
        if (!loginForm.email) {
            setEmailFormError({errorMessage: "Must be a valid email.", status: true});
        }
        if(!loginForm.password){
            setFormPasswordError({errorMessage: "Password is required.", status: true});
        } else {
            if (loginForm.password.length < 6 ) {
                setFormPasswordError({errorMessage: "Password must be at least 6 characters.", status: true});
            } else if(!loginForm.password.match(passwordSecurity)) {
                setFormPasswordError({errorMessage: "Password must contain Uppercase, Number and Special Character.", status: true});
            }
        }
        if(!loginForm.confirmPassword){
            setConfirmFormPasswordError({errorMessage: "Confirm Password is required.", status: true});
        }
        if(loginForm.password != loginForm.confirmPassword){
            setConfirmFormPasswordError({errorMessage: "Password do not match.", status: true});
            return;
        } else {
            setConfirmFormPasswordError({errorMessage: "", status: false});
        }
        if(formEmailError.status == false && formPasswordError.status == false && formConfirmPasswordError.status == false && formFirstname.status == false && formLastname.status == false){
            if(loginForm.firstName != "" && loginForm.lastName != "" && loginForm.email != "" && loginForm.email != "" && loginForm.password != "" && loginForm.confirmPassword != ""){
                setIsAccessingFirestore(true);
                createUserWithEmailAndPassword(loginForm.email.trim(), loginForm.password)
                .then((userCred)=> {
                    if(userCred){
                        updateProfile(userCred.user, {
                            displayName: loginForm.firstName.trim() + " " + loginForm.lastName.trim(), 
                        });
                        sendEmailVerification(auth.currentUser!)
                        .then(() => {
                            // Email verification sent!
                            // console.log("Email verification sent!");
                        });
                    }
                })
                .catch((error) => {
                    console.log("Error occured: ", error);
                });
                
                if(userError){
                    console.log(userError);
                }
            }
        } 
    } 
    const createUserDocument = async (user: User) => {
        const firestoreUserSnippet = {
            uid: user.uid,
            currentThread: "",
            firstName: loginForm.firstName.trim(),
            lastName: loginForm.lastName.trim(),
            userType: "staff",
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerData: user.providerData,
            createdAt: serverTimestamp() as Timestamp,
        }
        try{
            await setDoc(doc(firestore, "users", user.uid), firestoreUserSnippet);
            // console.log("User Successfully Created", user.uid);
            setIsAccessingFirestore(false);
            setIsAuth("login");
        } catch (error) {
            console.log("Create Error: ",error)
        }  
    };

    
    useEffect(() => {
        if(userCred) {
            createUserDocument(userCred.user);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCred]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
        if(event.target.name == "email"){
            setEmailFormError({errorMessage: "", status: false});
        }

        if(event.target.name == "password" ){
            if (event.target.value.length < 6 ) {
                setFormPasswordError({errorMessage: "Password must be at least 6 characters.", status: true});
            } else if(!event.target.value.match(passwordSecurity)) {
                setFormPasswordError({errorMessage: "Password must contain Uppercase, Number and Special Character.", status: true});
            } else {
                setFormPasswordError({errorMessage: "", status: false});
            }
            const getPassLength = 21 - event.target.value.length;
            setPasswordCharLeft(getPassLength);
        }
        
        if(event.target.name == "confrimPassword"){
            setConfirmFormPasswordError({errorMessage: "", status: false});
        }
    };

    const textFieldOnBlur = (value: string) => {
        if(value == "firstName"){
            if(!loginForm.firstName){
                setFormFirstname({errorMessage: "This field is required", status: true});
            } else {
                setFormFirstname({errorMessage: "", status: false});
            }
        }
        if(value == "lastName"){
            if(!loginForm.lastName){
                setFormLastname({errorMessage: "This field is required", status: true});
            } else {
                setFormLastname({errorMessage: "", status: false});
            }
        }
        if(value == "email"){
            let errMsg = "";
            let stat = false;
            const completeEmail = loginForm.email.split("@");

            if(!loginForm.email){
                errMsg = "Email is required.";
                stat= true;
            }
            if(loginForm.email && !loginForm.email.includes("@") ){
                errMsg = "Must be a valid email.";
                stat= true;
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
            } else {
                if (loginForm.password.length < 6 ) {
                    errMsg = "Password must be at least 6 characters.";
                    stat = true;
                } else {
                    if(!loginForm.password.match(passwordSecurity)) {
                        errMsg ="Password must contain Uppercase, Number and Special Character.";
                        stat = true;
                    }
                }
            }
            setFormPasswordError({errorMessage: errMsg, status: stat});
        }
        if(value == "confirmPassword"){
            let errMsg = "";
            let stat = false;
            if(!loginForm.password){
                errMsg = "Confrim Password is required.";
                stat= true;
            }
            setConfirmFormPasswordError({errorMessage: errMsg, status: stat});
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
                        Register
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
                        Already have an account? 
                    </Typography>
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
                        <Box sx={{margin: "15px 0 20px 0"}}>
                            <ScapPrimaryTextField type="text" label="First name" name="firstName" onBlur={textFieldOnBlur} onChange={onChange} isError={formFirstname} />
                        </Box>
                        <Box sx={{margin: "15px 0 20px 0"}}>
                            <ScapPrimaryTextField type="text" label="Last name" name="lastName" onBlur={textFieldOnBlur} onChange={onChange} isError={formLastname}/>
                        </Box>
                        <Box sx={{margin: "15px 0 20px 0"}}>
                            <ScapPrimaryTextField type="email" label="Email Address" name="email" onBlur={textFieldOnBlur} onChange={onChange}  isError={formEmailError}/>
                        </Box>
                        <Box sx={{margin: "20px 0"}}>
                            <ScapPrimaryTextField type="password" label="Password" name="password" authType="register" passwordCharLeft={passwordCharLeft} onBlur={textFieldOnBlur} onChange={onChange} isError={formPasswordError}/>
                        </Box>
                        <Box sx={{margin: "20px 0"}}>
                            <ScapPrimaryTextField type="password" label="Confirm password" name="confirmPassword" onBlur={textFieldOnBlur} onChange={onChange} isError={formConfirmPasswordError}/>
                        </Box>
                        <Typography fontSize="12px" color= '#f44336'>
                            {FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
                        </Typography>
                        <Box sx={{margin: "20px 0"}}>
                            <ScapPrimaryButton type="submit" theme={theme} fullWidth color="primary" variant="contained">
                                {loading ? (<CircularProgress size={26} sx={{color: "white"}}/>)  : <>Register</> }    
                            </ScapPrimaryButton>
                        </Box>
                        <Box sx={{
                            marginTop: "20px",
                            '& a:hover':{
                                  textDecoration: "underline !important"      
                            }
                            }}>
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
export default Register;