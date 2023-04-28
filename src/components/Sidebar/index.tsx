import { Item, myMenuState } from '@/atoms/layoutAtoms';
import { CurrencyBitcoinOutlined, FolderSharedOutlined, Groups3Outlined, InboxOutlined, InsertChartOutlinedSharp, PeopleOutlined, PercentOutlined, QuestionAnswerOutlined, RoofingOutlined, SellOutlined, SettingsOutlined, ShoppingBasketOutlined, StoreOutlined, SupervisorAccountOutlined } from '@mui/icons-material';
import { Box, Drawer } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import DrawerComponent from './Drawer';

const sideBarMenuItems = [
    {
        text: "Overview",
        icon: <RoofingOutlined />,
        expanded: false,
        children: []
    },
    {
        text: "Orders",
        icon: <ShoppingBasketOutlined />,
        expanded: false,
        children: []
    },
    {
        text: "Products",
        icon: <SellOutlined />,
        expanded: false,
        children: ["List", "Collections", "Inventory"]
    },
    {
        text: "Customers",
        icon: <PeopleOutlined />,
        expanded: false,
        children: []
        
    },
    {
        text: "Content",
        icon: <FolderSharedOutlined />,
        expanded: false,
        children: ["Images", "Files"]
    },
    {
        text: "Analytics",
        icon: <InsertChartOutlinedSharp />,
        expanded: false,
        children: ["Store","Reports", "Live View"]
    },
    {
        text: "Discounts",
        icon: <PercentOutlined />,
        expanded: false,
        children: []
    },
    {
        text: "Crypto",
        icon: <CurrencyBitcoinOutlined />,
        expanded: false,
        children: []
    },
    {
        text: "Sales Channels",
        icon: null,
        expanded: false,
        children: []
    },
    {
        text: "Online Store",
        icon: <StoreOutlined />,
        expanded: false,
        children: ["Blog Posts", "Pages", "Preferences"]
    },
    {
        text: "Chat",
        icon: <QuestionAnswerOutlined />,
        expanded: false,
        children: []
    },
    {
        text: "Admin",
        icon: null,
        expanded: false,
        children: []
    },
    {
        text: "Manage Staff",
        icon: <Groups3Outlined />,
        expanded: false,
        children: []
    },
    {
        text: "Settings",
        icon: <SettingsOutlined />,
        expanded: false,
        children: []
    },
  ];

type SidebarProps = {
    theme: any;
    drawerWidth: number;
    mobileOpen: boolean;
    handleDrawerToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
    window?: () => Window;
    setMobileOpen: (value: React.SetStateAction<boolean>) => void;
};

const Sidebar:React.FC<SidebarProps> = ({window, drawerWidth, mobileOpen, handleDrawerToggle, setMobileOpen, theme }) => {

    const container = window !== undefined ? () => window().document.body : undefined;
    const setMenuStateValue = useSetRecoilState(myMenuState);
    const [style, setStyle] = useState({
        overflow: "hidden",
        paddingRight: "6px"
    })

    const [active, setActive] = useState({
        parent: '',
        child: ''
    });

    const toggleScrollBar = (value: string) => {
        let pr = '0px';

        if(value == "hidden"){
            pr="6px"
        }
        setStyle({
            overflow: value,
            paddingRight: pr
        })
    }
    
    // SET recoil state
    useEffect(() => {   
        setMenuStateValue((prev) => ({
            ...prev,
            menuItems: sideBarMenuItems as Item[]
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sideBarMenuItems])
    
    return (
          <Box
            id="sidebar"
            component="nav"
            sx={{ 
                width: { md: drawerWidth }, 
                flexShrink: { sm: 0 }, 
                backgroundColor: theme.palette.primary.dark, 
                zIndex:501,
                height: "100%"
            }}
            onMouseEnter={() => {toggleScrollBar("scroll")}}
            onMouseLeave={() => {toggleScrollBar("hidden")}}
            aria-label="drawer"
          >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
                container={container}
                variant="temporary"
                transitionDuration={{ enter: 500, exit: 500 }}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                PaperProps={{
                    sx: {
                        backgroundColor: `${theme.palette.primary.dark} !important`,
                        backgroundImage: "none"
                    }
                }}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth, 
                        borderRight: "none",
                        overflowY: "scroll",
                    },
                }}
            >
              <DrawerComponent 
                active={active}
                setActive={setActive}
                theme={theme}
                isMobile={true}
                setMobileOpen={setMobileOpen}
              />
            </Drawer>
            <Drawer
                variant="permanent"
                PaperProps={{
                    sx: {
                    backgroundColor: theme.palette.primary.dark,
                    }
                }}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth, 
                        borderRight: "none",
                        overflowY: style.overflow,
                        paddingRight: style.paddingRight,
                    },
                }}
                open
            >
              <DrawerComponent 
                active={active}
                setActive={setActive}
                theme={theme}
                setMobileOpen={setMobileOpen}
              />
            </Drawer>
        </Box>
    );
}
export default Sidebar;