import { themeModeState } from '@/atoms/themeMode';
import { auth } from '@/firebase/clientApp';
import useNavigation from '@/hooks/useNavigation';
import useResetAllRecoilStates from '@/hooks/useResetAllRecoilStates';
import useRgbConverter from '@/hooks/useRgbConverter';
import { AccountBoxOutlined, DarkModeOutlined, LightModeOutlined, LogoutOutlined, ManageAccountsOutlined, NotificationsActiveOutlined, PeopleOutlineOutlined, SearchOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, Badge, Box, Divider, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import Image from 'next/image';
import React from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';

type TopbarPropsProps = {
    drawerWidth: number;
    handleDrawerToggle: any;
    theme: any;
};

const TopbarProps:React.FC<TopbarPropsProps> = ({drawerWidth, handleDrawerToggle, theme}) => {

  const [user] = useAuthState(auth);
  const [signOut, error] = useSignOut(auth);
  const { navigatePage } = useNavigation();
  const { hex2rgb } = useRgbConverter();
  const [modeState, setModeState] = useRecoilState(themeModeState);
  const {
    resetChatThreadsState, 
    resetMyMenuState, 
    resetLinksAtomState, 
    resetLoadingNavigateMessageState, 
    resetModalLinksOpen, 
    resetUsersAtomState } = useResetAllRecoilStates();
  const settings = [
    {
      text: "Profile",
      icon: <AccountBoxOutlined/>
    },
    {
      text: "Manage Account",
      icon: <ManageAccountsOutlined/>
    },
    {
      text: "Logout",
      icon: <LogoutOutlined/>
    }
  ];

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const logout = async () => {
        
      const success = await signOut();
      if (success) {
        // console.log('You are sign out: ', success);
        navigatePage("/");
        resetChatThreadsState(); 
        resetMyMenuState();
        resetLinksAtomState();
        resetLoadingNavigateMessageState();
        resetModalLinksOpen();
        resetUsersAtomState();
      }
      if(error){
          console.log('Error sign out: ', error);
          return;
      }
      
  };

  const toggleMode = () => {
    setModeState({mode: modeState.mode === "light" ? "dark" : "light"})
  }

  return (
      <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            backgroundColor: hex2rgb(theme.palette.background.default, "80").rgb,
            backgroundImage: "none !important",
            boxShadow: "none",
            backdropFilter: "blur(6px)",
            zIndex:500
          }}
        >
        <Toolbar>
          <Box sx={{flexGrow: 1}}>
            <IconButton
              size="medium"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' }, color: theme.palette.text.secondary }}
            >
              <MenuIcon sx={{fontSize: 28,}}/>
            </IconButton>
            <Tooltip title="Search">
              <IconButton
                size="medium"
                aria-label="modal search"
                edge="start"
              >
                <SearchOutlined sx={{fontSize: 28, color: theme.palette.text.secondary}}/>
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            
          <Tooltip title={theme.palette.mode === "dark" ? "Dark Mode": "Light Mode"}>
              <IconButton
                size="medium"
                aria-label="show 17 new notifications"
                color="inherit"
                sx={{mr: 1}}
                onClick={() => {
                  toggleMode();
                }}
              >
                {theme.palette.mode === "dark" ? (
                <DarkModeOutlined sx={{fontSize: 28, color: theme.palette.text.secondary}}/>
              ) : (
                <LightModeOutlined sx={{fontSize: 28, color: theme.palette.text.secondary}}/>
              )}
                
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton
                size="medium"
                aria-label="show 17 new notifications"
                color="inherit"
                sx={{mr: 1}}
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsActiveOutlined sx={{fontSize: 28, color: theme.palette.text.secondary}}/>
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Contacts">
              <IconButton size="medium" aria-label="show 4 new mails" color="inherit" sx={{mr: 3}}>
                <Badge badgeContent={4} color="error">
                  <PeopleOutlineOutlined sx={{fontSize: 28, color: theme.palette.text.secondary}}/>
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Open Settings">
              <IconButton size="medium" onClick={handleOpenUserMenu} sx={{p: "2px", border: "2px grey solid", borderRadius: 50 }}>
                <Avatar alt="Remy Sharp" sx={{height:"35px", width:"35px"}}>
                  <Image src="/assets/img/avatar-alcides-antonio.png" alt="User Profile" width={35} height={35} loading='lazy'/>
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                style: {
                    maxWidth: '50ch',
                    backgroundColor:theme.palette.primary.main,
                },
                sx: {
                    padding: "10px 10px 2px 10px",
                    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03)) !important;"
                }
              }}
            >
              <Stack sx={{padding: "5px 15px 20px 15px"}}>
                <Typography variant="h5" sx={{color: theme.palette.text.main}}>{user?.displayName}</Typography>
                <Typography variant="h6" sx={{color: theme.palette.text.secondary}}>{user?.email}</Typography>
              </Stack>
              <Divider />
              {settings.map((setting) => (
                <Box key={setting.text}>
                  {setting.text === "Logout" && <Divider/> }
                  <MenuItem 
                      key={setting.text} 
                      selected={setting.text === 'Editx'} 
                      onClick={() => {
                        {setting.text === "Logout" && logout() }
                      }}
                      sx={{
                          padding:"10px 15px 10px 15px",
                          margin: setting.text === "Logout" ? "10px 0 0 0" : "10px 0 10px 0",
                          '&:hover': {
                              backgroundColor: theme.palette.secondary.dark,
                              borderRadius: 2
                          }
                      }}
                  >
                      {setting.icon}
                      <Typography pl={1}>{setting.text}</Typography>
                  </MenuItem>
                </Box>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    )
}
export default TopbarProps;