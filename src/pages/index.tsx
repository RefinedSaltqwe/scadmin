import ColorGuide from '@/components/ColorGuide';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <FlexBetween sx={{width: "100%", height:"90%", justifyContent: "center"}} >
      <FlexBetween mb="20px" sx={{width: "100%", height:"100%", alignItems: "flex-start", maxWidth: "1440px"}}>
          <Typography>Home Page</Typography>
          <ColorGuide />
      </FlexBetween>
    </FlexBetween>
  )
}
