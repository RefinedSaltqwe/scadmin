import { myMenuState } from '@/atoms/layoutAtoms';
import { themeModeState } from '@/atoms/themeMode';
import { auth } from '@/firebase/clientApp';
import { ColorModeContext } from '@/mui/theme';
import { Box, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue } from 'recoil';
import ScapLoading from '../ScapComponents/Loading';
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';

const ScapSnackbar = dynamic(() => import("../ScapComponents/Snackbar"), {
    ssr: false
});

const Login = dynamic(() => import("../Auth/Login"), {
    loading: () => <ScapLoading />
});

const Register = dynamic(() => import("../Auth/Register"), {
    loading: () => <ScapLoading />
});

const ForgotPassword = dynamic(() => import("../Auth/ForgotPassword"), {
    loading: () => <ScapLoading />
});

type LayoutProps = {
    children: React.ReactNode;
};

const Layout:React.FC<LayoutProps> = ({ children }) => {

    const [mobileOpen, setMobileOpen] = useState(false);
    const modeState = useRecoilValue(themeModeState);
    const [menuStateValue, setMenuStateValue] = useRecoilState(myMenuState);
    const [user, loading] = useAuthState(auth);
    const [isAuth , setIsAuth] = useState("login");
    const [isAccessingFirestore, setIsAccessingFirestore] = useState(false);
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const drawerWidth = 280;
    const router = useRouter();
    const pathArray = router.asPath.split('/');

    //SET Theme Mode [Dark:Light]
    useEffect(() => {
        if(modeState.mode != theme.palette.mode){
            colorMode.toggleColorMode();
        }
    });
    
    //GET page Name
    useEffect(() => {
        // console.log(pathArray[2])
        if(pathArray.length === 3){
            setMenuStateValue({...menuStateValue, pageName: pathArray[2]});
        } else if(pathArray.length === 4){
            setMenuStateValue({...menuStateValue, pageName: pathArray[3]});
        } else{
            setMenuStateValue({...menuStateValue, pageName: ""});
        }
        if(pathArray[2] === 'chat'){
            setMenuStateValue({...menuStateValue, pageName: pathArray[2]});
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.asPath]);
    
    return (
        <Box sx={{ display: 'flex'}}>
            {/* SNACKBAR */}
            <ScapSnackbar />
            {loading ? (
                <ScapLoading />
            ):(
                <>
                    {!user || isAccessingFirestore ? (
                        <>
                            {isAuth == "login" && <Login setIsAuth={setIsAuth} setIsAccessingFirestore={setIsAccessingFirestore}/>}
                            {isAuth == "signup" && <Register setIsAuth={setIsAuth} setIsAccessingFirestore={setIsAccessingFirestore}/>}
                            {isAuth == "forgotpassword" && <ForgotPassword setIsAuth={setIsAuth} />}
                        </>
                    ):(
                        <>
                            <Topbar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} theme={theme}/>
                            <Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} handleDrawerToggle={handleDrawerToggle} theme={theme}/>
                            <Box
                                component="main"
                                sx={{ 
                                    position: "absolute",
                                    top: "0",
                                    bottom: "0",
                                    right: "0",
                                    // backgroundImage: "url(/assets/img/gradient-bg.svg)",
                                    // backgroundPosition: "center",
                                    // backgroundRepeat: "no-repeat",
                                    // backgroundSize: "cover",
                                    px: menuStateValue.pageName === "chat" ? 0 : 3, 
                                    pt: menuStateValue.pageName === "chat" ? 0 : 10, 
                                    pb: menuStateValue.pageName === "chat" ? 0 : 3, 
                                    width: { md: `calc(100% - ${drawerWidth}px)`, xs: "100%" }, 
                                    overflowY: menuStateValue.pageName === "chat" ? "unset" : "auto", 
                                    '& ::-webkit-scrollbar-track': {
                                        WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00) !important'
                                    },
                                }}
                            >
                                {children}
                            </Box>
                        </>
                    )}
                </>
            )}
        </Box>
    )
}
export default Layout;