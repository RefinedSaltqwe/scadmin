import { Autocomplete, TextField, Theme, styled } from '@mui/material';
import React, { memo } from 'react';

type ProductCategoryProps = {
    optionValues: {
        title: string;
        year: number;
    }[];
    theme: Theme;
};

const GroupHeader = styled('div')(({ theme }) => ({

    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.text.primary,
    fontWeight: 600,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.primary.dark
        : theme.palette.primary.light
}));

const GroupItems = styled('ul')({
    padding: 0,
});

const ProductCategory:React.FC<ProductCategoryProps> = ({ optionValues, theme }) => {

    const options = optionValues.map((option) => {
        const firstLetter = option.title[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
    });
    return (
        <Autocomplete
            id="product-category"
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            isOptionEqualToValue={(option, value) => option.title === value.title}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            sx={{ m: "24px 0 10px 0" }}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Product Category" />}
            renderGroup={(params) => (
                <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                </li>
            )}
            noOptionsText={"No results found."}
        />
    )
}
export default memo(ProductCategory);