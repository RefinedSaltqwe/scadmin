import { useMediaQuery } from '@mui/material';

const useMediaQueryHook = () => {

    const isDesktop = useMediaQuery("(min-width:1536px)");
    const isLaptop = useMediaQuery("(min-width:1200px)");
    const isTablet = useMediaQuery("(min-width:900px)");
    const isMobile = useMediaQuery("(min-width:600px)");
    const isSmallMobile = useMediaQuery("(min-width:0px)");

    return { isSmallMobile, isTablet, isMobile, isLaptop, isDesktop }
}
export default useMediaQueryHook;