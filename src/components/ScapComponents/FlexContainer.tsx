import { Box } from "@mui/material";
import { styled } from "@mui/system";

const FlexContainer = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main, 
    width:"100%", 
    marginBottom: "24px", 
    padding: "24px",
    borderRadius: "12px 12px 12px 12px", 
    boxShadow: "rgba(0, 0, 0, 0.04) 0px 4px 10px 0px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px" 
    // boxShadow: "rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px" 
}));elevation: 3

export default FlexContainer;
