import { Autocomplete, TextField } from '@mui/material';
import React, { memo } from 'react';

type ProductVendorInputProps = {
    optionValues: {
        title: string;
        year: number;
    }[];
};

const ProductVendorInput:React.FC<ProductVendorInputProps> = ({ optionValues }) => {
    
    return (
        <Autocomplete
            id="product-vendor"
            sx={{ mb: "10px !important" }}
            freeSolo
            isOptionEqualToValue={(option, value) => option === value}
            options={optionValues.map((option) => option.title)}
            renderInput={(params) => <TextField {...params} label="Vendor" />}
        />
    )
}
export default memo(ProductVendorInput);