import { styled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";


const ScapTextButton = styled(MuiButton)(({ theme }) => ({
    color: theme.palette.text.primary,
    textTransform: "capitalize",
    fontWeight: 600,
    padding: "11px 24px",
    borderRadius: "12px",
    fontSize: "0.9375rem",
}));

export default ScapTextButton;