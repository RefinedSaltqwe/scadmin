import { Box, Typography, FormGroup, FormControlLabel, Checkbox, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FlexContainer from '../ScapComponents/FlexContainer';
import ScapPrimaryTextField from '../ScapComponents/PrimaryTextField';
import { useRecoilState } from 'recoil';
import { productState } from '@/atoms/productsAtom';

type InventoryProps = {
    
};

interface InventoryDetails {
    sku: string;
    barcode: string;
    trackQuantity: boolean;
    continueSelling: boolean;
}

const Inventory:React.FC<InventoryProps> = () => {

    const theme = useTheme();
    const [productValue, setProductValue] = useRecoilState(productState);
    const [inventory, setInventory] = useState<InventoryDetails>({
        sku: "",
        barcode: "",
        trackQuantity: true,
        continueSelling: false
    });

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInventory((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }

    useEffect(()=>{
        let timer = setTimeout(()=>{
            console.log("set inventory");
            setProductValue((prev) => ({
                ...prev,
                product: {
                    ...prev.product,
                    sku: inventory.sku,
                    barcode: inventory.barcode,
                    trackQuantity: inventory.trackQuantity,
                    continueSelling: inventory.continueSelling
                }
            }))
        }, 2000);

        return () => {
            clearTimeout(timer);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inventory]);

    //Pre-set
    useEffect(()=>{
        setInventory({
            sku: productValue.product.sku,
            barcode: productValue.product.barcode,
            trackQuantity: productValue.product.trackQuantity,
            continueSelling: productValue.product.continueSelling,
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    return (
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
                    <ScapPrimaryTextField type="text" label="Barcode (ISBN, UPC, GTIN, etc.)" name="barcode" onChange={onChange}/>
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
                    <FormControlLabel 
                        control={
                            <Checkbox 
                                defaultChecked 
                                onChange={(e) => {
                                    setInventory((prev) => ({
                                        ...prev,
                                        trackQuantity: e.target.checked
                                    }))
                                }}
                            />
                        } 
                        label="Track quantity" 
                    />
                    <FormControlLabel 
                        control={
                            <Checkbox 
                                onChange={(e) => {
                                    setInventory((prev) => ({
                                        ...prev,
                                        continueSelling: e.target.checked
                                    }))
                                }}
                            />
                        } 
                        label="Continue selling when out of stock" 
                    />
                </FormGroup>    
            </Box>
        </FlexContainer>
    )
}
export default Inventory;