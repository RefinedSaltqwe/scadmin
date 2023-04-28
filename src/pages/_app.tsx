import Layout from '@/components/Layout';
import createEmotionCache from '@/mui/cache/createEmotionCache';
import { ColorModeContext, useMode } from '@/mui/theme';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { GlobalStyles } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { getAnalytics, logEvent } from "firebase/analytics";
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RecoilEnv, RecoilRoot } from 'recoil';
import "../styles/globals.css";
import NextNProgress from 'nextjs-progressbar';

// * Analytics
if(typeof window !== 'undefined'){
  const analytics = getAnalytics();
  logEvent(analytics, 'notification_received');
}
// * Client-side cache, shared for the whole session of the user in the browser.
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const {theme, colorMode} = useMode();
  const router = useRouter();

  const title = () => {
    const currentPage = router.asPath.split('/');
    const last = currentPage[currentPage.length - 1];
    let parent = currentPage[2];
    let child = currentPage[3];
    let capitalize = last.charAt(0).toUpperCase() + last.slice(1);

    if(capitalize == ""){
      capitalize = "Overview"
    }

    if(currentPage.length >= 4){
      if(parent.at(-1) == "s"){
        parent = parent.substring(0, parent.length - 1);
      }
      capitalize= parent.charAt(0).toUpperCase() + parent.slice(1);
      // capitalize= parent.charAt(0).toUpperCase() + parent.slice(1) + " " + child.charAt(0).toUpperCase() + child.slice(1);
    }
    return "Dashboard: " + capitalize;
  }

  return (
    <RecoilRoot>
      <CacheProvider value={emotionCache}>
        <Head>
          {/* <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
          <title>{title()}</title>
        </Head>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme} >
            <GlobalStyles
              styles={{
                  '*::-webkit-scrollbar': {
                    width: '6px',
                    marginRight: '3px' 
                  },
                  '*::-webkit-scrollbar-track': {
                    WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                  },
                  '*::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.secondary.contrastText,
                    borderRadius: "50px",
                    backgroundClip: "padding-box",
                  },
                  '*#nprogress .bar': {
                    background: theme.palette.secondary.main
                  }
              }}
            />
            <CssBaseline />
            {/* <TopProgressBar /> */}
            <NextNProgress color="#6466f1" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </CacheProvider>
    </RecoilRoot>
  );
}

