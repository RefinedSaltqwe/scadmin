import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';
import { Autocomplete, Checkbox, TextField, Button, Theme } from '@mui/material';
import React, { memo } from 'react';

type CollectionsInputProps = {
    optionValues: {
        title: string;
        year: number;
    }[];
    theme: Theme;
};

const CollectionsInput:React.FC<CollectionsInputProps> = ({ optionValues, theme }) => {
    
    return (
        <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            sx={{ mb: "10px !important" }}
            onChange={(event, newValue) => {
                console.log(newValue)
            }}
            options={optionValues} 
            disableCloseOnSelect
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.title === value.title}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        icon={<CheckBoxOutlineBlank />}
                        checkedIcon={<CheckBox  sx={{color: theme.palette.secondary.main}} />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option.title}
                </li>
            )}
            limitTags={2}
            fullWidth
            style={{  }}
            renderInput={(params) => (
                <TextField {...params} label="Collections" placeholder="Choose collections" />
            )}
            noOptionsText={
                <Button sx={{ color: theme.palette.text.primary, width: "100%", textAlign: "start" }} onClick={() => {
                    console.log(`Navigate to create collection`)
                }}>
                    Create Collection
                </Button>
            }
        />
    )
}
export default memo(CollectionsInput);