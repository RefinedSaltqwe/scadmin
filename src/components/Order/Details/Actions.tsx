import FlexBetween from '@/components/ScapComponents/FlexBetween';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import { ListItem, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, useTheme } from '@mui/material';
import React, { memo } from 'react';

type ActionsProps = {
    
};

const Actions:React.FC<ActionsProps> = () => {
    
    const theme = useTheme();
    const [fulfillmentStatus, setFulfillmentStatus] = React.useState("Unfulfilled");
    const [paymentStatus, setPaymentStatus] = React.useState("Paid");

    const handleFulfillmentStatusChange = (event: SelectChangeEvent) => {
        setFulfillmentStatus(event.target.value as string);
    };

    const handlePaymentStatusChange = (event: SelectChangeEvent) => {
        setPaymentStatus(event.target.value as string);
    };
    
    return (
        <>
            <ListItem>
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
                            id="demo-simple-fulfillment-status"
                        >
                            Fulfillment Status
                        </InputLabel>
                        <Select
                            labelId="demo-simple-fulfillment-status"
                            id="demo-simple-select"
                            value={fulfillmentStatus}
                            label="Fulfillment Status"
                            onChange={handleFulfillmentStatusChange}
                            sx={{borderRadius: "8px", width: "100%"}}
                        >
                            <MenuItem value="Unfulfilled">Unfulfilled</MenuItem>
                            <MenuItem value="Fulfilled">Fulfilled</MenuItem>
                            <MenuItem value="Canceled">Canceled</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                        </Select>
                    </FlexBetween>
                </FormControl>
            </ListItem>
            <ListItem>
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
                            id="payment-status"
                        >
                            Payment Status
                        </InputLabel>
                        <Select
                            labelId="payment-status"
                            id="payment-status-select"
                            value={paymentStatus}
                            label="Payment Status"
                            onChange={handlePaymentStatusChange}
                            sx={{borderRadius: "8px", width: "100%"}}
                        >
                            <MenuItem value="Paid">Paid</MenuItem>
                            <MenuItem value="Refunded">Refunded</MenuItem>
                            <MenuItem value="Partially Refunded">Partially Refunded</MenuItem>
                        </Select>
                    </FlexBetween>
                </FormControl>
            </ListItem>
            <ListItem>
                <FlexBetween 
                    sx={{
                        width: "100%" ,
                        alignItems: "center",
                        justifyContent: "flex-end" 
                    }}
                >
                    <ScapPrimaryButton color="primary" variant="contained"  >
                        Save
                    </ScapPrimaryButton>
                </FlexBetween>
            </ListItem>
        </>
    )
}
export default memo(Actions);