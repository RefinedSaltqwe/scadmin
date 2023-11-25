import { HelpOutline } from '@mui/icons-material';
import { Box, Typography, TextField, InputAdornment, Tooltip, FormGroup, FormControlLabel, Checkbox, Divider, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FlexBetween from '../ScapComponents/FlexBetween';
import FlexContainer from '../ScapComponents/FlexContainer';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import { CurrencyNumericFormat } from '@/pages/scenes/products/list/create';
import { useRecoilState } from 'recoil';
import { productState } from '@/atoms/productsAtom';

type PricingProps = {
    
};

interface PricingInterface {
    price: string;
    comparePrice: string;
    productTax: boolean;
    productTaxValue: string;
}

const Pricing:React.FC<PricingProps> = () => {

    const theme = useTheme();
    const { isMobile } = useMediaQueryHook();
    const [productValue, setProductValue] = useRecoilState(productState);
    const [pricing, setPricing] = useState<PricingInterface>({
        price: "",
        comparePrice: "",
        productTax: true,
        productTaxValue: "",
    });

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPricing((prev) => ({ 
            ...prev,
            [event.target.name]: event.target.value
        })); 
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            console.log("set pricing")
            setProductValue((prev) => ({
                ...prev,
                product: {
                    ...prev.product,
                    price: pricing.price,
                    comparePrice: pricing.comparePrice,
                    productTax: pricing.productTax,
                    taxPerItem: pricing.productTaxValue
                }
            }))
        }, 2000);
        return () => {
            clearTimeout(timer);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pricing])

    // Pre-set values
    useEffect(() => {
        setPricing(() => ({
            price: productValue.product.price,
            comparePrice: productValue.product.comparePrice,
            productTax: productValue.product.productTax,
            productTaxValue: productValue.product.taxPerItem
        }))
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
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
                        name="price"
                        placeholder='0.00'
                        value={pricing.price}
                        onChange={onChange}
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
                        name="comparePrice"
                        placeholder='0.00'
                        value={pricing.comparePrice}
                        onChange={onChange}
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
                    <FormControlLabel 
                        label="Charge tax on this product" 
                        name="productTax"
                        control={
                            <Checkbox 
                                defaultChecked 
                                onChange={(e) => {
                                    setPricing((prev) => ({ 
                                        ...prev,
                                        [e.target.name]: e.target.checked
                                    })); 
                                }} 
                            />
                        } 
                    />
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
                        name="productTaxValue"
                        placeholder='0.00'
                        value={pricing.productTaxValue}
                        onChange={onChange}
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
    )
}
export default Pricing;