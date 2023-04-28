import { myMenuState } from "@/atoms/layoutAtoms";
import useMediaQueryHook from "@/hooks/useMediaQueryHook";
import useRgbConverter from "@/hooks/useRgbConverter";
import { Bolt } from "@mui/icons-material";
import { Box, CircularProgress, Collapse, useTheme } from "@mui/material";
import { ref } from "firebase/storage";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import FlexBetween from "../FlexBetween";


interface PageContentLayoutProps {
  children: any;
  leftWidth: string;
  rightWidth: string;
  pageType: string;
  isCollapsable?: boolean;
  isNotCollapsed?: boolean;
}

// Assumes array of two children are passed
const PageContentLayout: React.FC<PageContentLayoutProps> = ({ children, leftWidth, rightWidth, pageType, isCollapsable, isNotCollapsed}) => {
    const theme = useTheme();
    const { isTablet, isMobile, isSmallMobile } = useMediaQueryHook();
    const menuStateValue = useRecoilValue(myMenuState);
    const [isShow, setIsShow] = useState(false)
    const { hex2rgb } = useRgbConverter();
    const authUnit = "vw";
    const sceneUnit = "%";
    let leftW="";
    let rightW="";
    let pageHeight="";
    const pageName = menuStateValue.pageName;
    let isPageName = false;

    if(pageType === "auth"){
        leftW=leftWidth+authUnit;
        rightW=rightWidth+authUnit;
        pageHeight = "100vh";
    }
    if(pageType === "scene"){
        pageHeight = "100%";
        leftW=leftWidth+sceneUnit;
        rightW=rightWidth+sceneUnit;
    }
    if(pageName === "chat"){
        isPageName = true;
    } else {
        isPageName = false;
    }
    useEffect(() => {
        setIsShow(true);
    }, [pageName])

    

    //GET THE WIDTH OF A COMPONENTS
//     const chatDrawer = useRef(null);
//     const [width, setWidth] = useState<any>(0);

//   useLayoutEffect(() => {
//     if(chatDrawer.current){
//         setWidth(chatDrawer.current);
//     }
    
//   }, [chatDrawer.current]);

//   console.log(width.offsetWidth)
    
  return (
    <Box sx={{height: pageHeight, width: isTablet ? "100%" : "100vw"}}>
        {isShow ? 
            (<FlexBetween sx={{overflow: isTablet ? "unset" : "hidden", justifyContent: "space-between", height: "100%", alignContent: "stretch", alignItems: "stretch"}}>
                {isCollapsable ? (
                    <>
                        {/* Left Content */}
                        <Box 
                            sx={{
                                // width: isMobile ? `${leftW} ` : "100vw",
                                width: isNotCollapsed 
                                    ? isMobile 
                                        ? `${leftW} ` : "100vw" 
                                    : isMobile ? "1px"  :"100vw", 
                                ml: isNotCollapsed ? "1px" : isMobile ? "2px" : isSmallMobile ? "-415px" : "3px", 
                                position: isMobile ? "" : "absolute",
                                zIndex: isMobile ? 300 : 301,
                                transition: "all 350ms cubic-bezier(0, 0, 0.16, 1.01)"
                            }}>
                            <Collapse orientation="horizontal" in={isTablet ? true : isNotCollapsed}
                                sx={{
                                    '& ': {
                                        minWidth: "275px",
                                        width: "auto !important",
                                        transitionDuration: "300ms",
                                    },
                                    '& > div':{
                                        width: "100%"
                                    },
                                    '& > div > div':{
                                        width: "100%"
                                    },
                                    height: "100vh",
                                    width: isTablet ? "100%" : "100vw",
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap', 
                                }}
                            >
                                <FlexBetween  sx={{ height: "100%", width: "100%", pt: "64px", }}>
                                    <FlexBetween 
                                        // ref={chatDrawer}
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                            borderTop: isPageName ? `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid` : "",
                                            borderRight: isPageName ? `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid` : "",
                                            padding: isPageName ? isTablet ? "0 5px 0 15px" : "0 5px 15px 15px" : isTablet ? "64px" : "30px",
                                            backgroundColor: pageType === "scene" ? theme.palette.primary.main : "none",
                                            alignItems: isPageName ? "flex-start" : "center"
                                        }}
                                    >
                                        {children && children[0 as keyof typeof children]} {/* Children of the fragment */}
                                    </FlexBetween>
                                </FlexBetween>
                            </Collapse>
                        </Box>
                        {/* Right Content */}
                        <FlexBetween
                            sx={{
                                overflow: "hidden", //NEW
                                flexGrow: 1,
                                zIndex: isMobile ? 301 : 300,
                                height: "100vh",
                                width: isMobile ? leftW : "100vw",
                            }}
                        >
                           <FlexBetween  sx={{ height: "100%", width: "100%", pt: "64px", }}>
                                    <FlexBetween 
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                            borderTop: isPageName ? `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid` : "",
                                            backgroundColor: pageType === "scene" ? theme.palette.primary.main : "none",
                                            alignItems: isPageName ? "flex-start" : "center"
                                        }}
                                    >
                                        {children && children[1 as keyof typeof children]} {/* Children of the fragment */}
                                    </FlexBetween>
                                </FlexBetween>
                        </FlexBetween>
                    </>
                ):(
                    <>
                        {/* Left Content */}
                        <FlexBetween
                            sx={{
                                border: isPageName ? `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid` : "",
                                marginTop: isPageName ? "64px" : "",
                                width: isMobile ? leftW : "100vw",
                                padding: isPageName ? isMobile ? "0 15px 0 15px" : "0 15px 15px 15px" : isTablet ? "64px" : "30px",
                                backgroundColor: pageType === "scene" ? theme.palette.primary.main : "none",
                                alignItems: "center"
                            }}
                        >
                            {children && children[0 as keyof typeof children]} {/* Children of the fragment */}
                        </FlexBetween>
                        {/* Right Content */}
                        <FlexBetween
                            sx={{
                                flexGrow: 1,
                                zIndex: 301,
                                width: isMobile ? rightW : "100vw",
                                padding: isMobile ? "64px" : "30px",
                                backgroundImage: pageType === "auth" ? "url(/assets/img/gradient-bg.svg)" : "none",
                                backgroundPosition: "center top",
                                backgroundRepeat: "no-repeat",
                                backgroundColor: pageType === "auth" ? theme.palette.primary.dark : theme.palette.primary.main,
                                alignItems: "center"
                            }}
                        >
                            {children && children[1 as keyof typeof children]} {/* Children of the fragment */}
                        </FlexBetween>
                    </>
                )}
            </FlexBetween>
            ):(
                <Box sx={{height: `100${pageType === "scene" ? sceneUnit : "vh"}`, width: `100${pageType === "scene" ? sceneUnit : authUnit}`, padding: `50${pageType === "scene" ? sceneUnit : "vh"} 0`}}>
                    <FlexBetween sx={{justifyContent: "center", width: "100%"}}>
                        <CircularProgress 
                            size={60}
                            thickness={2}
                            sx={{
                                color: theme.palette.secondary.main,
                            }} 
                        />
                        <Bolt sx={{position: "absolute", fontSize: 30}}/>
                    </FlexBetween>
                </Box>
            )
        }
    </Box>
  );
};

export default PageContentLayout;




