import { CurrencyNumericFormat } from '@/pages/scenes/products/list/create';
import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, TextField, Select, MenuItem, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FlexContainer from '../ScapComponents/FlexContainer';
import { useRecoilState } from 'recoil';
import { productState } from '@/atoms/productsAtom';

type ShippingProps = {
    
};

interface WeightState {
    shippingWeight: string;
    weightType: "kg" | "lb" | "oz" | "g";
    shippingType: "physical" | "digital";
}

const Shipping:React.FC<ShippingProps> = () => {
    
    const theme = useTheme();
    const [productValue, setProductValue] = useRecoilState(productState);
    const [shippingInfo, setShippingInfo] = useState<WeightState>({
        shippingWeight: '',
        weightType: 'kg',
        shippingType: "physical"
    });

    const handleShippingWeightInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
    };

    useEffect(()=>{
        let timer = setTimeout(() =>{
            console.log("set shipping");
            setProductValue((prev) => ({
                ...prev,
                product: {
                    ...prev.product,
                    shippingWeight: shippingInfo.shippingWeight,
                    weightType: shippingInfo.weightType,
                    shippingType: shippingInfo.shippingType
                }
            }))
        }, 2000);

        return () => {
            clearTimeout(timer);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[shippingInfo])

    //Pre-set
    useEffect(()=>{
        setShippingInfo({
            shippingWeight: productValue.product.shippingWeight,
            weightType: productValue.product.weightType,
            shippingType: productValue.product.shippingType,
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    return (
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
                    onChange={(e) => {
                        setShippingInfo((prev) => ({
                            ...prev,
                            shippingType: e.target.value as "physical" | "digital"
                        }));
                    }}
                >
                    <FormControlLabel value="physical" control={<Radio />} label="Physical Product"/>
                    <FormControlLabel value="digital" control={<Radio />} label="Digital Product or Service" />
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
                {shippingInfo.shippingType === "physical" ? (
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
                                    value={shippingInfo.weightType}
                                    name="weightMode"
                                    onChange={(e) => {setShippingInfo({
                                        ...shippingInfo,
                                        weightType: e.target.value as "kg" | "lb" | "oz" | "g",
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
    )
}
export default Shipping;