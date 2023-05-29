import { addPeopleAtomState, AddPeopleValue } from '@/atoms/addPeopleAtom';
import { chatThreadsState } from '@/atoms/chatAtoms';
import { linksAtomState, LinksValue } from '@/atoms/linksAtom';
import { usersAtomState } from '@/atoms/usersAtom';
import { auth } from '@/firebase/clientApp';
import useRgbConverter from '@/hooks/useRgbConverter';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Add, Search, SentimentSatisfiedOutlined } from '@mui/icons-material';
import { Autocomplete, IconButton, InputAdornment, Popover, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue } from 'recoil';

interface userInfoType {
    uid:string;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
}

type ScapPrimaryTextFieldProps = {
    type: string;
    label: string;
    name: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isError?:  {
        errorMessage: string;
        status: boolean;
    }
    onBlur?: (value: string) => void;
    resetValue?: string | null;
    passwordCharLeft?: number;
    authType?: string;
    onMessageFieldFocus?: (value: boolean) => void;
    onAdormentButtonClick?: () => void;
    handleKeyDown?: (event: React.KeyboardEvent<HTMLImageElement>) => void;
    AdormentButtonDisable?: boolean;
    setSendButoon?: (value: React.SetStateAction<boolean>) => void;
    onChangeMessageText?: (input: string) => void;
    sendButton?: boolean;
};

const ScapPrimaryTextField:React.FC<ScapPrimaryTextFieldProps> = ({
    type, 
    label, 
    name, 
    onChange, 
    isError, 
    onBlur, 
    resetValue, 
    passwordCharLeft, 
    authType, 
    onMessageFieldFocus, 
    onAdormentButtonClick, 
    handleKeyDown,
    AdormentButtonDisable,
    setSendButoon,
    onChangeMessageText,
    sendButton
}) => {

    const [user] = useAuthState(auth);        
    const theme = useTheme();
    const { hex2rgb } = useRgbConverter();
    const usersAtomValue = useRecoilValue(usersAtomState);
    const chatThreadsValue = useRecoilValue(chatThreadsState);
    const [linksAtomValue, setLinksAtomValue] = useRecoilState(linksAtomState);
    const [addPeopleAtomValue, setAddPeopleAtomValue] = useRecoilState(addPeopleAtomState);
    const [chatMessage, setChatMessage] = useState("");
    const [autocompleteValue, setAutoCompleteValue] = React.useState<userInfoType | null>(null);
    const [useInfoOptions , setUseInfoOptions] = useState<userInfoType[]>([]);
    const [anchorElEmoji, setAnchorElEmoji] = React.useState<null | HTMLElement>(null);
    const openEmoji = Boolean(anchorElEmoji);
    const idEmoji = openEmoji ? 'simple-popover' : undefined;
    
    const defaultPropsAddLinks = {
        options: useInfoOptions.filter(item1 => item1.email !== user?.email && item1.userType !=="customer"),
        getOptionLabel: (option: userInfoType) => option.email,
    };

    const currentThreadConnections: string [] = [];
    chatThreadsValue.currentSelectedThread?.connections.map(item => currentThreadConnections.push(item));

    const defaultPropsAddPeople = {
        options: useInfoOptions.filter(item1 => item1.email !== user?.email && item1.userType !=="customer" && !currentThreadConnections.includes(item1.uid)),
        getOptionLabel: (option: userInfoType) => option.email,
    };
    
    let opacity = "30"
    if(theme.palette.mode == "light"){
        opacity= "3";
    }

    const handleClickEmoji = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElEmoji(event.currentTarget);
    };

    const handleCloseEmoji = () => {
        setAnchorElEmoji(null);
    };

    const onFieldBlur = () => {
        if(onBlur){
            onBlur(name);
        }
    }

    const sendButtonToggle = (text: any) => {
        if(setSendButoon){
            if(text.length > 0 && text.replace(/\s/g, '').length) {
                setSendButoon(false);
            } else {
                setSendButoon(true);
            }
        }
    }
    
    const onEmojiSelect = (event: any) => {
        let sym = event.unified.split("-");
        let codesArray: any = [];
        sym.forEach((el: any) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);

        setChatMessage(chatMessage + emoji);
        if(onChangeMessageText){onChangeMessageText(chatMessage + emoji);}
        sendButtonToggle(chatMessage + emoji);
    };

    const chatTextfieldOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatMessage(event.target.value);
        if(onChangeMessageText){onChangeMessageText(event.target.value);}
        sendButtonToggle(event.target.value);
    }
    
    useEffect(() => {
        //FILTERS Emails
        //If email has been selected then do not show on the lists
        setUseInfoOptions(usersAtomValue.users.filter(item1 => linksAtomValue.values.every(item2 => item1.email !== item2.email && item1.userType !== " customer")));
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linksAtomValue.values])

    useEffect(() => {
        //FILTERS Emails
        //If email has been selected then do not show on the lists
        setUseInfoOptions(usersAtomValue.users.filter(item1 => addPeopleAtomValue.values.every(item2 => item1.email !== item2.email && item1.userType !== " customer")));
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addPeopleAtomValue.values])

    useEffect(()=>{
        if(sendButton){
            if(sendButton == true){
                setChatMessage("");
            }
        }
    }, [sendButton])
    useEffect(() => {
        if(linksAtomValue.currentValue == null || linksAtomValue.currentValue !== linksAtomValue.textFieldValue ){
            setAutoCompleteValue(null);
            setLinksAtomValue(prev => ({
                ...prev,
                currentValue: null,
            }) as LinksValue);
        }
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linksAtomValue.currentValue, linksAtomValue.textFieldValue])

    useEffect(() => {
        if(addPeopleAtomValue.currentValue == null || addPeopleAtomValue.currentValue !== addPeopleAtomValue.textFieldValue ){
            setAutoCompleteValue(null);
            setAddPeopleAtomValue(prev => ({
                ...prev,
                currentValue: null,
            }) as AddPeopleValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addPeopleAtomValue.currentValue, addPeopleAtomValue.textFieldValue])
    
  return (
        <>
        {name === 'search' ? 
            <TextField 
                error={isError?.status}
                onBlur={onFieldBlur}
                onChange={onChange}
                name={name}
                fullWidth 
                autoComplete="off"
                type={type} 
                id={name}
                value={resetValue}
                placeholder={label}
                InputProps={{
                    startAdornment: (
                        <>
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        </>
                    ),
                }}
                sx={{ 
                    '& label.Mui-focused': {
                        color: theme.palette.secondary.main,
                    },
                    '& .MuiInput-underline:after': {
                    // borderBottomColor: 'yellow',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            color: "white",
                            borderRadius: "8px",
                            borderColor: hex2rgb(theme.palette.primary.light, "80").rgb
                        },
                        '&:hover fieldset': {
                            backgroundColor: hex2rgb(theme.palette.secondary.dark, opacity).rgb,
                            borderColor: hex2rgb(theme.palette.primary.light, "80").rgb
                        },
                        '&.Mui-focused fieldset': {
                            color: "white",
                            border: `3px solid ${theme.palette.secondary.main}`,
                        },
                        '&.mui-style-1p4l6zo-MuiInputBase-root-MuiOutlinedInput-root': {
                            color: theme.palette.text.primary
                        }
                    },
                }} 
            />
            : <> 
            {name === "message"  ? (
                <>
                    <Popover
                        id={idEmoji}
                        open={openEmoji}
                        anchorEl={anchorElEmoji}
                        onClose={handleCloseEmoji}
                        sx={{
                            '& .MuiPaper-root.MuiPaper-elevation': {
                                borderRadius: "10px"
                            },
                            '& section#root': {
                                backgroundColor: "red"
                            }
                        }}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                    >
                        <Picker 
                            data={data} 
                            onEmojiSelect={onEmojiSelect} 
                            theme={theme.palette.mode === "dark" ? "dark" : "light"}
                        />
                    </Popover>
                    <TextField 
                        size="small"
                        error={isError?.status}
                        onChange={chatTextfieldOnChange}
                        onFocus={()=>{onMessageFieldFocus && onMessageFieldFocus(false)}}
                        onBlur={()=>{onMessageFieldFocus && onMessageFieldFocus(true)}}
                        onKeyDown={handleKeyDown}
                        name={name}
                        autoComplete="off"
                        fullWidth 
                        type={type} 
                        id={"chat-" +name +"-textfield"}
                        value={chatMessage}
                        placeholder={label}
                        InputProps={{
                            endAdornment: (
                                <>
                                    <InputAdornment position="end">
                                        <Tooltip title="Attach File">
                                            <IconButton
                                                size="medium"
                                                aria-label="show 17 new notifications"
                                                color="inherit"
                                                edge="end"
                                                onClick={handleClickEmoji}
                                            >
                                                <SentimentSatisfiedOutlined sx={{fontSize: 20, color: theme.palette.text.secondary}}/>
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                </>
                            ),
                        }}
                        sx={{ 
                            '& label.Mui-focused': {
                                color: theme.palette.secondary.main,
                            },
                            '& .MuiInput-underline:after': {
                            // borderBottomColor: 'yellow',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    color: "white",
                                    borderRadius: "25px",
                                    borderColor: hex2rgb(theme.palette.primary.light, "80").rgb
                                },
                                '&:hover fieldset': {
                                    backgroundColor:hex2rgb(theme.palette.secondary.dark, opacity).rgb,
                                    borderColor: hex2rgb(theme.palette.primary.light, "80").rgb
                                },
                                '&.Mui-focused fieldset': {
                                    color: "white",
                                    border: `3px solid ${theme.palette.secondary.main}`,
                                },
                                '&.mui-style-1p4l6zo-MuiInputBase-root-MuiOutlinedInput-root': {
                                    color: theme.palette.text.primary
                                }
                            },
                        }} 
                    />
                </>
                ):(
                    <> 
                    {(name === "addLinks" || name === "addPeople")  ? (
                        <Autocomplete
                            {...(name === "addLinks" ? defaultPropsAddLinks : defaultPropsAddPeople)}
                            id="controlled-demo"
                            onChange={(event: any, newValue: userInfoType | null) => {
                                setAutoCompleteValue(newValue);
                                {name === "addLinks" && 
                                    setLinksAtomValue(prev => ({
                                        ...prev,
                                        currentUID: newValue?.uid,
                                        currentValue: newValue?.email,
                                        textFieldValue: newValue?.email,
                                    }) as LinksValue);
                                }

                                {name === "addPeople" && 
                                    setAddPeopleAtomValue(prev => ({
                                        ...prev,
                                        currentUID: newValue?.uid,
                                        currentValue: newValue?.email,
                                        textFieldValue: newValue?.email,
                                    }) as AddPeopleValue);
                                }   
                            }}
                            value={autocompleteValue}
                            sx={{
                                width: "100%",
                                "& .MuiAutocomplete-inputRoot": {
                                    pr: "15px !important"
                                },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    error={isError?.status}
                                    onChange={onChange}
                                    onKeyDown={handleKeyDown}
                                    name={name}
                                    fullWidth 
                                    type={type} 
                                    id={name}
                                    placeholder={label}
                                    InputProps={{
                                        ...params.InputProps,
                                        type: type,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {AdormentButtonDisable ? (
                                                    <Add sx={{fontSize: 20, color: theme.palette.text.secondary, mr: "5px"}}/>
                                                ):(
                                                    <Tooltip title="Add email">
                                                        <IconButton
                                                            size="small"
                                                            aria-label="show 17 new notifications"
                                                            color="inherit"
                                                            edge="end"
                                                            sx={{
                                                                borderRadius: "8px",
                                                                mr: "0px",
                                                                backgroundColor: theme.palette.secondary.main,
                                                                "&:hover": {
                                                                    backgroundColor: theme.palette.secondary.main,
                                                                }
                                                            }}
                                                            onClick={onAdormentButtonClick}
                                                        >
                                                             <Add  sx={{fontSize: 20, color: theme.palette.primary.contrastText}}/>
                                                             {/* <Typography variant='h6' sx={{fontWeight: 600, color: theme.palette.secondary.main}}>ADD</Typography> */}
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ 
                                        '& label.Mui-focused': {
                                            color: theme.palette.secondary.main,
                                        },
                                        '& .MuiInput-underline:after': {
                                        // borderBottomColor: 'yellow',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                color: "white",
                                                borderRadius: "8px",
                                                borderColor: hex2rgb(theme.palette.primary.light, "80").rgb
                                            },
                                            '&:hover fieldset': {
                                                backgroundColor:hex2rgb(theme.palette.secondary.dark, opacity).rgb,
                                                borderColor: hex2rgb(theme.palette.primary.light, "80").rgb
                                            },
                                            '&.Mui-focused fieldset': {
                                                color: "white",
                                                border: `3px solid ${theme.palette.secondary.main}`,
                                            },
                                            '&.mui-style-1p4l6zo-MuiInputBase-root-MuiOutlinedInput-root': {
                                                color: theme.palette.text.primary
                                            }
                                        },
                                    }} 
                                />
                            )}
                        />
                        ):(
                        <TextField 
                            error={isError?.status}
                            onBlur={onFieldBlur}
                            helperText={isError?.errorMessage}
                            onChange={onChange}
                            name={name}
                            inputProps={{ 
                                maxLength: authType === "register" 
                                    ? name === "password" 
                                        ? 21 
                                        : 140 
                                    : 140
                            }}
                            fullWidth 
                            type={type} 
                            label={authType === "register" ? name === "password" && `${label} [${passwordCharLeft}/21]` : label} 
                            id={name}
                            value={resetValue}
                            sx={{ 
                                '& label.Mui-focused': {
                                    color: theme.palette.secondary.main,
                                },
                                '& .MuiInput-underline:after': {
                                // borderBottomColor: 'yellow',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        color: "white",
                                        borderRadius: "8px",
                                        borderColor: hex2rgb(theme.palette.primary.light, "80").rgb
                                    },
                                    '&:hover fieldset': {
                                        backgroundColor:hex2rgb(theme.palette.secondary.dark, opacity).rgb,
                                        borderColor: hex2rgb(theme.palette.primary.light, "80").rgb
                                    },
                                    '&.Mui-focused fieldset': {
                                        color: "white",
                                        border: `3px solid ${theme.palette.secondary.main}`,
                                    },
                                    '&.mui-style-1p4l6zo-MuiInputBase-root-MuiOutlinedInput-root': {
                                        color: theme.palette.text.primary
                                    }
                                },
                            }} 
                        />
                        )}
                    </>
                )}
            </>
        }
        </>
    )
}
export default ScapPrimaryTextField;
