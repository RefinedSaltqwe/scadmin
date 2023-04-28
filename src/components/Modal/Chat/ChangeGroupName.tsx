import { chatThreadsState } from '@/atoms/chatAtoms';
import { modalChangeGroupNameState } from '@/atoms/modalChangeGroupName';
import { snackbarState } from '@/atoms/snackbarAtoms';
import { usersAtomState } from '@/atoms/usersAtom';
import AlertInfo from '@/components/ScapComponents/AlertInfo';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import ScapSecondaryButton from '@/components/ScapComponents/SecondaryButton';
import useChatThread from '@/hooks/useChatThread';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { EmojiObjectsOutlined } from '@mui/icons-material';
import { Alert, Backdrop, Box, Divider, Fade, Modal, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

type ChangeGroupNameProps = {
    
};

const ChangeGroupName:React.FC<ChangeGroupNameProps> = () => {

    const theme = useTheme();
    const { isMobile } = useMediaQueryHook();
    const colors = tokens(theme.palette.mode);
    const { hex2rgb } = useRgbConverter();
    const { storeMessage } = useChatThread();
    const [modalChangeGroupNameOpen, setModalChangeGroupNameOpen] = useRecoilState(modalChangeGroupNameState);
    const setSnackbarValue = useSetRecoilState(snackbarState);
    const chatThreadsValue = useRecoilValue(chatThreadsState)
    const usersAtomValue = useRecoilValue(usersAtomState)
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [newName, setNewName] = useState("");
    
    const handleCloseModal = () => {
        setButtonDisabled(true);
        setNewName("");
        setModalChangeGroupNameOpen(false);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value.length > 0){
            setNewName(event.target.value);
            setButtonDisabled(false);
        } else {
            setNewName(event.target.value);
            setButtonDisabled(true);
        }
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevents to reload the page when submit is triggered
        let text: string = "";
        if(!newName.replace(/\s/g, '').length){
            text = `${usersAtomValue.myInfo.firstName + " " +usersAtomValue.myInfo.lastName} cleared the chat name.`
        } else {
            text = `${usersAtomValue.myInfo.firstName + " " +usersAtomValue.myInfo.lastName} changed the chat name to ${newName.trimStart()}.`
        }
        storeMessage("changeChatName",chatThreadsValue.currentThreadId, text, !newName.replace(/\s/g, '').length ? "" : newName.trimStart(), "")
        .then((isSuccess) => {
            if(isSuccess){
                handleCloseModal();
                setSnackbarValue({ open: true, type: "success", text: `You changed the chat name to: "${newName}"` });
                setNewName("");
                setButtonDisabled(true);
            } else {
                setSnackbarValue({ open: true, type: "error", text: "There was an error changing the chat name. Try again. " });
            }
        })
        .catch((error) => {
            setSnackbarValue({ open: true, type: "error", text: "There was an error changing the chat name. Try again. " });
            console.log("Error occured: ", error);
        });
    }
    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalChangeGroupNameOpen}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalChangeGroupNameOpen}>
                    <Box sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: 620,
                        width: "95%",
                        bgcolor: theme.palette.mode === "dark" ? theme.palette.primary.main : "#fff",
                        boxShadow: 24,
                        p: isMobile ? 4 : "27px",
                        borderRadius: 4
                    }}>
                        <form onSubmit={onSubmit}>
                            <FlexBetween sx={{flexDirection: "row"}}>
                                <Typography variant="h5" sx={{fontWeight: 700, mb: 2, width: "100%"}}>Change Chat Name</Typography>
                                <AlertInfo text="Enter space to clear the chat name." />
                                <Divider/>
                                    <Box sx={{margin: "15px 0 20px 0", width: "100%"}}>
                                        <ScapPrimaryTextField type="text" label="Chat Name" name="chatName" resetValue={newName} onChange={onChange}  />
                                    </Box>
                                    <Box sx={{width: "100%", display: "flex", justifyContent: "end"}}>
                                        <ScapSecondaryButton type="button" theme={theme} color="primary" variant="contained" sx={{mt: 2, mr: 2}} onClick={handleCloseModal}>
                                            Cancel
                                        </ScapSecondaryButton>
                                        <ScapPrimaryButton type="submit" theme={theme} color="primary" variant="contained" sx={{mt: 2}} disabled={buttonDisabled}>
                                            Save
                                        </ScapPrimaryButton>
                                    </Box>
                            </FlexBetween>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}
export default ChangeGroupName;