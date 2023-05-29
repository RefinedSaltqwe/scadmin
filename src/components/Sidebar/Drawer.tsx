import { chatThreadsState } from '@/atoms/chatAtoms';
import { Item, myMenuState } from '@/atoms/layoutAtoms';
import { auth } from '@/firebase/clientApp';
import useNavigation from '@/hooks/useNavigation';
import { Archive, Bolt, Circle, Edit, FileCopy, KeyboardArrowDown, KeyboardArrowRight, MoreHoriz } from '@mui/icons-material';
import { Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue } from 'recoil';
import FlexBetween from '../ScapComponents/FlexBetween';

const options = [
    {
        text: "Edit",
        icon: <Edit/>
    },
    {
        text: "Duplicate",
        icon: <FileCopy/>
    },
    {
        text: "Archive",
        icon: <Archive/>
    },
    {
        text: "More",
        icon: <MoreHoriz/>
    },
];

const ITEM_HEIGHT = 48;

type DrawerComponentProps = {
    active: {
        parent: string;
        child: string;
    };
    setActive: (value: React.SetStateAction<{
        parent: string;
        child: string;
    }>) => void;
    theme: any;
    isMobile?: boolean;
    setMobileOpen: (value: React.SetStateAction<boolean>) => void;
};

const DrawerComponent:React.FC<DrawerComponentProps> = ({active, setActive, theme, isMobile, setMobileOpen}) => {
    
    const router = useRouter();
    const [user] = useAuthState(auth);
    const { navigatePage } = useNavigation();
    const [menuStateValue, setMenuStateValue] = useRecoilState(myMenuState);
    const chatThreadsValue = useRecoilValue(chatThreadsState);

    const [anchorElDrawer, setAnchorElDrawer] = useState<null | HTMLElement>(null);
    const openDrawerMenu = Boolean(anchorElDrawer);
    const handleClickDrawer = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElDrawer(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorElDrawer(null);
    };

    const handleMenuClick = (index: number) => {
        const newItems = [...menuStateValue.menuItems];
        const item = menuStateValue.menuItems[index];
        newItems[index] = { ...item, expanded: !item.expanded };
        setMenuStateValue((prev) => ({
            ...prev,
            menuItems: newItems as Item[]
        }));
    }
    //SETS the menu active status when page is refreshed
    useEffect(() => {
        const currentPage = router.asPath.split('/');
        const parentVal = currentPage[2];
        const childVal = currentPage[3] + parentVal
        const indexOfMenuItem = menuStateValue.menuItems.findIndex(obj => obj.text.toLocaleLowerCase() === parentVal);

        if(currentPage.length >= 4){

            setActive({...active, parent: parentVal, child: childVal });

            const handleMenuOpeness = async () => {
                
                const newItems = [...menuStateValue.menuItems];
                const item = menuStateValue.menuItems[indexOfMenuItem];
                newItems[indexOfMenuItem] = { ...item, expanded: true };

                setMenuStateValue((prev) => ({
                    ...prev,
                    menuItems: newItems as Item[]
                }));
            };
            
            if(menuStateValue.menuItems.length > 0){
            handleMenuOpeness();
            }
            
        } else {
            if(currentPage[1] == ""){
                setActive({...active, parent: "overview", child: ""});
            } else {
                setActive({...active, parent: parentVal , child: ""});
            }
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.asPath, menuStateValue.menuItems.length]);

    
    return (
        <>
            <Toolbar  sx={{ padding: "25px 10px 15px 10px", justifyContent: "space-between" }} >
                {/* LEFT */}
                <FlexBetween>
                    <IconButton
                        
                        sx={{
                            border: `1px solid #363d49`,
                            borderRadius: "7px",
                            padding: "4px",
                            '&:hover': {
                                backgroundColor: "transparent"
                            }
                        }}
                    >
                        <Bolt sx={{  color:theme.palette.secondary.main,  fontSize: "30px" }}/>
                    </IconButton>
                    <Stack sx={{ marginLeft: "15px" }} >
                        <Typography 
                            variant="h5" 
                            component="div" 
                            sx={{ 
                                color:theme.palette.primary.contrastText, 
                                fontWeight: 600,
                                flexGrow: 1, 
                            }}
                        >
                            Apalagio
                        </Typography>
                        <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                                color:theme.palette.secondary.contrastText,
                                fontWeight: 400,
                                flexGrow: 1, 
                            }}
                        >
                            Production
                        </Typography>
                    </Stack>
                </FlexBetween>
                {/* RIGHT */}
                <FlexBetween>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={openDrawerMenu ? 'long-menu' : undefined}
                        aria-expanded={openDrawerMenu ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClickDrawer}
                    >
                        <KeyboardArrowDown  sx={{ color:theme.palette.secondary.contrastText, fontSize: "20px" }}/>
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                        'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorElDrawer}
                        open={openDrawerMenu}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                                backgroundColor:theme.palette.primary.main,
                            },
                            sx: {
                                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03)) !important;"
                            }
                        }}
                    >
                        {options.map((option) => (
                            <MenuItem 
                                key={option.text} 
                                selected={option.text === 'Editx'} 
                                onClick={() => {
                                    handleClose()
                                    {isMobile && setMobileOpen(false)}
                                }}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: theme.palette.secondary.dark
                                    }
                                }}
                            >
                                {option.icon}
                                <Typography pl={1}>{option.text}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </FlexBetween>
            </Toolbar>
            <List
                sx={{
                    '& div.MuiListItemIcon-root > svg.MuiSvgIcon-root': {
                        fontSize: "23px",
                    },
                }}
            >
                {menuStateValue.menuItems.map(({text, icon, children, expanded}, index) => {

                    const childrenLength = children.length;
                    const lcText = text.toLowerCase();
                    let link = '';

                    if(lcText == "overview"){
                        link = "/";
                    } else if(lcText == "chat"){
                        if(chatThreadsValue.currentThreadId){
                            link = `/scenes/${lcText}/u=${user?.uid}=threadKey=${chatThreadsValue.currentThreadId}`;
                        } else {
                            link = `/scenes/${lcText}/u=${user?.uid}=threadKey=`;
                        }
                        
                    } else {
                        link = `/scenes/${lcText}`;
                    }

                    if(lcText !== "chat"){
                        link = link.replace(/\s+/g, '-').toLowerCase();
                    }
                    
                    if (!icon) {
                        return (
                            <Typography 
                                key={text} 
                                px={3}
                                py={2}
                                color={theme.palette.secondary.contrastText}
                                fontSize="12px"
                                fontWeight={700}
                            >
                                {text.toUpperCase()}
                            </Typography>
                        );
                    }

                    return(
                        <Box pl={2} pr={2} key={text}>
                            <ListItem  disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        {childrenLength > 0 && handleMenuClick(index);}
                                        {isMobile && childrenLength == 0 && setMobileOpen(false)}
                                        {childrenLength == 0 && setActive({...active, parent: lcText, child: ""});}
                                        {childrenLength == 0 && navigatePage(link);}
                                    }}
                                    // href={link}
                                    sx={{
                                        marginTop: "4px",
                                        padding: "4px 15px",
                                        borderRadius: 2,
                                        backgroundColor:
                                            (active.parent === lcText) || (active.parent === lcText.replace(/\s+/g, '-').toLowerCase())
                                            ? theme.palette.secondary.light 
                                            : "transparent",
                                        color:
                                            (active.parent === lcText) || (active.parent === lcText.replace(/\s+/g, '-').toLowerCase())
                                                ? theme.palette.primary.contrastText
                                                : theme.palette.secondary.contrastText,
                                        '&:hover': {
                                            backgroundColor: theme.palette.secondary.light
                                        }
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color:
                                                (active.parent === lcText) || (active.parent === lcText.replace(/\s+/g, '-').toLowerCase())
                                                    ? theme.palette.secondary.main
                                                    : theme.palette.secondary.contrastText,
                                        }}
                                    >
                                        {icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={text} 
                                        primaryTypographyProps={{fontSize: "13px"}}
                                        sx={{
                                            ml: "-18px",         
                                            '& span.MuiTypography-root': {
                                                fontWeight: "600 !important"
                                            },
                                        }}
                                    />
                                    {childrenLength > 0 && <>{expanded ? <KeyboardArrowDown sx={{fontSize: "19px", color: `${theme.palette.secondary.contrastText} !important`}} /> : <KeyboardArrowRight sx={{fontSize: "19px", color: `${theme.palette.secondary.contrastText} !important`}} />}</>}
                                </ListItemButton>
                            </ListItem>
                            {childrenLength > 0 && 
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <List key={text} component="div" disablePadding >
                                        {children.map((item: string, index) => {
                                            const menuOption = item.toLocaleLowerCase() + lcText;
                                            return (
                                                <ListItemButton 
                                                    onClick={() => {
                                                        {isMobile && setMobileOpen(false)}
                                                        setActive({...active, parent: lcText, child: item.toLocaleLowerCase() + lcText});
                                                        navigatePage(`/scenes/${lcText.replace(/\s+/g, '-').toLowerCase()}/${item.replace(/\s+/g, '-').toLocaleLowerCase()}`);
                                                    }}
                                                    key={index} 
                                                    sx={{ 
                                                        pl: 4,
                                                        marginTop: "4px",
                                                        padding: "4px 15px",
                                                        borderRadius: 2,
                                                        color:
                                                            (active.parent === lcText) || (active.parent === lcText.replace(/\s+/g, '-').toLowerCase())
                                                            ? theme.palette.primary.contrastText
                                                            : theme.palette.secondary.contrastText,
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.secondary.light
                                                        }
                                                    }}
                                                >
                                                    {(active.child ===  menuOption) || (active.child ===  menuOption.replace(/\s+/g, '-'))
                                                        ? <Circle sx={{marginRight: "-8px",fontSize: "8px", color: theme.palette.secondary.main}}/>
                                                        : "" }
                                                    <ListItemText 
                                                        primary={item}
                                                        primaryTypographyProps={{fontSize: '13px'}} 
                                                        sx={{
                                                            ml: "38px",
                                                            color:
                                                            (active.child ===  menuOption) || (active.child ===  menuOption.replace(/\s+/g, '-'))
                                                                    ? theme.palette.primary.contrastText
                                                                    : theme.palette.secondary.contrastText,
                                                            fontWeight: 100,
                                                        }}
                                                    />
                                                </ListItemButton>
                                            )
                                        })}
                                    </List>
                                </Collapse>
                            }
                        </Box>
                    )
                })}
            </List>
        </>
    )
}
export default memo(DrawerComponent);