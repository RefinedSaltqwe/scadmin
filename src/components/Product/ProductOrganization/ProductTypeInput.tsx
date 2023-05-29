import { Autocomplete, TextField } from '@mui/material';
import React, { memo } from 'react';

type ProductTypeInputProps = {
    optionValues: {
        title: string;
        year: number;
    }[];
};

const ProductTypeInput:React.FC<ProductTypeInputProps> = ({ optionValues }) => {
    
    return (
        <Autocomplete
            id="product-type"
            sx={{ mb: "10px !important" }}
            freeSolo
            isOptionEqualToValue={(option, value) => option === value}
            options={optionValues.map((option) => option.title)}
            renderInput={(params) => <TextField {...params} label="Product Type" />}
        />
    )
}
export default memo(ProductTypeInput);