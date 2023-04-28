import { LinearProgress } from "@mui/material";
import { styled } from "@mui/system";

const ScapFastLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar": {
    transition: "transform .1s linear",
  }
});

export default ScapFastLinearProgress;