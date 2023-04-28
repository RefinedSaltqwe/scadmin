import ScapAvatar from '@/components/ScapComponents/Avatar';
import { tokens } from '@/mui/theme';
import { Close } from '@mui/icons-material';
import { Badge, IconButton, ListItem, ListItemAvatar, useTheme } from '@mui/material';
import React from 'react';

type ImageListItemsProps = {
    src: string;
    setSelectedImage: (value: string) => void;
    setSendButoon?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImageListItems:React.FC<ImageListItemsProps> = ({ src, setSelectedImage, setSendButoon }) => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <ListItem sx={{p: "0px 0px 0px 16px"}}>
            <ListItemAvatar sx={{mr: 0,}}>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    badgeContent={
                        <IconButton
                            size="small"
                            aria-label="Scroll to Bottom"
                            color="inherit"
                            onClick={() => {
                                setSelectedImage("");
                                setSendButoon && setSendButoon(true);
                            }}
                            sx={{
                                '&:hover': {
                                    bgcolor: theme.palette.mode === "dark" ? "#b8b8b8" : theme.palette.primary.dark,
                                },
                                width: "20px",
                                height: "20px",
                                bgcolor: theme.palette.mode === "dark" ? "#b8b8b8" : theme.palette.primary.dark,
                            }}
                        >
                            <Close sx={{fontSize: "15px", color: colors.grey[900]}} />
                        </IconButton>
                    }
                >
                    <ScapAvatar 
                        variant="rounded"
                        src={src}
                        sx={{
                            backgroundColor: colors.indigoAccent[500], 
                            color: "white",
                            width:"50px", 
                            height:"50px", 
                        }}
                    >
                    </ScapAvatar>
                </Badge>
            </ListItemAvatar>
        </ListItem>
    )
}
export default ImageListItems;