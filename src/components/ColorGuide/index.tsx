import { themeModeState } from '@/atoms/themeMode';
import { auth, firestore } from '@/firebase/clientApp';
import { tokens } from '@/mui/theme';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { query, collection, where, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';

type ColorGuideProps = {
    
};

const ColorGuide:React.FC<ColorGuideProps> = () => {

    const theme = useTheme();
    const [modeState, setModeState] = useRecoilState(themeModeState);
    
    const colors = tokens(theme.palette.mode);
    
    const toggleMode = () => {
      setModeState({mode: modeState.mode === "light" ? "dark" : "light"})
    }
    return (
        <>
          <Box height="auto">
            <Box p={3} mt={3} bgcolor={theme.palette.primary.dark}>
              <Typography color={theme.palette.primary.contrastText}>Sidebar</Typography>
              <Typography color={theme.palette.secondary.main}>Icon</Typography>
              <Typography color={theme.palette.secondary.contrastText}>Menu not Highlighted</Typography>
            </Box>

            <Box p={3} mt={3} sx={{backgroundColor: theme.palette.primary.main}}>
              <Typography color={theme.palette.text.primary}>RightSidebar</Typography>
              <Typography color={theme.palette.text.secondary}>Grey</Typography>
              <Button 
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.text.primary,
                  },
                }}
                variant="contained" 
                onClick={() => {
                  toggleMode();
                }}
              >
              {theme.palette.mode === "dark" ? (
                <Typography>Light</Typography>
              ) : (
                <Typography>Dark</Typography>
              )}
            </Button>
            
            </Box>
            <Box sx={{backgroundColor: colors.indigoAccent[700], width: "100%"}}>
              <Box sx={{backgroundColor: colors.indigoAccent[500], width: "20vw"}}>asdasd</Box>
            </Box>
            <Typography paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
              enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
              imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
              Convallis convallis tellus id interdum velit laoreet id donec ultrices.
              Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
              adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
              nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
              leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
              feugiat vivamus at augue. At augue eget arcu dictum varius duis at
              consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
              sapien faucibus et molestie ac.
            </Typography>
            <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
              eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
              neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
              tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
              sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
              tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
              gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
              et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
              tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
              eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
              posuere sollicitudin aliquam ultrices sagittis orci a.
            </Typography>
          </Box>
        </>
      )
}
export default ColorGuide;