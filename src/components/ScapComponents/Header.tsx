import useMediaQueryHook from "@/hooks/useMediaQueryHook";
import { Typography, Box, useTheme } from "@mui/material";

type HeaderProps = {
    title: string;
    subtitle?: string;
};

const Header:React.FC<HeaderProps> = ({title, subtitle}) => {
  const theme = useTheme();
  const { isMobile } = useMediaQueryHook();
  return (
    <Box sx={{mb: "5px"}} >
      <Typography
        variant={isMobile ? "h2" : "h3"}
        color={theme.palette.text.primary}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      {subtitle && 
        <Typography variant="h6" color={theme.palette.text.secondary}>
            {subtitle}
        </Typography>
      }
    </Box>
  );
};

export default Header;
