import { styled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";


const ScapSecondaryButton = styled(MuiButton)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.text.primary,
    textTransform: "capitalize",
    fontWeight: 600,
    padding: "11px 24px",
    borderRadius: "12px",
    fontSize: "0.9375rem",
    '&:hover':{
        backgroundColor: theme.palette.primary.light
    }
}));

export default ScapSecondaryButton;