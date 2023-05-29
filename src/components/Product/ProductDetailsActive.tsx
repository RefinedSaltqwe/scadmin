import { FormControl, InputLabel, ListItem, MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material';
import React from 'react';
import FlexBetween from '../ScapComponents/FlexBetween';

type ProductDetailsActiveProps = {
    
};

const ProductDetailsActive:React.FC<ProductDetailsActiveProps> = () => {

    const theme = useTheme();
    const [status, setStatus] = React.useState("Draft");

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };

    
    return (
        <ListItem sx={{p: 0}} >
            <FormControl 
                sx={{ 
                    m: "10px 0 10px 0",
                    display:"flex",
                    flexDirection: "row",
                    '&.MuiFormControl-root .MuiInputBase-root.Mui-focused fieldset': {
                        borderColor: theme.palette.secondary.main
                    },
                }}  
                fullWidth
            >
                <FlexBetween 
                    sx={{
                        width: "100%" ,
                        alignItems: "center", 
                    }}
                >   
                    <InputLabel 
                        sx={{
                            '&.MuiFormLabel-root.MuiInputLabel-root.Mui-focused': {
                                color:theme.palette.secondary.main,
                            },
                        }} 
                        id="demo-simple-select-label"
                    >
                        Status
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="Status"
                        onChange={handleStatusChange}
                        sx={{borderRadius: "8px", width: "100%"}}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Draft">Draft</MenuItem>
                    </Select>
                </FlexBetween>
            </FormControl>
        </ListItem>
    )
}
export default ProductDetailsActive;