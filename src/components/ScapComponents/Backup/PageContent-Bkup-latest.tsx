import { myMenuState } from "@/atoms/layoutAtoms";
import useMediaQueryHook from "@/hooks/useMediaQueryHook";
import useRgbConverter from "@/hooks/useRgbConverter";
import { Bolt } from "@mui/icons-material";
import { Box, CircularProgress, Collapse, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import FlexBetween from "../FlexBetween";


interface PageContentLayoutProps {
  children: any;
  leftWidth: string;
  rightWidth?: string;
  pageType: string;
  isCollapsable?: boolean;
  isNotCollapsed?: boolean;
}

// Assumes array of two children are passed
const PageContentLayout: React.FC<PageContentLayoutProps> = ({ children, leftWidth, rightWidth, pageType, isCollapsable, isNotCollapsed}) => {
    const theme = useTheme();
    const { isTablet, isMobile, isSmallMobile } = useMediaQueryHook();
    const isSmallMediumMobile = useMediaQuery("(min-width:450px)");
    const menuStateValue = useRecoilValue(myMenuState);
    const [isShow, setIsShow] = useState(false)
    const { hex2rgb } = useRgbConverter();
    let pageHeight="";
    const pageName = menuStateValue.pageName;

    if(pageType === "auth"){
        pageHeight = "100vh";
    }
    if(pageType === "scene"){
        pageHeight = "100%";
    }

    useEffect(() => {
        setIsShow(true);
    }, [pageName])
    
  return (
    <Box sx={{height: pageHeight, width: isTablet ? "100%" : "100vw", overflow: "hidden"}}>
        {isShow ? 
            (<FlexBetween sx={{overflow: isTablet ? "unset" : "hidden", justifyContent: "space-between", height: "100%", alignContent: "stretch", alignItems: "stretch"}}>
                {isCollapsable ? (
                    <>
                        {/* Left Content */}
                        <Box 
                            sx={{
                                width: isNotCollapsed 
                                    ? isMobile 
                                        ? leftWidth
                                        : "100vw" 
                                    : isMobile 
                                        ? "0px"  
                                        :"100vw", 
                                ml: isNotCollapsed 
                                    ? "0px" 
                                    : isMobile 
                                        ? "0px" 
                                        : isSmallMediumMobile 
                                            ? "-600px" 
                                            : isSmallMobile 
                                                ? "-450px" 
                                                : "0px", 
                                position: isMobile ? "" : "absolute",
                                zIndex: isMobile ? 300 : 301,
                                transition: "all 400ms cubic-bezier(0, 0, 0.16, 1.01)"
                            }}>
                            <Collapse orientation="horizontal" in={isTablet ? true : isNotCollapsed}
                                sx={{
                                    height: "100vh",
                                    width: isTablet ? "100%" : "100vw",
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap', 
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
                                }}
                            >
                                {/* THERE IS A PROBLEM WITH ACTUAL MOBILES padding top doesnt work */}
                                {/* <FlexBetween  sx={{ height: "100%", width: "100%" }}> */}
                                <FlexBetween  sx={{ height: "100%", width: "100%", pt: "64px", }}>
                                    {/* <Box sx={{width: "100%", height: "64px"}}></Box> */}
                                    <FlexBetween 
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                            borderTop: `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`,
                                            borderRight: `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`,
                                            padding: isTablet ? "0 5px 0 15px" : "0 5px 15px 15px",
                                            backgroundColor: pageType === "scene" ? theme.palette.primary.main : "none",
                                            alignItems: "flex-start"
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
                                width: isMobile ? leftWidth : "100vw",
                            }}
                        >
                           {/* <FlexBetween  sx={{ height: "100%", width: "100%" }}> */}
                            <FlexBetween  sx={{ height: "100%", width: "100%", pt: "64px", }}>
                                {/* <FlexBetween sx={{width: "100%", height: "64px"}}></FlexBetween> */}
                                <FlexBetween 
                                    sx={{
                                        height: "100%",
                                        width: "100%",
                                        borderTop: `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`,
                                        backgroundColor: pageType === "scene" ? theme.palette.primary.main : "none",
                                        alignItems: "flex-start"
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
                                width: isMobile ? leftWidth : "100vw",
                                padding: isTablet ? "64px" : "30px",
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
                                width: isMobile ? rightWidth : "100vw",
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
                <Box sx={{height: `100${pageType === "scene" ? "%" : "vh"}`, width: `100${pageType === "scene" ? "%" : "vw"}`, padding: `${pageType === "auth" && "50vh 0"}`, display: "flex", alignContent: "center"}}>
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
    </Box>
  );
};

export default PageContentLayout;




