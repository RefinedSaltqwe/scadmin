import ImageListItems from '@/components/Chat/ChatMessagesComponents/ImageListItems';
import ProductDetailsActive from '@/components/Product/ProductDetailsActive';
import ScapAvatar from '@/components/ScapComponents/Avatar';
import Dropzone from '@/components/ScapComponents/Dropzone';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import FlexContainer from '@/components/ScapComponents/FlexContainer';
import Header from '@/components/ScapComponents/Header';
import PageContentLayout from '@/components/ScapComponents/PageContent';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import TextEditor from '@/components/ScapComponents/TextEditor';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useNavigation from '@/hooks/useNavigation';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { AddPhotoAlternateOutlined, ArrowBackIosOutlined, HelpOutline } from '@mui/icons-material';
import { Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, OutlinedInput, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';

type ProductDetailsProps = {
    
};

const ProductDetails:React.FC<ProductDetailsProps> = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { isMobile } = useMediaQueryHook();
    const { hex2rgb } = useRgbConverter();
    const { navigatePage } = useNavigation();
    const [selectedImageBlob, setSelectedImageBlob] = useState<Blob>();
    const [selectedImageBase64, setSelectedImageBase64] = useState<string>();
    let opacity = "30"
    if(theme.palette.mode == "light"){
        opacity= "3";
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // setLoginForm(prev => ({
        //     ...prev,
        //     [event.target.name]: event.target.value,
        // }))
        console.log(event.target.value)
    };
    
    return (
        <FlexBetween sx={{width: "100%", height:"90%", justifyContent: "center"}} >
            <FlexBetween mb="20px" sx={{width: "100%", height:"100%", alignItems: "flex-start", maxWidth: "1440px"}}>
                {/* HEADER */}
                <FlexBetween sx={{flexDirection: "row", width: "100%", flexGrow: 0}}>
                    <Box sx={{flexGrow: 1}}>  
                        <IconButton 
                            size="large" 
                            aria-label="Back" 
                            color="inherit" 
                            sx={{}}
                            onClick={() => {navigatePage("/scenes/products/list")}}
                        >
                            <ArrowBackIosOutlined sx={{fontSize: 18, color: theme.palette.text.secondary}}/>
                        </IconButton>
                        <Header title="Product Name" subtitle="December 2, 2022 at 12:21 am" />
                    </Box>
                </FlexBetween> 
                {/* BODY */}
                <Box 
                    sx={{
                        m: isMobile ? "25px 0 0 0" : "5px 0 0 0 ", 
                        width: "100%",
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
                
                >
                    <PageContentLayout leftWidth="70%" rightWidth="30%" pageType="noHeight">
                        {/* LEFT */}
                        <FlexBetween sx={{width: "100%", height: "100%", alignItems: "flex-start" }} >
                            <FlexBetween sx={{width: "100%", mr: isMobile ? 3 : 0}} >
                                {/* Fulfillment CONTAINER */}
                                <FlexContainer
                                    sx={{
                                        '& .ql-snow .ql-tooltip':{
                                            boxShadow: "0px 0px 0px #ddd",
                                            left: "0"
                                        },
                                        '& .quillTextEditor > div': {
                                            backgroundColor: "transparent",
                                            borderColor: hex2rgb(theme.palette.primary.light, '100').rgb,
                                        },
                                        '& .quillTextEditor > div > span > span > span::before': {
                                            color: theme.palette.text.primary
                                        },
                                        '& .quillTextEditor .ql-stroke': {
                                            stroke: `${theme.palette.text.primary} !important`
                                        },
                                        '& .quillTextEditor .ql-fill': {
                                            fill: `${theme.palette.text.primary} !important`
                                        },
                                        '& .editorClassName': {
                                            padding: "0 5px",
                                            border: `1px solid ${hex2rgb(theme.palette.primary.light, '60').rgb}`
                                        },
                                        '& .quillTextEditor .ql-toolbar': {
                                            marginBottom: "12px",
                                            borderRadius: "8px"
                                        },
                                        '& .quillTextEditor .ql-container': {
                                            height: "250px",
                                            border: `1px solid ${hex2rgb(theme.palette.primary.light, '100').rgb} !important`,
                                            borderRadius: "8px"
                                        },
                                        '& .quillTextEditor .ql-picker-label:hover::before': {
                                            color: `${theme.palette.secondary.main} !important`
                                        },
                                        ' .quillTextEditor .ql-picker-label:hover > svg > polygon.ql-stroke':{
                                            stroke: `${theme.palette.secondary.main} !important`
                                        },
                                        '& .quillTextEditor .ql-picker-item:hover, .quillTextEditor .ql-selected':{
                                            color: `${theme.palette.secondary.main} !important`
                                        },
                                        '& .quillTextEditor button:hover .ql-stroke, .quillTextEditor button.ql-active .ql-stroke': {
                                            stroke: `${theme.palette.secondary.main} !important`
                                        },
                                        '& .quillTextEditor button:hover .ql-fill, .quillTextEditor button.ql-active .ql-fill': {
                                            fill: `${theme.palette.secondary.main} !important`
                                        },
                                        '& .quillTextEditor .ql-active': {
                                            color: `${theme.palette.secondary.main} !important`
                                        },
                                        '& .quillTextEditor .ql-container > .ql-editor.ql-blank::before': {
                                            color: `${theme.palette.text.secondary} !important`,
                                            fontStyle: "normal",
                                        },
                                        // '& .quillTextEditor .ql-container:active':{
                                        //     border: `${theme.palette.secondary.main} 3px solid !important`
                                        // }
                                    }}
                                >
                                    {/* Basic Details */}
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Basic Details</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{margin: "15px 0 20px 0"}}>
                                        <ScapPrimaryTextField type="text" label="Title" name="text" onChange={onChange}/>
                                    </Box>
                                    <TextEditor/>
                                </FlexContainer>
                                <FlexContainer>
                                    {/* Media */}
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Media</Typography>
                                        </Box>
                                    </Box>
                                    {selectedImageBase64 ? (
                                        <List sx={{pb: 0, pt: 0, display: "flex", flexDirection: "row"}}>
                                            <ListItem sx={{p: "0px 0px 0px 16px", cursor: "pointer"}} onClick={()=>{}}>
                                                <ListItemAvatar sx={{mr: 0,}}>
                                                    <ScapAvatar 
                                                        variant="rounded"
                                                        sx={{
                                                            backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.dark : colors.grey[900],
                                                            color: "white",
                                                            width:"50px", 
                                                            height:"50px", 
                                                        }}
                                                    >
                                                        <AddPhotoAlternateOutlined sx={{width: "30px", height: "30px", color: theme.palette.mode === "dark" ? colors.grey[100] : theme.palette.primary.dark,}} />
                                                    </ScapAvatar>
                                                </ListItemAvatar>
                                            </ListItem>
                                            <ImageListItems src={selectedImageBase64 as string} setSelectedImage={setSelectedImageBase64}/>
                                        </List>
                                    ):(
                                        <Dropzone setSelectedImageBlob={setSelectedImageBlob} setSelectedImageBase64={setSelectedImageBase64} />
                                    )}
                                    
                                </FlexContainer>
                                <FlexContainer>
                                    {/* Pricing */}
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Pricing</Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            margin: "15px 0 5px 0", 
                                            display: "flex",
                                            flexDirection: {xs: "column", md: "row"},
                                        }} 
                                    >
                                        <FlexBetween 
                                            sx={{
                                                width: { xs: '100%', md: '50%' }
                                            }} 
                                        >
                                            <FormControl fullWidth sx={{ m: 1 }}>
                                                <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-amount"
                                                    startAdornment={
                                                        <InputAdornment position="start">$</InputAdornment>
                                                    }
                                                    label="Price"
                                                />
                                            </FormControl>
                                        </FlexBetween>
                                        <FlexBetween 
                                            sx={{
                                                width: { xs: '100%', md: '50%' }
                                            }} 
                                        >
                                            <FormControl fullWidth sx={{ m: 1 }}>
                                                <InputLabel htmlFor="outlined-adornment-amount">Compare-at price</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-amount"
                                                    startAdornment={
                                                        <InputAdornment position="start">$</InputAdornment>
                                                    }
                                                    endAdornment={
                                                        <Tooltip title="To display a markdown, enter a value higher than your price. Often shown with a strikethrough (e.g. $25.00).">
                                                            <HelpOutline/>
                                                        </Tooltip>
                                                    }
                                                    label="Compare-at price"
                                                />
                                            </FormControl>
                                        </FlexBetween>
                                    </Box>
                                    {/* CHECKBOX */}
                                    <Box 
                                        sx={{
                                            width:"100%",
                                            display: "flex",
                                            margin: "0 8px 0 8px",
                                            '& .Mui-checked': {
                                                color: `${theme.palette.secondary.main} !important`
                                            }
                                        }}
                                    >
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox defaultChecked />} label="Charge tax on this product" />
                                        </FormGroup>    
                                    </Box>
                                    <Divider sx={{mt: "10px"}} />
                                    <Box
                                        sx={{
                                            margin: "15px 0 0 0", 
                                            display: "flex",
                                            flexDirection: {xs: "column", md: "row"},
                                        }} 
                                    >
                                        <FlexBetween 
                                            sx={{
                                                width: { xs: '100%', md: '50%' }
                                            }} 
                                        >
                                            <FormControl fullWidth sx={{ m: 1 }}>
                                                <InputLabel htmlFor="outlined-adornment-amount">Cost per item</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-amount"
                                                    startAdornment={
                                                        <InputAdornment position="start">$</InputAdornment>
                                                    }
                                                    endAdornment={
                                                        <Tooltip title="Customers won't see this.">
                                                            <HelpOutline/>
                                                        </Tooltip>
                                                    }
                                                    label="Cost per item"
                                                />
                                            </FormControl>
                                        </FlexBetween>
                                    </Box>
                                </FlexContainer>
                                <FlexContainer>
                                    {/* Inventory */}
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Inventory</Typography>
                                        </Box>
                                    </Box>
                                    <Box 
                                        sx={{
                                            width:"100%",
                                            display: "flex",
                                            margin: "15px 0 20px 0",
                                            flexDirection: {xs: "column", md: "row"},
                                        }}
                                    >
                                        <Box sx={{width: { xs: '100%', md: '50%' }, m: {xs: "8px 0", md: "8px"} }}>
                                            <ScapPrimaryTextField type="text" label="SKU (Stock Keeping Unit)" name="sku" onChange={onChange}/>
                                        </Box>
                                        <Box sx={{width: { xs: '100%', md: '50%' }, m: {xs: "8px 0", md: "8px"}  }}>
                                            <ScapPrimaryTextField type="text" label="Barcode (ISBN, UPC, GTIN, etc.)" name="sku" onChange={onChange}/>
                                        </Box>
                                    </Box>
                                    <Box 
                                        sx={{
                                            width:"100%",
                                            display: "flex",
                                            margin: "15px 8px 0 8px",
                                            '& .Mui-checked': {
                                                color: `${theme.palette.secondary.main} !important`
                                            }
                                        }}
                                    >
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox defaultChecked />} label="Track quantity" />
                                            <FormControlLabel control={<Checkbox />} label="Continue selling when out of stock" />
                                        </FormGroup>    
                                    </Box>
                                </FlexContainer>
                            </FlexBetween>
                        </FlexBetween>
                        {/* RIGHT */}
                        <FlexBetween sx={{width: "100%", height: "100%", alignItems: "flex-start"}} >
                            <FlexBetween sx={{width: "100%"}} >
                                {/* Customer */}
                                <FlexContainer>
                                    {/* HEADER */}
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Status</Typography>
                                        </Box>
                                    </Box>
                                    {/* BODY */}
                                    <Box>
                                        <List sx={{ width: '100%' }}>
                                            <ProductDetailsActive/>
                                        </List>
                                    </Box>
                                </FlexContainer>
                            </FlexBetween>
                        </FlexBetween>
                    </PageContentLayout>
                </Box>
            </FlexBetween>
        </FlexBetween>
    )
}
export default ProductDetails;