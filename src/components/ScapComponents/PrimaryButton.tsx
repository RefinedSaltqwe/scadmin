import { styled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";


const ScapPrimaryButton = styled(MuiButton)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    textTransform: "capitalize",
    fontWeight: 600,
    padding: "11px 24px",
    borderRadius: "12px",
    fontSize: "0.9375rem",
    '&:hover':{
        backgroundColor: "#4338ca"
    }
}));

export default ScapPrimaryButton;