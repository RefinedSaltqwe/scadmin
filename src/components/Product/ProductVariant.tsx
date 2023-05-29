import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useRgbConverter from '@/hooks/useRgbConverter';
import { Add, Close, DeleteOutlineOutlined, StarBorder } from '@mui/icons-material';
import { Box, Divider, FormControl, IconButton, List, ListItem, ListItemText, MenuItem, Select, Stack, Typography, useTheme } from '@mui/material';
import React, { memo, useEffect, useRef, useState } from 'react';
import FlexBetween from '../ScapComponents/FlexBetween';
import FlexContainer from '../ScapComponents/FlexContainer';
import ProductOptionDataGrid from '../ScapComponents/ProductOptionDataGrid';
import OptionValueInput from './ProductVariant/OptionValueInput';

export interface VariantOption {
    name: string;
    values: string [];
}

export interface VariantValue {
    id: string;
    variantName: string;
    variantImage: string;
    variantPrice: string;
    variantComparePrice: string;
    variantAvailability: string | number;
    variantOnHand: string | number;
    variantSKU: string;
    variantBarcode: string;
}

export interface VariantObject {
    variantOptionValues: VariantOption [];
    selectedOptionNames: string [];
    variantsDataGrid: VariantValue [];
}

const defaultVariantObject: VariantObject = {
    variantOptionValues: [],
    selectedOptionNames: [],
    variantsDataGrid: []
}

const VARIANT_OPTION_NAMES = ["Size", "Color", "Material", "Style"];

type ProductVariantProps = {
    setErrorMessage: (value: React.SetStateAction<string>) => void
};

const ProductVariant:React.FC<ProductVariantProps> = ({ setErrorMessage }) => {

    const theme = useTheme();
    const { hex2rgb } = useRgbConverter();
    const { isMobile } = useMediaQueryHook();
    const [variant, setVariant] = useState<VariantObject>(defaultVariantObject);
    const [variantPrevVal, setVariantPrevVal] = useState<VariantObject>(defaultVariantObject);
    let variantOptionChangeType = useRef("add");

    useEffect(()=>{
        let count: number = 0;
        let optionName: string = "";
        let optionNameArray: string [] =[];
        variant.variantOptionValues.forEach((item1, index) => {
            optionNameArray.push(item1.name);
            if(variant.selectedOptionNames.includes(item1.name)){
                optionName = item1.name;
            }
        })
        setVariant((prev) => ({
            ...prev,
            selectedOptionNames: [...optionNameArray]
        }));
        if(count > 0){
            console.log(`You've already used the option name "${optionName}".`);
            setErrorMessage(`You've already used the option name "${optionName}".`);
        } else{
            setErrorMessage(``);
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant.variantOptionValues]);

    useEffect(()=>{
        setVariantPrevVal(variant);
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <FlexContainer sx={{mb: false ?  isMobile ? "88px" : "24px" : "24px", p:"0 0 10px 0"}}>
            <Box sx={{display:"flex", flexDirection: "row", m: "25px 25px 10px 25px"}}>
                <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
                    <Typography variant="h5" sx={{fontWeight: 600}}>Variants</Typography>
                </Box>
            </Box>
            {/* OPTION */}
            <FlexBetween sx={{width: "100%", mt: "10px"}}>
                {/* Add Option */}
                {variant.variantOptionValues.length === 0 &&
                    <FlexBetween 
                        sx={{
                            width: "100%", 
                            p: "10px 0", 
                            m:"15px 25px 25px 25px", 
                            flexDirection: "row", 
                            cursor: "pointer", 
                            color: theme.palette.secondary.main,
                            '&:hover': {
                                color: hex2rgb(theme.palette.secondary.main, "80").rgb,
                            }
                        }}
                        onClick={()=>{
                            // ! hide pricing container when variant options exist
                            console.log("hide Pricing container")
                            setVariant((prev) => ({
                                ...prev,
                                variantOptionValues: [{name: "", values: []}] as VariantOption[]
                            }))
                        }}
                    >
                        <Add sx={{mr: 2}} />
                        <Typography> Add Options like size or color</Typography>
                    </FlexBetween>
                }
                {/* WORK IN PROGRESS */}
                {variant.variantOptionValues.length > 0 && 
                    <>
                        <FlexBetween sx={{width: "100%", p: "10px 0", m:"0 25px 0 25px"}}>
                            <Stack spacing={1} sx={{ width: "100%" }}>
                                {variant.variantOptionValues.map((item, index) => {
                                    return (
                                        <Box key={index}>
                                            {/* Option Name */}
                                            <Typography sx={{color: theme.palette.text.secondary}} >{`Option Name ${index + 1}`}</Typography>
                                            <Stack direction="row">
                                                <FormControl fullWidth sx={{marginY: "24px"}}>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={item.name}
                                                        placeholder="Name"
                                                        required
                                                        onChange={(e) => {
                                                            setVariant((prev) => ({ 
                                                                ...prev,
                                                                variantOptionValues: prev.variantOptionValues.map((item1, index1) => 
                                                                    index1 === index 
                                                                        ? {name: e.target.value, values: item1.values}
                                                                        : item1
                                                                )
                                                            })); 
                                                        }}
                                                    >
                                                        {VARIANT_OPTION_NAMES.map((optionName, index) => {
                                                            if(!variant.selectedOptionNames.includes(optionName)){
                                                                return <MenuItem key={index} value={optionName}>{optionName}</MenuItem>
                                                            } else {
                                                                return <MenuItem key={index} value={optionName} disabled>{optionName}</MenuItem>
                                                            }
                                                        })}
                                                    </Select>
                                                </FormControl>
                                                <IconButton 
                                                    edge="end" 
                                                    aria-label="trash" 
                                                    sx={{ml: 1}} 
                                                    disableRipple 
                                                    onClick={()=>{
                                                        setVariant((prev) => ({ 
                                                            ...prev,
                                                            variantOptionValues: [...prev.variantOptionValues.filter((item1, index1) => index1 !== index)],
                                                        })); 
                                                    }}
                                                >
                                                    <DeleteOutlineOutlined sx={{color:theme.palette.text.secondary}} />
                                                </IconButton>
                                            </Stack>
                                            <Typography sx={{color: theme.palette.text.secondary, mb: "24px !important"}}>Option Value</Typography>
                                            {/* Option Values */}
                                            <List dense={false} sx={{mt: "0 !important", pb: "0 !important", pt: "0 !important"}}>
                                                {item.values.map((item2, index2) => {
                                                    return(
                                                        <ListItem
                                                            key = {index2}
                                                            sx={{ 
                                                                backgroundColor: theme.palette.mode === "dark" 
                                                                    ? hex2rgb(theme.palette.primary.dark, "25").rgb 
                                                                    : hex2rgb(theme.palette.primary.light, "25").rgb, 
                                                                mb: "5px",
                                                                borderRadius: "8px"
                                                            }}
                                                            secondaryAction={
                                                                <IconButton 
                                                                    edge="end" 
                                                                    aria-label="delete"
                                                                    onClick={()=>{
                                                                        setVariant((prev) => ({
                                                                            ...prev,
                                                                            variantOptionValues: prev.variantOptionValues.map((item1, index1) => 
                                                                                index1 === index 
                                                                                    ? {name: item1.name, values: item1.values.filter((value, index3) => index3 !== index2)}
                                                                                    : item1
                                                                            )
                                                                        })); 
                                                                        variantOptionChangeType.current = "delete";
                                                                    }}
                                                                >
                                                                    <Close sx={{color:theme.palette.text.secondary}} />
                                                                </IconButton>
                                                            }
                                                        >
                                                            <ListItemText primary={item2}/>
                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                            {/* INPUT */}
                                            <Box sx={{ mb: "24px"}}>
                                                <OptionValueInput variantOptionChangeType={variantOptionChangeType} index={index} setVariant={setVariant}/>
                                            </Box>
                                            {index < variant.variantOptionValues.length -1 && 
                                                <Divider sx={{mt: "10px", mb: "5px"}}>
                                                    <StarBorder fontSize="small" sx={{color: hex2rgb(theme.palette.primary.light, '100').rgb}} />
                                                    <StarBorder sx={{color: hex2rgb(theme.palette.primary.light, '100').rgb}} />
                                                    <StarBorder fontSize="small" sx={{color: hex2rgb(theme.palette.primary.light, '100').rgb}} />
                                                </Divider>
                                            }
                                        </Box>
                                    )
                                })}
                            </Stack>
                        </FlexBetween>
                        {variant.variantOptionValues.length < VARIANT_OPTION_NAMES.length &&
                            <>
                                <Divider sx={{marginY: "10px", width: "100%"}}/>
                                <FlexBetween 
                                    sx={{
                                        width: "100%", 
                                        m:"14px 25px 14px 25px",
                                        flexDirection: "row", 
                                        cursor: "pointer", 
                                        color: theme.palette.secondary.main,
                                        '&:hover': {
                                            color: hex2rgb(theme.palette.secondary.main, "80").rgb,
                                        }
                                    }}
                                    onClick={()=>{
                                        setVariant((prev) => ({
                                            ...prev,
                                            variantOptionValues: [...prev.variantOptionValues, {name: "", values: []}] as VariantOption[]
                                        }))
                                    }}
                                >
                                    <Add sx={{mr: 2}} />
                                    <Typography> Add another option</Typography>
                                </FlexBetween>
                            </>
                            
                        }
                        {variant.variantOptionValues[0].values.length > 0 && 
                            <ProductOptionDataGrid variantOptionValuesParent={variant.variantOptionValues} variantOptionChangeType={variantOptionChangeType} />
                        }
                    </>
                }
            </FlexBetween>
        </FlexContainer>
    )
}
export default memo(ProductVariant);