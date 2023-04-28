import FlexBetween from '@/components/ScapComponents/FlexBetween';
import Header from '@/components/ScapComponents/Header';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import { auth } from '@/firebase/clientApp';
import useNavigation from '@/hooks/useNavigation';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { Avatar, Box, Chip, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography, useTheme } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { DataGrid, GridEventListener, GridRowSelectionModel, GridToolbar } from "@mui/x-data-grid";
import Image from 'next/image';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

type ProductsListProps = {
    
};

function Status(params: any){
    const { hex2rgb } = useRgbConverter();
    const { item } = params;
    let color: any;
    
    if(item.status === 'Draft'){
        color = red[500];
    }else if(item.status === 'Active'){
        color = green[500];
    }

    return (
        <Tooltip title={item.status}>
            <Chip 
                label={item.status} 
                size="small" 
                sx={{
                    color: color, 
                    letterSpacing: "0.2px",
                    backgroundColor: hex2rgb(color, '7').rgb, 
                    textTransform: "uppercase", 
                    fontWeight: 600
                }} 
            />
        </Tooltip>
    )
}

function Product(params: any){
    const { item, navigatePage } = params;
    const [user] = useAuthState(auth);

    return(
        <FlexBetween sx={{height:"100%", width: "100%", cursor: "pointer"}} onClick={()=>navigatePage(`/scenes/products/list/u=${user?.uid}=productKey=${item.id}`)}>
            <List sx={{display: "flex", alignItems: "center", cursor: "pointer"}}>
                <ListItem>
                    <ListItemAvatar sx={{width: "10%"}} >
                        <Avatar variant="rounded" >
                            <Image src="/assets/img/avatar-anika-visser.png" alt="Product Photo" width={40} height={40} loading='lazy'/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                        sx={{width: "55%"}} 
                        primary={
                            <Typography sx={{cursor: "pointer", textDecoration: "none", '&:hover':{textDecoration: "underline"}}}>
                                {item.product}
                            </Typography>
                        } 
                    />
                </ListItem>
            </List>
        </FlexBetween>
    )
}

function Inventory(params: any){
    const { item } = params;
    let color: any;

    if(item.inventory < 5){
        color = red[500];
    } else {
        color = green[500];
    }

    return(
        <Typography sx={{color: color}}>
            {`${item.inventory} in stock`}
        </Typography>
    )
}

function createColumns(params: any) {
    const { actionsProps } = params;
    return [
        { 
            field: "product", 
            headerName: "Product", 
            minWidth: 150, 
            flex: 1,
            renderCell: (params: any) => {
                return <Product item={params.row}  {...actionsProps}/>
            }
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 200,
            flex: 0,
            renderCell: (params: any) => {
                return <Status item={params.row}/>;
            }
        },
        { 
            field: "inventory", 
            headerName: "Inventory", 
            minWidth: 250, 
            flex: 0,
            renderCell: (params: any) => {
                return <Inventory item={params.row}/>;
            }
        },
        { field: "type", headerName: "Type", minWidth: 150},
    ];
}

const ProductsList:React.FC<ProductsListProps> = () => {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { hex2rgb } = useRgbConverter();
    const { navigatePage } = useNavigation();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const onEdit = React.useCallback((val: string) => {
        console.log("edit: ", val);
    }, []);

    const onDelete = React.useCallback(() => {
        console.log("delete");
    }, []);

    const rows = [
        { id: 1421, product: "Product Name 1", status: "Active", inventory: 0, type: 'Clothing' },
        { id: 24124, product: "Product Name 2", status: "Draft", inventory: 1, type: 'Sweater' },
        { id: 3124, product: "Product Name 3", status: "Active", inventory: 3, type: 'Jeans' },
        { id: 4124, product: "Product Name 4", status: "Draft", inventory: 10, type: 'Hat' }
    ];

    const columns = React.useMemo(() => {
        return createColumns({
        actionsProps: {
            onEdit,
            onDelete,
            navigatePage
        },
        rowCount: rows.length
        });
    }, [onEdit, onDelete, navigatePage, rows.length]);

    console.log(rowSelectionModel)
    
    return (
        <FlexBetween sx={{width: "100%", height:"90%", justifyContent: "center"}} >
        <FlexBetween mb="20px" sx={{width: "100%", height:"100%", alignItems: "flex-start", maxWidth: "1440px"}}>
            {/* HEADER */}
            <FlexBetween sx={{flexDirection: "row", width: "inherit", flexGrow: 0}}>
                <Box sx={{flexGrow: 1}}>  
                    <Header title="Products"/>
                </Box>
                <Box sx={{flexGrow: 0, height: "inherit"}}>  
                    <ScapPrimaryButton onClick={()=>{navigatePage(`orders/createorder`)}} color="primary" variant="contained" sx={{padding: "5px 13px 5px 13px"}} >
                        Add Product
                    </ScapPrimaryButton>
                </Box>
            </FlexBetween>
            {/* BODY */}
            <FlexBetween m="25px 0 0 0" sx={{width: "100%", height: "100%", flexDirection: "column", flexGrow: 1}}>
                <Box
                    sx={{
                        flexGrow: 1,
                        width: "inherit",
                        "& .MuiDataGrid-root": {
                        border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderTop:  'none',
                            borderBottom: `1px ${hex2rgb(theme.palette.primary.light, "50").rgb} solid !important`,
                            fontSize: "13px",
                            cursor:"pointer"
                        },
                        "& .name-column--cell": {
                            color: colors.greenAccent[700],
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.dark : hex2rgb(theme.palette.primary.light, "60").rgb,
                            borderColor: hex2rgb(theme.palette.primary.light, "50").rgb,
                            borderBottom: "none",
                            fontWeight: 900,
                            textTransform: "uppercase",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: theme.palette.background.default,
                        },
                        "& .MuiDataGrid-row.Mui-selected": {
                            backgroundColor: hex2rgb(theme.palette.primary.light, "10").rgb,
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop:  `none`,
                            borderBottom: "none",
                            backgroundColor: theme.palette.primary.main,
                        },
                        "& .MuiCheckbox-root": {
                            color: `${colors.greenAccent[600]} !important`,
                        },
                        
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `${colors.grey[100]} !important`,
                        },
                        '& .MuiDataGrid-main .MuiButtonBase-root.MuiCheckbox-root': {
                            color: `${theme.palette.secondary.main} !important`
                        }
                    }}
                >
                <DataGrid
                    loading={false}
                    checkboxSelection={true} 
                    rowHeight={85} 
                    disableRowSelectionOnClick 
                    rows={rows} 
                    columns={columns}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                      }}
                    rowSelectionModel={rowSelectionModel}
                    componentsProps={{
                        panel: {
                            sx: {
                                '& .MuiTypography-root': {
                                    color: colors.grey[100],
                                },
                                '& .MuiInputLabel-root.Mui-focused':{
                                    color: theme.palette.secondary.main
                                },
                                '& .MuiDataGrid-paper': {
                                    backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.main : "#efefef",
                                },
                                "& .MuiButtonBase-root.MuiSwitch-switchBase.Mui-checked":{
                                    color: theme.palette.secondary.main,
                                },
                                "& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
                                    backgroundColor: theme.palette.secondary.main
                                },
                                "& .MuiInput-root:after": {
                                    borderBottom: `2px ${theme.palette.secondary.main} solid` 
                                },
                                "& .MuiDataGrid-panelFooter .MuiButtonBase-root.MuiButton-root":{
                                    color: theme.palette.secondary.main
                                }
                            },
                        },
                    }}
                />
                </Box>
                <Box sx={{flexGrow: 0, height: "10px", width: "100%"}}></Box>
            </FlexBetween>
        </FlexBetween>
        </FlexBetween>
    )
}
export default ProductsList;