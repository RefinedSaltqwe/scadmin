import { Add } from '@mui/icons-material';
import { FormControl, OutlinedInput, InputAdornment, IconButton, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { VariantObject } from '../ProductVariant';

type OptionValueInputProps = {
    index: number;
    setVariant: (value: React.SetStateAction<VariantObject>) => void;
    variantOptionChangeType: React.MutableRefObject<string>;
};

const OptionValueInput:React.FC<OptionValueInputProps> = ({ index, setVariant, variantOptionChangeType }) => {

    const theme = useTheme();
    
    const [optionValue, setOptionValue] = useState({
        optionValue1: "",
        optionValue2: "",
        optionValue3: "",
        optionValue4: "",
    });
    let optionVal: string ="";
    if(index+1 === 1){
        optionVal = optionValue.optionValue1;
    } else if(index+1 === 2){
        optionVal = optionValue.optionValue2;
    } else if(index+1 === 3){
        optionVal = optionValue.optionValue3;
    }  else if(index+1 === 4){
        optionVal = optionValue.optionValue4;
    } 
    
    return (
        <FormControl variant="outlined" fullWidth sx={{ mt: "0 !important", mb: "0 !important"}}>
            <OutlinedInput
                id="outlined-adornment-delete-option"
                type="text"
                name={`optionValue${index+1}`}
                value={optionVal}
                onChange={(event) => {
                    setOptionValue({
                        ...optionValue,
                        [event.target.name]: event.target.value
                    })
                }}
                fullWidth
                endAdornment={
                    <>
                        {optionVal && 
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    sx={{
                                        borderRadius: "8px",
                                        mr: "0px",
                                        backgroundColor: theme.palette.secondary.main,
                                        "&:hover": {
                                            backgroundColor: theme.palette.secondary.main,
                                        }
                                    }}
                                    aria-label="add option value"
                                    onClick={() => {
                                        variantOptionChangeType.current = "add";
                                        setVariant((prev) => ({ 
                                            ...prev,
                                            variantOptionValues: prev.variantOptionValues.map((item1, index1) => 
                                                index1 === index 
                                                    ? {name: item1.name, values: [...item1.values, optionVal]}
                                                    : item1
                                            )
                                        })); 
                                        setOptionValue({
                                            ...optionValue,
                                            [`optionValue${index+1}`]: ""
                                        })
                                    }}
                                    edge="end"
                                >
                                    <Add sx={{color: theme.palette.primary.contrastText}} />
                                </IconButton>
                            </InputAdornment>
                        }
                    </>
                }
                placeholder="Add Value"
            />
        </FormControl>
    )
}
export default OptionValueInput;