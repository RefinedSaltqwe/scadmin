import BrowseCustomer from '@/components/Modal/Orders/BrowseCustomer';
import BrowseProduct from '@/components/Modal/Orders/BrowseProduct';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import FlexContainer from '@/components/ScapComponents/FlexContainer';
import Header from '@/components/ScapComponents/Header';
import PageContentLayout from '@/components/ScapComponents/PageContent';
import ScapPrimaryTextField from '@/components/ScapComponents/PrimaryTextField';
import ScapSecondaryButton from '@/components/ScapComponents/SecondaryButton';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useNavigation from '@/hooks/useNavigation';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { Box, Divider, IconButton, List, ListItem, ListItemText, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';

type CreateOrderProps = {
    
};

const CreateOrder:React.FC<CreateOrderProps> = () => {

    const theme = useTheme();
    const { isMobile, isTablet } = useMediaQueryHook();
    const { navigatePage } = useNavigation();
    const [openBrowseCustomer, setOpenBrowseCustomer] = useState({
        open: false,
        text: ""
    });
    const [openBrowseProduct, setOpenBrowseProduct] = useState({
        open: false,
        text: ""
    });
    
    return (
        <FlexBetween sx={{width: "100%", height:"90%", justifyContent: "center"}} >
            <FlexBetween mb="20px" sx={{width: "100%", height:"100%", alignItems: "flex-start", maxWidth: "1440px"}}>
                {/* MODALS */}
                <BrowseProduct setOpen={setOpenBrowseProduct}  open={openBrowseProduct} />
                <BrowseCustomer setOpen={setOpenBrowseCustomer} open={openBrowseCustomer} />
                {/* HEADER */}
                <FlexBetween sx={{flexDirection: "row", width: "inherit", flexGrow: 0, mb: 3}}>
                    <Box sx={{flexGrow: 1}}>  
                        <IconButton 
                            size="large" 
                            aria-label="Back" 
                            color="inherit" 
                            sx={{}}
                            onClick={() => {navigatePage("/scenes/orders")}}
                        >
                            <ArrowBackIosOutlined sx={{fontSize: 18, color: theme.palette.text.secondary}}/>
                        </IconButton>
                        <Header title="Create Order"/>
                    </Box>
                </FlexBetween>
                {/* BODY */}
                <Box sx={{m: isMobile ? "25px 0 0 0" : "5px 0 0 0 ", width: "100%"}}>
                    <PageContentLayout leftWidth="60%" rightWidth="40%" pageType="noHeight">
                        {/* LEFT */}
                        <FlexBetween sx={{width: "100%", mr: isMobile ? 3 : 0}} >
                            <FlexContainer>
                                {/* HEADER */}
                                <FlexBetween>
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Products</Typography>
                                        </Box>
                                    </Box>
                                </FlexBetween>
                                {/* Body */}
                                <FlexBetween sx={{ width: "100%"}}>
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        {/* SEARCH */}
                                        <FlexBetween sx={{margin: "20px 7px 20px 0px", width:"100%", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1}}>
                                                <ScapPrimaryTextField type="text" resetValue={openBrowseProduct.text} label="Search products" name="search" onChange={(e)=>{
                                                    setOpenBrowseProduct({open: true, text: e.target.value})
                                                }} />
                                            </Box>
                                            <Box sx={{flexGrow: 0}}>
                                                <ScapSecondaryButton onClick={()=>{setOpenBrowseProduct({open: true, text: ""})}} color="primary" variant="contained" sx={{ml: 2}} >
                                                Browse
                                                </ScapSecondaryButton>
                                            </Box>
                                        </FlexBetween>
                                    </Box>
                                </FlexBetween>
                            </FlexContainer>
                            {/* PAID CONTAINER */}
                            <FlexContainer>
                                    {/* HEADER */}
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Payment</Typography>
                                        </Box>
                                    </Box>
                                    {/* BODY */}
                                    <Box>
                                        <List sx={{ width: '100%' }}>
                                            {/* SUBTOTAL */}
                                            <ListItem sx={{p: "15px 0 0 0"}}>
                                                <ListItemText sx={{width: "25%"}} primary="Subtotal"/>
                                                {isTablet && 
                                                    <>
                                                        <ListItemText sx={{width: "50%"}} primary={<Typography >{`$0.00`}</Typography>} />
                                                        <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end"}} primary={<Typography>{`$0.00`}</Typography>} />
                                                    </>
                                                }
                                            </ListItem>
                                            
                                            {!isTablet && 
                                                <ListItem sx={{p: "15px 0 0 0"}}>
                                                    <ListItemText sx={{width: "50%"}} primary={<Typography >{`2 items`}</Typography>} />
                                                    <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end"}} primary={<Typography>{`$0.00`}</Typography>} />
                                                </ListItem>
                                            }
                                            {/* ADD DISCOUNT */}
                                            <ListItem sx={{p: "15px 0 0 0"}}>
                                                <ListItemText sx={{width: "25%", color: theme.palette.text.secondary}} primary="Add Discount"/>
                                                {isTablet && 
                                                    <>
                                                        <ListItemText sx={{width: "50%", color: theme.palette.text.secondary}} primary={<Typography >WELCOME10</Typography>} />
                                                        <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end", color: theme.palette.text.secondary}} primary={<Typography>{`$0.00`}</Typography>} />
                                                    </>
                                                }
                                            </ListItem>

                                            {!isTablet && 
                                                <ListItem sx={{p: "15px 0 0 0"}}>
                                                    <ListItemText sx={{width: "50%", color: theme.palette.text.secondary}} primary={<Typography>Local Delivery (0.02 kg)</Typography>} />
                                                    <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end", color: theme.palette.text.secondary}} primary={<Typography component={'span'}>{`$0.00`}</Typography>} />
                                                </ListItem>
                                            }
                                            {/* ADD SHIPPING */}
                                            <ListItem sx={{p: "15px 0 0 0"}}>
                                                <ListItemText sx={{width: "25%", color: theme.palette.text.secondary}} primary="Add Shipping"/>
                                                {isTablet && 
                                                    <>
                                                        <ListItemText sx={{width: "50%", color: theme.palette.text.secondary}} primary={<Typography >Local Delivery (0.02 kg)</Typography>} />
                                                        <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end", color: theme.palette.text.secondary}} primary={<Typography>{`$0.00`}</Typography>} />
                                                    </>
                                                }
                                            </ListItem>

                                            {!isTablet && 
                                                <ListItem sx={{p: "15px 0 0 0"}}>
                                                    <ListItemText sx={{width: "50%", color: theme.palette.text.secondary}} primary={<Typography>Local Delivery (0.02 kg)</Typography>} />
                                                    <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end", color: theme.palette.text.secondary}} primary={<Typography component={'span'}>{`$0.00`}</Typography>} />
                                                </ListItem>
                                            }
                                            {/* ESTIMATED TAX */}
                                            <ListItem sx={{p: "15px 0 0 0"}}>
                                                <ListItemText sx={{width: "25%", color: theme.palette.text.secondary}} primary="Estimated Tax"/>
                                                {isTablet && 
                                                    <>
                                                        <ListItemText sx={{width: "50%", color: theme.palette.text.secondary}} primary={<Typography >Not Calculated</Typography>} />
                                                        <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end", color: theme.palette.text.secondary}} primary={<Typography>{`$0.00`}</Typography>} />
                                                    </>
                                                }
                                            </ListItem>

                                            {!isTablet && 
                                                <ListItem sx={{p: "15px 0 0 0"}}>
                                                    <ListItemText sx={{width: "50%"}} primary={<Typography>Local Delivery (0.02 kg)</Typography>} />
                                                    <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end"}} primary={<Typography component={'span'}>{`$0.00`}</Typography>} />
                                                </ListItem>
                                            }
                                            {/* TOTAL */}
                                            <ListItem sx={{p: "15px 0 0 0"}}>
                                                <ListItemText sx={{width: "75%"}} primary={<Typography sx={{fontWeight: 700}}>Total</Typography>}/>
                                                <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end"}} primary={<Typography sx={{fontWeight: 700}} >{`$0.00`}</Typography>} />
                                            </ListItem>

                                            <Divider sx={{mt: "10px"}} />
                                        </List>
                                    </Box>
                                </FlexContainer>
                        </FlexBetween>
                        {/* RIGHT */}
                        <FlexBetween sx={{width: "100%"}} >
                            <FlexContainer>
                                {/* HEADER */}
                                <FlexBetween>
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Customer</Typography>
                                        </Box>
                                    </Box>
                                </FlexBetween>
                                {/* Body */}
                                <FlexBetween sx={{ width: "100%"}}>
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        {/* SEARCH */}
                                        <FlexBetween sx={{margin: "20px 7px 20px 0px", width:"100%", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1}}>
                                                <ScapPrimaryTextField type="text" resetValue={openBrowseCustomer.text} label="Search or create a customer" name="search" onChange={(e)=>{
                                                    setOpenBrowseCustomer({open: true, text: e.target.value})
                                                }} />
                                            </Box>
                                        </FlexBetween>
                                    </Box>
                                    {/* CUSTOMER INFO */}
                                    <Box width="100%">
                                        <List sx={{ width: '100%' }}>
                                            <ListItem sx={{p: "5px 0"}}>
                                                <ListItemText 
                                                    sx={{width: "55%"}} 
                                                    primary={
                                                        <>
                                                            <Typography sx={{cursor: "pointer", textDecoration: "underline", '&:hover':{textDecoration: "none"}}}>
                                                                Stephen Christian Pelagio
                                                            </Typography>
                                                            <Typography sx={{mt: "2px"}}>
                                                                1 order
                                                            </Typography>
                                                        </>
                                                    } 
                                                />
                                            </ListItem>
                                            <Divider sx={{mt: "10px"}} />
                                            <ListItem sx={{p: "5px 0"}}>
                                                <ListItemText 
                                                    sx={{width: "55%"}} 
                                                    primary={
                                                        <>
                                                            <Typography variant="h6" sx={{fontWeight: 600, mb: 1}}>
                                                                Contact Information
                                                            </Typography>
                                                            <Typography sx={{cursor: "pointer", textDecoration: "none", '&:hover':{textDecoration: "underline"}, mb: 1}}>
                                                                staphenpelagio@gmail.com
                                                            </Typography>
                                                            <Typography sx={{mt: "2px"}}>
                                                                {`+1 (639) 999 9934`}
                                                            </Typography>
                                                        </>
                                                    } 
                                                />
                                            </ListItem>
                                            <Divider sx={{mt: "10px"}} />
                                            <ListItem sx={{p: "5px 0"}}>
                                                <ListItemText 
                                                    sx={{width: "55%"}} 
                                                    primary={
                                                        <>
                                                            <Typography variant="h6" sx={{fontWeight: 600, mb: 1}}>
                                                                Shipping Address
                                                            </Typography>
                                                            <Typography sx={{ mb: 1}}>
                                                                Stephen Christian Pelagio
                                                                <br/>
                                                                4336 James Hill Rd
                                                                <br/>
                                                                Regina SK S4W 0R2
                                                                <br/>
                                                                Canada
                                                            </Typography>
                                                            
                                                            <Typography sx={{cursor: "pointer", textDecoration: "underline", '&:hover':{textDecoration: "none"}, mb: 1}}>
                                                                View Map
                                                            </Typography>
                                                        </>
                                                    } 
                                                />
                                            </ListItem>
                                            <Divider sx={{mt: "10px"}} />
                                            <ListItem sx={{p: "5px 0"}}>
                                                <ListItemText 
                                                    sx={{width: "55%"}} 
                                                    primary={
                                                        <>
                                                            <Typography variant="h6" sx={{fontWeight: 600, mb: 1}}>
                                                                Billing Address
                                                            </Typography>
                                                            <Typography sx={{ mb: 1}}>
                                                                Same as shipping address
                                                            </Typography>
                                                        </>
                                                    } 
                                                />
                                            </ListItem>
                                        </List>
                                    </Box>
                                </FlexBetween>
                            </FlexContainer>
                        </FlexBetween>
                    </PageContentLayout>
                </Box>
            </FlexBetween>
        </FlexBetween>
    )
}
export default CreateOrder;