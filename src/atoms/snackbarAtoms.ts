import { AlertColor } from '@mui/material';
import { atom } from 'recoil'

export interface SnackbarState {
    open: boolean;
    type: AlertColor | undefined | "default";
    text: string;
}

export const defaultSnackbar = {
    open: false,
    type: "success" as AlertColor,
    text: ""
};

export const snackbarState = atom<SnackbarState>({
  key: 'snackbarState',
  default: defaultSnackbar,
})