import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { FiberManualRecord } from '@mui/icons-material';
import { Box, Tab, Tabs } from '@mui/material';
import React, { memo, useState } from 'react';
import NavBody from './ChatNavigationComponents/Body';

type ChatNavigationProps = {
    hex2rgb: (hex: any, opacity: string) => {rgb: string};
    theme: any;
    colors: any;
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
  
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
        {value === index && (
            <Box sx={{ p: 0 }}>
                {children}
            </Box>
        )}
        </div>
    );
}
  
function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ChatNavigation:React.FC<ChatNavigationProps> = ({hex2rgb, theme, colors}) => {
    
    const { isTablet } = useMediaQueryHook();
    const [style, setStyle] = useState({
        overflow: "hidden",
        paddingRight: "6px"
    });
    const [value, setValue] = React.useState(0);
    const [tabVal, setTabVal] = useState("staff");
    const [tabThreadExist, setTabThreadExist] = useState("");
    const [tabUnreadMessage, setTabUnreadMessage] = useState({
        staff: false,
        customerSupport: false
    });

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    
    const toggleChatScrollBar = (value: string) => {
        let pr = '0px';
        
        if(value == "hidden"){
            pr="6px"
        }
        setStyle({
            overflow: value,
            paddingRight: pr
        })
    }
    
    return (
        <Box 
            width="100%" 
            onMouseEnter={() => {toggleChatScrollBar("scroll")}}
            onMouseLeave={() => {toggleChatScrollBar("hidden")}}
            sx={{
                height: "100%", 
                display: "flex",
                flexDirection: "column",
                position: "relative", 
                overflowY: isTablet ? style.overflow : "auto",
                paddingRight: isTablet ? style.paddingRight : "auto",
                overflowX: "hidden",
            }}
        >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    textColor="secondary"
                    indicatorColor="secondary"
                    value={value}
                    onChange={handleChange} 
                    aria-label="basic tabs example"
                    sx={{
                        "& .MuiTabs-scrollButtons.Mui-disabled": {
                            opacity: 0.3
                        }
                    }}
                >
                    {/* Indigo for new messages, GRey for selected Thread */}
                    <Tab 
                        icon={
                            <FiberManualRecord 
                                sx={{
                                    stroke: tabThreadExist === "staff" ? theme.palette.mode === "dark" ? theme.palette.secondary.light : hex2rgb(theme.palette.primary.light, "100").rgb : "transparent", 
                                    strokeWidth: "5px", 
                                    width: "11px", 
                                    height: "11px", 
                                    color: tabUnreadMessage.staff ? theme.palette.secondary.main : "transparent", 
                                    display: tabThreadExist === "staff" ? "block" : tabUnreadMessage.staff ? "block" : "none"
                                }} 
                            />
                        } 
                        iconPosition="start" 
                        label="Staff" 
                        {...a11yProps(0)} 
                        onClick={()=>{setTabVal("staff")}}
                    />
                    <Tab 
                        icon={
                            <FiberManualRecord 
                                sx={{
                                    stroke: tabThreadExist === "customer" ? theme.palette.mode === "dark" ? theme.palette.secondary.light : hex2rgb(theme.palette.primary.light, "100").rgb : "transparent", 
                                    strokeWidth: "5px", 
                                    width: "11px", 
                                    height: "11px", 
                                    color: tabUnreadMessage.customerSupport ? theme.palette.secondary.main : "transparent", 
                                    display: tabThreadExist === "customer" ? "block" : tabUnreadMessage.customerSupport ? "block" : "none"
                                }} 
                            />
                        } 
                        iconPosition="start" 
                        label="Customer Support" 
                        {...a11yProps(1)} 
                        onClick={()=>{setTabVal("customer")}} 
                    />
                    <Tab 
                        icon={
                            <FiberManualRecord 
                                sx={{
                                    stroke: tabThreadExist === "archived" ? theme.palette.mode === "dark" ? theme.palette.secondary.light : hex2rgb(theme.palette.primary.light, "100").rgb : "transparent", 
                                    strokeWidth: "5px", 
                                    width: "11px", 
                                    height: "11px", 
                                    color: false ? theme.palette.secondary.main : "transparent", 
                                    display: tabThreadExist === "archived" ? "block" : true ? "block" : "none"
                                }} 
                            />
                        } 
                        iconPosition="start" 
                        label="Archived" 
                        {...a11yProps(2)} 
                        onClick={()=>{setTabVal("archived")}} 
                    />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0} >
                <NavBody hex2rgb={hex2rgb} theme={theme} colors={colors} tabVal={tabVal} setTabThreadExist={setTabThreadExist} setTabUnreadMessage={setTabUnreadMessage} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <NavBody hex2rgb={hex2rgb} theme={theme} colors={colors} tabVal={tabVal} setTabThreadExist={setTabThreadExist} setTabUnreadMessage={setTabUnreadMessage} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                Archived Threads
            </TabPanel>
        </Box>
    )
}
export default memo(ChatNavigation);