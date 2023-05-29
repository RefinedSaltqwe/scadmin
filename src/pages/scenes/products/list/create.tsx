import ImageListItems from '@/components/Chat/ChatMessagesComponents/ImageListItems';
import ProductDetailsActive from '@/components/Product/ProductDetailsActive';
import CollectionsInput from '@/components/Product/ProductOrganization/CollectionsInput';
import ProductCategory from '@/components/Product/ProductOrganization/ProductCategory';
import ProductTypeInput from '@/components/Product/ProductOrganization/ProductTypeInput';
import ProductVendorInput from '@/components/Product/ProductOrganization/ProductVendorInput';
import TagsInput from '@/components/Product/ProductOrganization/TagsInput';
import ProductVariant from '@/components/Product/ProductVariant';
import Dropzone from '@/components/ScapComponents/Dropzone';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import FlexContainer from '@/components/ScapComponents/FlexContainer';
import Header from '@/components/ScapComponents/Header';
import PageContentLayout from '@/components/ScapComponents/PageContent';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import SaveChangesBar from '@/components/ScapComponents/SaveChangesBar';
import TextEditor from '@/components/ScapComponents/TextEditor';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useNavigation from '@/hooks/useNavigation';
import useRgbConverter from '@/hooks/useRgbConverter';
import { AddPhotoAlternateOutlined, ArrowBackIosOutlined, HelpOutline } from '@mui/icons-material';
import { Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, IconButton, InputAdornment, List, MenuItem, Radio, RadioGroup, Select, Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

type CreateProductProps = {
    
};

export interface FormatProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const WeightValueMask = React.forwardRef<HTMLElement, FormatProps>(
    function WeightValueMask(props, ref) {
      const { onChange, ...other } = props;
      return (
        <IMaskInput
          {...other}
          mask="#.00"
          definitions={{
            '#': /[0-9]/
          }}
          inputRef={ref}
          onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
          onChange={()=>{}}
          overwrite
        />
      );
    },
);

const CurrencyNumericFormat = React.forwardRef<NumericFormatProps, FormatProps>(
    function CurrencyNumericFormat(props, ref) {
        const { onChange, ...other } = props;

        return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
            onChange({
                target: {
                name: props.name,
                value: values.value,
                },
            });
            }}
            thousandSeparator
            valueIsNumericString
        //   prefix="$"
        />
        );
    },
);

interface WeightState {
    shippingWeight: string;
    weightMode: string;
    shippingType: string;
}

const CreateProduct:React.FC<CreateProductProps> = () => {

    const theme = useTheme();
    const { isMobile } = useMediaQueryHook();
    const { hex2rgb } = useRgbConverter();
    const { navigatePage } = useNavigation();
    const [selectedImageBlob, setSelectedImageBlob] = useState<Blob>();
    const [selectedImageBase64, setSelectedImageBase64] = useState<string>();
    const [errorMessage, setErrorMessage] = useState("");
    const [shippingInfo, setShippingInfo] = useState<WeightState>({
        shippingWeight: '',
        weightMode: 'kg',
        shippingType: "physicalproduct"
    });

    let OPACITY = "30"
    
    if(theme.palette.mode == "light"){
        OPACITY= "3";
    }

    const handleShippingWeightInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
    };

    return (
        <>
            <FlexBetween sx={{width: "100%", height:"90%", justifyContent: "center", flexDirection: "column"}} >
                <FlexBetween mb="20px" sx={{width: "100%", height:"100%", alignItems: "flex-start", maxWidth: "1440px"}}>
                    {/* HEADER */}
                    <FlexBetween sx={{flexDirection: "row", width: "100%", flexGrow: 0}}>
                        <Box sx={{flexGrow: 1, display: "flex", flexDirection: "row"}}>  
                            <Box sx={{mr: 2}} >
                                <IconButton 
                                    size="large" 
                                    aria-label="Back" 
                                    color="inherit" 
                                    onClick={() => {navigatePage("/scenes/products/list")}}
                                >
                                    <ArrowBackIosOutlined sx={{fontSize: 18, color: theme.palette.text.secondary}}/>
                                </IconButton>
                            </Box>
                            <Header title="Add Product" />
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
                                    backgroundColor:hex2rgb(theme.palette.secondary.dark, OPACITY).rgb,
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
                                <FlexBetween sx={{width: "100%", pr: isMobile ? 3 : 0}} >
                                    {/* Customer */}
                                    {!isMobile && 
                                        <FlexContainer sx={{mt: 2}}>
                                            {/* HEADER */}
                                            <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                                <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
                                                    <Typography variant="h5" sx={{fontWeight: 600}}>Status</Typography>
                                                </Box>
                                            </Box>
                                            {/* BODY */}
                                            <Box>
                                                <List sx={{ width: '100%', mt: "14px" }}>
                                                    <ProductDetailsActive/>
                                                </List>
                                            </Box>
                                        </FlexContainer>
                                    }
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
                                            <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
                                                <Typography variant="h5" sx={{fontWeight: 600}}>Basic Details</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{margin: "24px 0 20px 0"}}>
                                            <ScapPrimaryTextField type="text" label="Title" name="text" onChange={onChange}/>
                                        </Box>
                                        <TextEditor/>
                                    </FlexContainer>
                                    {/* Media */}
                                    <FlexContainer>
                                        <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
                                                <Typography variant="h5" sx={{fontWeight: 600}}>Media</Typography>
                                            </Box>
                                        </Box>
                                        {selectedImageBase64 ? (
                                            <FlexBetween sx={{ width: "100%", marginY: "8px"}}>
                                                {/* Image List */}
                                                <ImageListItems src={selectedImageBase64 as string} setSelectedImage={setSelectedImageBase64}/>
                                                {/* ADD IMAGE */}
                                                <Box sx={{width: "25%", pb: "25%", position: "relative", borderRadius: "12px", m: "15px", cursor: "pointer"}} onClick={() => {console.log("Click")}} >
                                                    <Box sx={{position: "absolute", height: "100%", width: "100%"}}>
                                                        <FlexBetween sx={{height: "100%", width: "100%", justifyContent: "center", borderWidth: "2px", borderRadius: "12px", borderColor: hex2rgb(theme.palette.primary.light, "80").rgb, borderStyle: "dashed"}}>
                                                            <AddPhotoAlternateOutlined sx={{width: "25%", height: "25%", color: hex2rgb(theme.palette.primary.light, "80").rgb}} />
                                                        </FlexBetween>
                                                    </Box>
                                                </Box>
                                            </FlexBetween>
                                        ):(
                                            <Dropzone multipleFiles={true} setSelectedImageBlob={setSelectedImageBlob} setSelectedImageBase64={setSelectedImageBase64} />
                                        )}
                                    </FlexContainer>
                                    {/* Pricing */}
                                    <FlexContainer>
                                        <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
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
                                                    width: { xs: '100%', md: '50%' },
                                                    mb: isMobile ? "0" : "15px"
                                                }} 
                                            >
                                                <TextField
                                                    fullWidth
                                                    helperText="Please enter the price. (Required)"
                                                    id="price-adornment-amount"
                                                    label="Price*"
                                                    name="Price"
                                                    placeholder='0.00'
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                        inputComponent: CurrencyNumericFormat as any,
                                                    }}
                                                    sx={{ m: 1 }}
                                                />
                                            </FlexBetween>
                                            <FlexBetween 
                                                sx={{
                                                    width: { xs: '100%', md: '50%' },
                                                }} 
                                            >
                                                <TextField
                                                    fullWidth
                                                    helperText="Enter a value higher than your price. (Optional)"
                                                    id="comapre-at-adornment-amount"
                                                    label="Compare-at Price"
                                                    name="CompareAtPrice"
                                                    placeholder='0.00'
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                        endAdornment: (
                                                            <Tooltip title="To display a markdown, enter a value higher than your price. Often shown with a strikethrough (e.g. $25.00).">
                                                                <HelpOutline sx={{color: theme.palette.text.secondary}} />
                                                            </Tooltip>
                                                        ),
                                                        inputComponent: CurrencyNumericFormat as any,
                                                    }}
                                                    sx={{ m: 1 }}
                                                />
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
                                        <Divider sx={{marginY: "20px"}} />
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
                                                <TextField
                                                    fullWidth
                                                    helperText="Tax charged on this product."
                                                    id="tax-adornment-amount"
                                                    label="Cost per Item"
                                                    name="CostPerItem"
                                                    placeholder='0.00'
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                        endAdornment: (
                                                            <Tooltip title="Customers won't see this.">
                                                                <HelpOutline sx={{color: theme.palette.text.secondary}} />
                                                            </Tooltip>
                                                        ),
                                                        inputComponent: CurrencyNumericFormat as any,
                                                    }}
                                                    sx={{ m: 1 }}
                                                />
                                            </FlexBetween>
                                        </Box>
                                    </FlexContainer>
                                    {/* Inventory */}
                                    <FlexContainer>
                                        <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
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
                                    {/* Shipping */}
                                    <FlexContainer>
                                        <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
                                                <Typography variant="h5" sx={{fontWeight: 600}}>Shipping</Typography>
                                            </Box>
                                        </Box>
                                        <FormControl sx={{marginY: "15px"}} >
                                            <RadioGroup
                                                row
                                                aria-labelledby="Shipping Type Button Group"
                                                name="Shipping-Type-Button-Group"
                                                sx={{
                                                    '& .MuiButtonBase-root.MuiRadio-root.Mui-checked':{
                                                        color: theme.palette.secondary.main
                                                    }
                                                }}
                                                value={shippingInfo.shippingType}
                                                onChange={(e) => {setShippingInfo({
                                                    ...shippingInfo,
                                                    shippingType: e.target.value,
                                                });}}
                                            >
                                                <FormControlLabel value="physicalproduct" control={<Radio />} label="Physical Product"/>
                                                <FormControlLabel value="digitalproduct" control={<Radio />} label="Digital Product or Service" />
                                            </RadioGroup>
                                        </FormControl>
                                        {/* <Divider /> */}
                                        <Box 
                                            sx={{
                                                width:"100%",
                                                display: "flex",
                                                margin: "0 0 20px 0",
                                                flexDirection: {xs: "column", md: "row"},
                                            }}
                                        >
                                            {shippingInfo.shippingType === "physicalproduct" ? (
                                                <>
                                                    <Box sx={{width: { xs: '100%', md: '30%' }, m: {xs: "8px 0", md: "8px"} }}>
                                                        <TextField
                                                            fullWidth
                                                            value={shippingInfo.shippingWeight}
                                                            onChange={handleShippingWeightInfo}
                                                            id="shipping-weight-adornment-amount"
                                                            label="Shipping Weight"
                                                            name="shippingWeight"
                                                            placeholder='0.00'
                                                            InputProps={{
                                                                inputComponent: CurrencyNumericFormat as any,
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box sx={{width: { xs: '100%', md: '10%' }, m: {xs: "8px 0", md: "8px"}  }}>
                                                        <FormControl fullWidth>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={shippingInfo.weightMode}
                                                                name="weightMode"
                                                                onChange={(e) => {setShippingInfo({
                                                                    ...shippingInfo,
                                                                    weightMode: e.target.value,
                                                                });}}
                                                            >
                                                                <MenuItem value="lb">lb</MenuItem>
                                                                <MenuItem value="oz">oz</MenuItem>
                                                                <MenuItem value="kg">kg</MenuItem>
                                                                <MenuItem value="g">g</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Box>
                                                </>
                                            ):(
                                                <Typography>{`Customers won't enter shipping details at checkout.`}</Typography>
                                            )}
                                            
                                        </Box>
                                    </FlexContainer>
                                    {/* Variants */}
                                    <ProductVariant setErrorMessage={setErrorMessage}/>
                                </FlexBetween>
                            </FlexBetween>
                            {/* RIGHT */}
                            <FlexBetween sx={{width: "100%", height: "100%", alignItems: "flex-start"}} >
                                <FlexBetween sx={{width: "100%"}} >
                                    {/* Customer */}
                                    {isMobile && 
                                        <FlexContainer>
                                            {/* HEADER */}
                                            <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                                <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
                                                    <Typography variant="h5" sx={{fontWeight: 600}}>Status</Typography>
                                                </Box>
                                            </Box>
                                            {/* BODY */}
                                            <Box>
                                                <List sx={{ width: '100%', mt: "5px" }}>
                                                    <ProductDetailsActive/>
                                                </List>
                                            </Box>
                                        </FlexContainer>
                                    }
                                    
                                    {/* Product Organization */}
                                    <FlexContainer sx={{mb: false ? isMobile ? "24px" : "88px" : "24px"}}>
                                        {/* HEADER */}
                                        <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
                                                <Typography variant="h5" sx={{fontWeight: 600}}>Product Organization</Typography>
                                            </Box>
                                        </Box>
                                        {/* BODY */}
                                        <Box>
                                            <FlexBetween>
                                                <Stack spacing={3} sx={{ width: "100%" }}>
                                                    {/* Product Category */}
                                                    <ProductCategory theme={theme} optionValues={options100} />
                                                    {/* Product Type */}
                                                    <ProductTypeInput optionValues={options100} />
                                                    {/* Product Vendors */}
                                                    <ProductVendorInput optionValues={options100} />
                                                    {/* Collections */}
                                                    <CollectionsInput theme={theme} optionValues={options100} />
                                                    {/* TAGS */} 
                                                    <TagsInput theme={theme} optionValues={options100} />
                                                    
                                                    {/* <Autocomplete
                                                        value={value}
                                                        multiple
                                                        id="tags-outlined"
                                                        onChange={(event, newValue) => {
                                                            setValue(newValue)
                                                        }}
                                                        options={options100.map((option) => option.title)}
                                                        // getOptionLabel={(option) => option}
                                                        defaultValue={[options100[13]]}
                                                        filterSelectedOptions
                                                        freeSolo
                                                        limitTags={2}
                                                        renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Tags"
                                                            placeholder="Find or create tags"
                                                        />
                                                        )}
                                                    /> */}
                                                </Stack>
                                            </FlexBetween>
                                        </Box>
                                    </FlexContainer>
                                </FlexBetween>
                            </FlexBetween>
                        </PageContentLayout>
                    </Box>
                </FlexBetween>
            </FlexBetween>
            {false && <SaveChangesBar errorMessage={errorMessage} />}
        </>
    )
}
export default CreateProduct;

const options100 = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
      title: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      title: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    {
      title: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    {
      title: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    {
      title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      year: 1964,
    },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    {
      title: 'Star Wars: Episode VI - Return of the Jedi',
      year: 1983,
    },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    {
      title: 'Eternal Sunshine of the Spotless Mind',
      year: 2004,
    },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
  ];