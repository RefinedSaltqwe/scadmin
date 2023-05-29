import { SnackbarState, snackbarState } from '@/atoms/snackbarAtoms';
import { Button, useTheme } from '@mui/material';
import { SnackbarProvider, useSnackbar, VariantType } from 'notistack';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

function MyApp(snackbarValue: SnackbarState) {

    const theme = useTheme();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    const action = (snackbarId: any) => (
        <>
          {/* <Button sx={{color: theme.palette.text.primary}} onClick={() => { alert(`I belong to snackbar with id ${snackbarId}`); }}>
            Undo
          </Button> */}
          <Button sx={{color: theme.palette.primary.contrastText}} onClick={() => { closeSnackbar(snackbarId) }}>
            Dismiss
          </Button>
        </>
    );
    
    const handleClickVariant = (variant: VariantType) => () => {
      enqueueSnackbar(snackbarValue.text, { variant, action });
    };
  
    return (
      <React.Fragment>
        <Button onClick={handleClickVariant(snackbarValue.type!)} id="showSnackBar" sx={{display: "none"}}></Button>
      </React.Fragment>
    );
}

const ScapSnackbar:React.FC = () => {

    const [snackbarValue, setSnackbarValue] = useRecoilState(snackbarState);

    useEffect(()=>{
        if(snackbarValue.open){
            document.getElementById("showSnackBar")!.click();

            setSnackbarValue({ open: false, type: "success", text: "" });
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snackbarValue.open])
    
    return (
        <SnackbarProvider 
            preventDuplicate
            maxSnack={3} 
            autoHideDuration={4000} 
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
        >
            <MyApp open={snackbarValue.open} type={snackbarValue.type} text={snackbarValue.text} />
        </SnackbarProvider>
    )
}
export default ScapSnackbar;