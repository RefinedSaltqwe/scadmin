import { AddCircleOutlined } from '@mui/icons-material';
import { Autocomplete, Button, TextField, Theme } from '@mui/material';
import React, { memo, useState } from 'react';

type TagsInputProps = {
    optionValues: {
        title: string;
        year: number;
    }[];
    theme: Theme;
};

const TagsInput:React.FC<TagsInputProps> = ({ optionValues, theme }) => {
    
    const [tagsRenderInput, setTagsRenderInput] = useState("");
    const [tags, setTags] = useState<any>([optionValues[0]]);
    
    return (
        <Autocomplete
            multiple
            id="tags-outlined"
            sx={{ mb: "10px !important" }}
            onChange={(event, newValue) => {
                setTags(newValue)
            }}
            // options={options100.map((option) => option.title)}
            options={optionValues}
            getOptionLabel={(option) => option.title}
            value={tags}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option.title === value.title}
            limitTags={2}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Tags"
                    placeholder="Find or create tags"
                    onChange={(e) => {setTagsRenderInput(e.target.value)}}
                />
            )}
            noOptionsText={
                <Button sx={{ color: theme.palette.text.primary, width: "100%", textAlign: "start" }} onClick={() => {
                    console.log(`'${tagsRenderInput}' has been added!`)
                }}>
                    <AddCircleOutlined sx={{mr: "5px"}} /> {` Add "${tagsRenderInput}"`}
                </Button>
            }
        />
    )
}
export default memo(TagsInput);