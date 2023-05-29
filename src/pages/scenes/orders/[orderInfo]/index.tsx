import Actions from '@/components/Order/Details/Actions';
import LogTimeline from '@/components/Order/Details/Timeline';
import FlexBetween from '@/components/ScapComponents/FlexBetween';
import FlexContainer from '@/components/ScapComponents/FlexContainer';
import Header from '@/components/ScapComponents/Header';
import PageContentLayout from '@/components/ScapComponents/PageContent';
import ScapTextButton from '@/components/ScapComponents/TextButton';
import useMediaQueryHook from '@/hooks/useMediaQueryHook';
import useNavigation from '@/hooks/useNavigation';
import { tokens } from '@/mui/theme';
import { ArrowBackIosOutlined, CheckCircleOutlineOutlined, Circle, InventoryOutlined, LocalShippingOutlined } from '@mui/icons-material';
import { Avatar, Badge, Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography, useTheme } from '@mui/material';
import { green } from '@mui/material/colors';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

type OrderDetailsProps = {
    
};

const items = [
    {
        productName: "Some Product Name 1",
        details: "Large/Green",
        quantity: "2",
        price: "47.95"
    },
    {
        productName: "Some Product Name 2",
        details: "Large/Orange",
        quantity: "2",
        price: "49.99"
    },
    {
        productName: "Some Product Name 3",
        details: "Large/Orange",
        quantity: "1",
        price: "19.99"
    },
];

const OrderDetails:React.FC<OrderDetailsProps> = () => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { navigatePage } = useNavigation();
    const { isMobile, isTablet } = useMediaQueryHook();
    const [ toggleActions, setToggleActions ] = useState(false);
    const subTotal = useRef(0);
    const shipping = useRef(4.99);
    const quantity = useRef(0);
    const total = useRef(0);
    quantity.current = 0;
    subTotal.current = 0;
    shipping.current = 4.99;
    total.current = shipping.current;
    
    return (
        <FlexBetween sx={{width: "100%", height:"90%", justifyContent: "center"}} >
            <FlexBetween mb="20px" sx={{width: "100%", height:"100%", alignItems: "flex-start", maxWidth: "1440px"}}>
                {/* HEADER */}
                <FlexBetween sx={{flexDirection: "row", width: "100%", flexGrow: 0}}>
                <Box sx={{flexGrow: 1, display: "flex", flexDirection: "row"}}>  
                        <Box sx={{mr: 2}} >
                            <IconButton 
                                size="large" 
                                aria-label="Back" 
                                color="inherit" 
                                onClick={() => {navigatePage("/scenes/orders")}}
                            >
                                <ArrowBackIosOutlined sx={{fontSize: 18, color: theme.palette.text.secondary}}/>
                            </IconButton>
                        </Box>
                        <Header title="#1043" subtitle="December 2, 2022 at 12:21 am" />
                    </Box>
                    <Box sx={{flexGrow: isMobile ? 0 : 1, justifyContent: "center", display: "flex", height: "100%", p: "10px 0"}}> 
                        <Box sx={{flexGrow: 0, height: "inherit", ml: "5px"}}>  
                            <ScapTextButton color="primary" variant="text" sx={{padding: "5px 13px 5px 13px"}} >
                                Refund
                            </ScapTextButton>
                        </Box>
                        <Box sx={{flexGrow: 0, height: "inherit", ml: "5px"}}>  
                            <ScapTextButton color="primary" variant="text" sx={{padding: "5px 13px 5px 13px"}} >
                                Return
                            </ScapTextButton>
                        </Box>
                        <Box sx={{flexGrow: 0, height: "inherit", ml: "5px"}}>  
                            <ScapTextButton onClick={()=>{setToggleActions(prev => !prev)}} color="primary" variant="text" sx={{padding: "5px 13px 5px 13px"}} >
                                Edit
                            </ScapTextButton>
                        </Box>
                    </Box>
                </FlexBetween> 
                {/* BODY */}
                <Box sx={{m: isMobile ? "25px 0 0 0" : "5px 0 0 0 ", width: "100%"}}>
                    <PageContentLayout leftWidth="70%" rightWidth="30%" pageType="noHeight">
                        {/* LEFT */}
                        <FlexBetween sx={{width: "100%", height: "100%", alignItems: "flex-start" }} >
                            <FlexBetween sx={{width: "100%", pr: isMobile ? 3 : 0}} >
                                {/* Actions */}
                                {(!isMobile && toggleActions) && 
                                    <FlexContainer>
                                        {/* HEADER */}
                                        <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                                <Typography variant="h5" sx={{fontWeight: 600}}>Actions</Typography>
                                            </Box>
                                        </Box>
                                        {/* BODY */}
                                        <Box>
                                            <List sx={{ width: '100%' }}>
                                                <Actions/>
                                            </List>
                                        </Box>
                                    </FlexContainer>
                                }
                                {/* Fulfillment CONTAINER */}
                                <FlexContainer>
                                    {/* HEADER */}
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Box sx={{position: "relative", height: "100%", width: "inherit", display: "flex", alignItems: "center",mr: "5px", justifyContent: "center"}}>
                                                <CheckCircleOutlineOutlined sx={{ color: green[700], position: "absolute", zIndex: 201}} />
                                                <Circle sx={{fontSize: "23px", position: "absolute", zIndex: 200,color: theme.palette.primary.contrastText, stroke: theme.palette.mode === "dark" ? colors.greenAccent[300] : colors.greenAccent[700], strokeWidth: "4px"}} />
                                            </Box>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Fulfilled</Typography>
                                        </Box>
                                    </Box>
                                    {/* BODY */}
                                    <Box>
                                        <List sx={{ width: '100%' }}>
                                            <ListItem sx={{p: "5px 0"}}>
                                                <InventoryOutlined sx={{color: theme.palette.text.secondary}} />
                                                <ListItemText sx={{ml: "15px"}} primary="Fulfilled" secondary="December 27, 2022" />
                                            </ListItem>
                                            
                                            <ListItem sx={{p: "5px 0"}}>
                                                <LocalShippingOutlined sx={{color: theme.palette.text.secondary}} />
                                                <ListItemText sx={{ml: "15px"}} primary="Delivered on" secondary="Tuesday, December 27, 2022" />
                                            </ListItem>
                                            
                                            {items.map((item, index) => {
                                                const totalPrice = parseFloat(item.price)*parseInt(item.quantity);
                                                subTotal.current += totalPrice;
                                                quantity.current += parseInt(item.quantity);
                                                total.current += totalPrice;
                                                return( 
                                                    <Box key={index}>
                                                        {index > 0 && <Divider sx={{mt: "10px"}} />}
                                                        <ListItem sx={{p: "15px 0 0 0"}}>
                                                            <ListItemAvatar sx={{width: "10%"}} >
                                                                <Badge badgeContent={parseInt(item.quantity)} color="error" sx={{color: theme.palette.text.primary}}>
                                                                    <Avatar variant="rounded" >
                                                                        <Image src="/assets/img/avatar-anika-visser.png" alt="Product Photo" width={40} height={40} loading='lazy'/>
                                                                    </Avatar>
                                                                </Badge>
                                                            </ListItemAvatar>
                                                            <ListItemText 
                                                                sx={{width: "55%"}} 
                                                                primary={
                                                                    <Typography sx={{cursor: "pointer", textDecoration: "underline", '&:hover':{textDecoration: "none"}}}>
                                                                        {item.productName}
                                                                    </Typography>} 
                                                                secondary={
                                                                    <>
                                                                        <Typography component={'span'} variant="body2">{item.details}</Typography>
                                                                        {!isTablet && <><br/> <Typography component={'span'} variant="body1" sx={{color: theme.palette.text.primary}} >{`$${item.price} x ${item.quantity}`}</Typography></>}
                                                                    </>
                                                                } 
                                                            />
                                                            {isTablet && <ListItemText sx={{width: "20%", display: "flex", justifyContent: "flex-end"}} primary={<Typography>{`$${item.price} x ${item.quantity}`}</Typography>} />}
                                                            <ListItemText sx={{width: "15%", display: "flex", justifyContent: "flex-end"}} primary={<Typography>{`$${totalPrice.toFixed(2)}`}</Typography>} />
                                                        </ListItem>
                                                    </Box>
                                                )
                                            })}
                                            
                                        </List>
                                    </Box>
                                </FlexContainer>
                                {/* PAID CONTAINER */}
                                <FlexContainer>
                                    {/* HEADER */}
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Box sx={{position: "relative", height: "100%", width: "inherit", display: "flex", alignItems: "center",mr: "5px", justifyContent: "center"}}>
                                                <CheckCircleOutlineOutlined sx={{ color: green[700], position: "absolute", zIndex: 201}} />
                                                <Circle sx={{fontSize: "23px", position: "absolute", zIndex: 200,color: theme.palette.primary.contrastText, stroke: theme.palette.mode === "dark" ? colors.greenAccent[300] : colors.greenAccent[700], strokeWidth: "4px"}} />
                                            </Box>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Paid</Typography>
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
                                                        <ListItemText sx={{width: "50%"}} primary={<Typography >{`${quantity.current} ${quantity.current > 1 ? "items":"item"}`}</Typography>} />
                                                        <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end"}} primary={<Typography>{`$${subTotal.current.toFixed(2)}`}</Typography>} />
                                                    </>
                                                }
                                            </ListItem>
                                            
                                            {!isTablet && 
                                                <ListItem sx={{p: "15px 0 0 0"}}>
                                                    <ListItemText sx={{width: "50%"}} primary={<Typography >{`${quantity.current} ${quantity.current > 1 ? "items":"item"}`}</Typography>} />
                                                    <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end"}} primary={<Typography>{`$${subTotal.current.toFixed(2)}`}</Typography>} />
                                                </ListItem>
                                            }
                                            {/* SHIPPING */}

                                            <ListItem sx={{p: "15px 0 0 0"}}>
                                                <ListItemText sx={{width: "25%"}} primary="Shipping"/>
                                                {isTablet && 
                                                    <>
                                                        <ListItemText sx={{width: "50%"}} primary={<Typography >Local Delivery (0.02 kg)</Typography>} />
                                                        <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end"}} primary={<Typography>{`$${shipping.current.toFixed(2)}`}</Typography>} />
                                                    </>
                                                }
                                            </ListItem>

                                            {!isTablet && 
                                                <ListItem sx={{p: "15px 0 0 0"}}>
                                                    <ListItemText sx={{width: "50%"}} primary={<Typography>Local Delivery (0.02 kg)</Typography>} />
                                                    <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end"}} primary={<Typography component={'span'}>{`$${shipping.current.toFixed(2)}`}</Typography>} />
                                                </ListItem>
                                            }

                                            <ListItem sx={{p: "15px 0 0 0"}}>
                                                <ListItemText sx={{width: "75%"}} primary={<Typography sx={{fontWeight: 700}}>Total</Typography>}/>
                                                <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end"}} primary={<Typography sx={{fontWeight: 700}} >{`$${total.current.toFixed(2)}`}</Typography>} />
                                            </ListItem>

                                            <Divider sx={{mt: "10px"}} />

                                            <ListItem sx={{p: "15px 0 0 0"}}>
                                                <ListItemText sx={{width: "75%"}} primary="Paid by customer"/>
                                                <ListItemText sx={{width: "25%", display: "flex", justifyContent: "flex-end"}} primary={<Typography>{`$${total.current.toFixed(2)}`}</Typography>} />
                                            </ListItem>
                                        </List>
                                    </Box>
                                </FlexContainer>
                                {/* TIMELINE */}
                                {isMobile && 
                                    <FlexContainer>
                                        {/* HEADER */}
                                        <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                                <Typography variant="h5" sx={{fontWeight: 600}}>Timeline</Typography>
                                            </Box>
                                        </Box>
                                        <LogTimeline/>
                                    </FlexContainer>
                                }
                            </FlexBetween>
                        </FlexBetween>
                        {/* RIGHT */}
                        <FlexBetween sx={{width: "100%", height: "100%", alignItems: "flex-start"}} >
                            <FlexBetween sx={{width: "100%"}} >
                                {/* Actions */}
                                {(isMobile && toggleActions) && 
                                    <FlexContainer>
                                        {/* HEADER */}
                                        <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                                <Typography variant="h5" sx={{fontWeight: 600}}>Actions</Typography>
                                            </Box>
                                        </Box>
                                        {/* BODY */}
                                        <Box>
                                            <List sx={{ width: '100%' }}>
                                                <Actions/>
                                            </List>
                                        </Box>
                                    </FlexContainer>
                                }
                                {/* Note */}
                                <FlexContainer>
                                    {/* HEADER */}
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Notes</Typography>
                                        </Box>
                                    </Box>
                                    {/* BODY */}
                                    <Box>
                                        <List sx={{ width: '100%' }}>
                                            <ListItem sx={{p: "5px 0"}}>
                                                <ListItemText 
                                                    sx={{width: "55%"}} 
                                                    primary={
                                                        <>
                                                            <Typography sx={{mt: "2px"}}>
                                                                No notes from customer
                                                            </Typography>
                                                        </>
                                                    } 
                                                />
                                            </ListItem>
                                        </List>
                                    </Box>
                                </FlexContainer>
                                {/* Customer */}
                                <FlexContainer>
                                    {/* HEADER */}
                                    <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                            <Typography variant="h5" sx={{fontWeight: 600}}>Customer</Typography>
                                        </Box>
                                    </Box>
                                    {/* BODY */}
                                    <Box>
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
                                </FlexContainer>
                                {/* TIMELINE */}
                                {!isMobile && 
                                    <FlexContainer>
                                        {/* HEADER */}
                                        <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                                            <Box sx={{flexGrow: 1, display: "flex", alignItems: "center", width: "30px"}}>
                                                <Typography variant="h5" sx={{fontWeight: 600}}>Timeline</Typography>
                                            </Box>
                                        </Box>
                                        <LogTimeline/>
                                    </FlexContainer>
                                }
                            </FlexBetween>
                        </FlexBetween>
                    </PageContentLayout>
                </Box>
            </FlexBetween>
        </FlexBetween>
    )
}
export default OrderDetails;