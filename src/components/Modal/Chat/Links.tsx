import { chatThreadsState, ThreadMessage, ThreadRef } from '@/atoms/chatAtoms';
import { linksAtomState, LinksValue } from '@/atoms/linksAtom';
import { modalLinksOpen } from '@/atoms/modalLinksAtom';
import AlertInfo from '@/components/ScapComponents/AlertInfo';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import { auth, firestore } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useNavigation from '@/hooks/useNavigation';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { Backdrop, Box, Chip, CircularProgress, Divider, Fade, Modal, Stack, Typography, useTheme } from '@mui/material';
import { addDoc, collection, doc, runTransaction, serverTimestamp, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

type LinksProps = {
    
};

const Links:React.FC<LinksProps> = () => {

    const [user] = useAuthState(auth);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { isMobile } = useMediaQueryHook();
    const { navigatePage } = useNavigation();
    const { hex2rgb } = useRgbConverter();
    const [open, setOpen] = useRecoilState(modalLinksOpen);
    const setChatThreadsValue = useSetRecoilState(chatThreadsState)
    const [linksAtomValue, setLinksAtomValue] = useRecoilState(linksAtomState);
    const resetList = useResetRecoilState(linksAtomState);
    const [addButtonIsDisabled, setAddButtonIsDisbaled] = useState(true);
    const [error, setError] = useState("");
    const [creatingThreadLoading, setCreatingThreadLoading] = useState(false);
    const linksClose = () => {setOpen(false); setCreatingThreadLoading(false);};

    //Triggers when user types on textfield
    //The main purpose is to disable add button when field is empty or null
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLinksAtomValue(prev => ({
            ...prev,
            textFieldValue: event.target.value
        }))
        if(event.target.value === "" || event.target.value !== linksAtomValue.currentValue) {
            setAddButtonIsDisbaled(true);
        }
        if(event.target.value === linksAtomValue.currentValue){
            setAddButtonIsDisbaled(false);
        }
        setError("");
    };
    // Triggers when user clicks on add button
    const onAdormentButtonClick = () => {
        // console.log("xd: ", linksAtomValue.values)
        const newValues = {
            uid: linksAtomValue.currentUID,
            email: linksAtomValue.currentValue,
        }
        setLinksAtomValue(prev => ({
            ...prev,
            values: [...prev.values, newValues] 
        }) as LinksValue);

        setLinksAtomValue(prev => ({
            ...prev,
            currentValue: null,
            textFieldValue: ""
        }) as LinksValue);
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
        if(linksAtomValue.currentValue != null && linksAtomValue.currentValue === linksAtomValue.textFieldValue ) {
            setAddButtonIsDisbaled(false);
        } else {
            setAddButtonIsDisbaled(true);
        }
    }, [linksAtomValue.currentValue, linksAtomValue.textFieldValue]) // eslint-disable-next-line react-hooks/exhaustive-deps
    //Handles Delete
    const handleDelete = (val: string) => {
        setLinksAtomValue(prev => ({
            ...prev,
            values: [...prev.values.filter((item) => item.email != val)]
        }) as LinksValue);
        setError("");
    };
    //CONNECT TO A PERSON
    const handleCreateConnection = async () => {
        setCreatingThreadLoading(true);
        let connections = linksAtomValue.values.map(item => item.uid);
        let privateThreadId1 = connections.map(item => item! + user?.uid);
        let privateThreadIdReversed = connections.map(item => user?.uid + item!);
        const threadId1 = privateThreadId1[0];
        const threadId2 = privateThreadIdReversed[0];
        connections.push(user!.uid!);
        let threadSeen: string [] = [];
        threadSeen.push(user!.uid!);

        const newThread: ThreadRef = {
            type: "private",
            groupName:"",
            groupPhotoURL:"",
            createdAt: serverTimestamp() as Timestamp,
            latestMessageCreatedAt: serverTimestamp() as Timestamp,
            connections: connections as [],
            threadSeen: threadSeen as [],
            lastMessage: "You are now connected to",
            lastMessageUID: "",
            lastMessageId: "",
            changeType:"added",
            createdBy: user?.uid,
            status: "active",
        }

        const newUserThread = {
            connections: connections as [],
        }

        const dummyMessage: ThreadMessage = {
            threadId: threadId1,
            uid: "_dummy",
            text: "",
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
            threadMessages: [...prev.threadMessages, dummyMessage],
        }));
        // console.log(connections)
        try{
            //CREATE new thread
            const createThreadRef1 = doc(firestore, 'threads', threadId1);
            const createThreadRef2 = doc(firestore, 'threads', threadId2);
            await runTransaction(firestore, async (transaction) => {
                //READ
                const threadDoc1 = await transaction.get(createThreadRef1);
                const threadDoc2 = await transaction.get(createThreadRef2);
                if(threadDoc1.exists() || threadDoc2.exists()){
                    throw new Error(`Sorry, you are already connected to this user. Try another.`);
                }
                //WRITE
                //CREATE thread
                transaction.set(createThreadRef1, newThread);

                //CREATE thread on users
                connections.forEach(userId => {
                    transaction.set(doc(firestore, `users/${userId}/threadSnippits`, threadId1), newUserThread);
                })

                //CREATE dummy message
                transaction.set(doc(firestore, `threads/${threadId1}/messages`, "_dummy"), dummyMessage);
                setTimeout(()=>{
                    navigatePage(`/scenes/chat/u=${user?.uid}=threadKey=${threadId1}`);
                },400)
                setCreatingThreadLoading(false);
                setOpen(false);
                resetList();
            });
        } catch (err: any) {
            setError(err);
            // console.log("Adding new thread error: ", err);
        }
    }
    //CREATE GROUP CHAT
    const handleCreateGroup = async () => {
        setCreatingThreadLoading(true);
        let connections = linksAtomValue.values.map(item => item.uid);
        connections.push(user!.uid!);
        let threadSeen: string [] = [];
        threadSeen.push(user!.uid!);

        const newThread: ThreadRef = {
            type: "group",
            groupName:"",
            groupPhotoURL:"",
            createdAt: serverTimestamp() as Timestamp,
            latestMessageCreatedAt: serverTimestamp() as Timestamp,
            connections: connections as [],
            threadSeen: threadSeen as [],
            lastSeen: serverTimestamp() as Timestamp,
            lastMessage: "New group created.",
            lastMessageId: "",
            lastMessageUID: "",
            changeType:"added",
            createdBy: user?.uid,
            status: "active",
        }
        const newUserThread = {
            connections: connections as [],
        }
        // console.log(connections)
        try{
            //CREATE new thread
            
            const createThreadRef = await addDoc(collection(firestore, 'threads'), newThread);

            const dummyMessage: ThreadMessage = {
                threadId: createThreadRef.id,
                uid: "_dummy",
                text: "",
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
                threadMessages: [...prev.threadMessages, dummyMessage],
            }));

            await runTransaction(firestore, async (transaction) => {
                //READ
                const threadDoc = await transaction.get(createThreadRef);
                if(!threadDoc.exists()){
                    throw new Error(`Sorry, thread wasn't created. Try another.`);
                }
                //WRITE
                //CREATE dummy message
                transaction.set(doc(firestore, `threads/${createThreadRef.id}/messages`, "_dummy"), dummyMessage);
                //CREATE thread on users
                connections.forEach(userId => {
                    transaction.set(doc(firestore, `users/${userId}/threadSnippits`, createThreadRef.id), newUserThread);
                });
                setTimeout(()=>{
                    navigatePage(`/scenes/chat/u=${user?.uid}=threadKey=${createThreadRef.id}`);
                },400)
            });
            setCreatingThreadLoading(false);
            setOpen(false);
            resetList();
        } catch (err: any) {
            setError(err);
            console.log("Adding new thread error: ", error);
        }
    }

    const linksSubmit = () => {
        if(linksAtomValue.values.length > 1){
            handleCreateGroup();
            
        } else {
            handleCreateConnection();
        }
    }
    
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={() => {linksClose(), resetList()}}
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
                            <Typography variant="h5" sx={{fontWeight: 700, mb: 2, width: "100%"}}>Create Links</Typography>
                            <AlertInfo text="You can enter multiple emails to create a group chat." />
                            <Divider/>
                            <Stack direction="row" spacing={1} sx={{mb: 1, width: "100%", flexWrap: "wrap"}}>
                                {linksAtomValue.values.map((items, index)=> (
                                    <Chip key={index} label={items.email} onDelete={() => {handleDelete(items.email)}} sx={{mb: "8px !important"}} />
                                ))}
                            </Stack>
                            <ScapPrimaryTextField 
                                type="email" 
                                label="Email" 
                                name="addLinks" 
                                onChange={onChange} 
                                onAdormentButtonClick={onAdormentButtonClick} 
                                handleKeyDown={handleKeyDown}
                                AdormentButtonDisable={addButtonIsDisabled}
                            />
                            <Typography fontSize="12px" color= '#f44336' sx={{mt: 2}}>
                                {FIREBASE_ERRORS[error as keyof typeof FIREBASE_ERRORS]}
                            </Typography>
                            <ScapPrimaryButton onClick={linksSubmit} type="submit" theme={theme} fullWidth color="primary" variant="contained" sx={{mt: 2}} disabled={linksAtomValue.values.length == 0}>
                                {creatingThreadLoading ? (<CircularProgress size={26} sx={{color: "white"}}/>)  : linksAtomValue.values.length > 1 ? <>Create Group</> : <>Create Connection</>}
                            </ScapPrimaryButton>
                        </FlexBetween>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}
export default Links;
