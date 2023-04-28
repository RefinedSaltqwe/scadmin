import { addPeopleAtomState, AddPeopleValue } from '@/atoms/addPeopleAtom';
import { addPeopleModalOpenState } from '@/atoms/addPeopleModalOpen';
import { chatThreadsState, ThreadMessage, ThreadRef } from '@/atoms/chatAtoms';
import { usersAtomState } from '@/atoms/usersAtom';
import AlertInfo from '@/components/ScapComponents/AlertInfo';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import { auth, firestore } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { EmojiObjectsOutlined } from '@mui/icons-material';
import { Alert, Backdrop, Box, Chip, CircularProgress, Divider, Fade, Modal, Stack, Typography, useTheme } from '@mui/material';
import { addDoc, collection, doc, getDoc, runTransaction, serverTimestamp, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

type AddPeopleProps = {
    
};

const AddPeople:React.FC<AddPeopleProps> = () => {

    const [user] = useAuthState(auth);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { isMobile } = useMediaQueryHook();
    const { hex2rgb } = useRgbConverter();
    const [open, setOpen] = useRecoilState(addPeopleModalOpenState);
    const usersAtomValue = useRecoilValue(usersAtomState)
    const [chatThreadsValue, setChatThreadsValue] = useRecoilState(chatThreadsState)
    const [addPeopleAtomValue, setAddPeopleAtomValue] = useRecoilState(addPeopleAtomState);
    const resetList = useResetRecoilState(addPeopleAtomState);
    const [addButtonIsDisabled, setAddButtonIsDisbaled] = useState(true);
    const [error, setError] = useState("");
    const addPeopleClose = () => setOpen(false);

    //Triggers when user types on textfield
    //The main purpose is to disable add button when field is empty or null
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddPeopleAtomValue(prev => ({
            ...prev,
            textFieldValue: event.target.value
        }))
        if(event.target.value === "" || event.target.value !== addPeopleAtomValue.currentValue) {
            setAddButtonIsDisbaled(true);
        }
        if(event.target.value === addPeopleAtomValue.currentValue){
            setAddButtonIsDisbaled(false);
        }
        setError("");
    };
    // Triggers when user clicks on add button
    const onAdormentButtonClick = () => {
        // console.log("xd: ", addPeopleAtomValue.values)
        const newValues = {
            uid: addPeopleAtomValue.currentUID,
            email: addPeopleAtomValue.currentValue,
        }
        setAddPeopleAtomValue(prev => ({
            ...prev,
            values: [...prev.values, newValues] 
        }) as AddPeopleValue);

        setAddPeopleAtomValue(prev => ({
            ...prev,
            currentValue: null,
            textFieldValue: ""
        }) as AddPeopleValue);
        setError("");
        setAddButtonIsDisbaled(true);
    }
    //Triggers when user presses ENTER on keyboard to submit
    const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
        if (event.key === 'Enter' && !addButtonIsDisabled) {
            onAdormentButtonClick();
        }
    };
    //LISTENS if current value changes
    // IF currentValue is not null then set enable add button
    useEffect(() => {
        if(addPeopleAtomValue.currentValue != null && addPeopleAtomValue.currentValue === addPeopleAtomValue.textFieldValue ) {
            setAddButtonIsDisbaled(false);
        } else {
            setAddButtonIsDisbaled(true);
        }
    }, [addPeopleAtomValue.currentValue, addPeopleAtomValue.textFieldValue]) // eslint-disable-next-line react-hooks/exhaustive-deps
    //Handles Delete
    const handleDelete = (val: string) => {
        setAddPeopleAtomValue(prev => ({
            ...prev,
            values: [...prev.values.filter((item) => item.email != val)]
        }) as AddPeopleValue);
        setError("");
    };

    //CREATE GROUP CHAT
    const handleAddPeople = async () => {
        const messageId: string = user?.uid! + chatThreadsValue.threadMessages.length + "addPeople";
        let newConnections = addPeopleAtomValue.values.map(item => item.uid);
        chatThreadsValue.currentSelectedThread?.connections.map(item => newConnections.push(item))

        const newUserThread = {
            connections: newConnections as [],
        }
        
        try{
            //GET current thread if exist
            const threadRef = doc(firestore, "threads", chatThreadsValue.currentThreadId);
            let text: string = "";
            const getFirstPerson = usersAtomValue.users.filter(user => user.uid === addPeopleAtomValue.values[0].uid)
            if(addPeopleAtomValue.values.length > 1){
                text =  `${usersAtomValue.myInfo.firstName + " " + usersAtomValue.myInfo.lastName} added ${getFirstPerson[0].firstName + " " + getFirstPerson[0].lastName} and ${addPeopleAtomValue.values.length - 1} ${addPeopleAtomValue.values.length === 2 ? "other" : "others"}.`;
            } else {
                text =  `${usersAtomValue.myInfo.firstName + " " + usersAtomValue.myInfo.lastName} added ${getFirstPerson[0].firstName + " " + getFirstPerson[0].lastName} to the group.`;
            }

            await runTransaction(firestore, async (transaction) => {
                //READ
                const threadDoc = await transaction.get(threadRef);
                if(!threadDoc.exists()){
                    throw new Error(`Sorry, thread doesn't exist.`);
                }
                const message: ThreadMessage = {
                    threadId: threadDoc.id,
                    uid: "chatSystem=" + user?.uid,
                    text: text,
                    photoURL: {
                        url: "",
                        isLoading: true
                    },
                    file: {
                        filename: "",
                        data: "",
                        isLoading: true
                    },
                    createdAt: serverTimestamp() as Timestamp
                };
    
                setChatThreadsValue((prev) => ({
                    ...prev,
                    threadMessages: [...prev.threadMessages, {
                        ...message,
                        id: messageId
                    }],
                }));
                //WRITE
                //CREATE system message
                transaction.set(doc(firestore, `threads/${threadDoc.id}/messages`, messageId), message);
                //UPDATE Connections on Thread
                transaction.update(doc(firestore, `threads/${threadDoc.id}`), {
                    connections: newConnections as []
                });
                //UPDATE user threadSnippets connections
                newConnections.forEach(userId => {
                    transaction.set(doc(firestore, `users/${userId}/threadSnippits`, threadDoc.id), newUserThread);
                })

                let threadSeen: string[] = [];
                threadSeen.push(user!.uid);

                const threadUpdater = {
                    changeType:"modified",
                    threadSeen: threadSeen as [],
                    lastMessage: text,
                    lastMessageId: messageId,
                    lastMessageUID: "chatSystem=" + user?.uid,
                    latestMessageCreatedAt: serverTimestamp(),
                }
                // UPDATE latest updates
                transaction.update(doc(firestore, `threads`, threadDoc.id), threadUpdater);
                
            });
            setOpen(false);
            resetList();
        } catch (err: any) {
            setError(err);
            console.log("Adding new thread error: ", error);
        }
    }

    const linksSubmit = () => {
        handleAddPeople();
    }
    
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={() => {addPeopleClose(), resetList()}}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={{
                        position: 'absolute' as 'absolute',
                        top: '35%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: 620,
                        width: "95%",
                        bgcolor: theme.palette.mode === "dark" ? theme.palette.primary.main : "#fff",
                        boxShadow: 24,
                        p: isMobile ? 4 : "27px",
                        borderRadius: 4
                    }}>
                        <FlexBetween sx={{flexDirection: "row"}}>
                            <Typography variant="h5" sx={{fontWeight: 700, mb: 2, width: "100%"}}>Add People</Typography>
                            <AlertInfo text="You can enter multiple emails." />
                            <Divider/>
                            <Stack direction="row" spacing={1} sx={{mb: 1, width: "100%", flexWrap: "wrap"}}>
                                {addPeopleAtomValue.values.map((items, index)=> (
                                    <Chip key={index} label={items.email} onDelete={() => {handleDelete(items.email)}} sx={{mb: "8px !important"}} />
                                ))}
                            </Stack>
                            <ScapPrimaryTextField 
                                type="email" 
                                label="Email" 
                                name="addPeople" 
                                onChange={onChange} 
                                onAdormentButtonClick={onAdormentButtonClick} 
                                handleKeyDown={handleKeyDown}
                                AdormentButtonDisable={addButtonIsDisabled}
                            />
                            <Typography fontSize="12px" color= '#f44336' sx={{mt: 2}}>
                                {FIREBASE_ERRORS[error as keyof typeof FIREBASE_ERRORS]}
                            </Typography>
                            <ScapPrimaryButton onClick={linksSubmit} type="submit" theme={theme} fullWidth color="primary" variant="contained" sx={{mt: 2}} disabled={addPeopleAtomValue.values.length == 0}>
                                {false ? (<CircularProgress size={26} sx={{color: "white"}}/>)  : addPeopleAtomValue.values.length > 1 ? <>Add People</> : <>Add Person</>}
                            </ScapPrimaryButton>
                        </FlexBetween>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}
export default AddPeople;
