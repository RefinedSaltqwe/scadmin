import FlexBetween from '@/components/ScapComponents/FlexBetween';
import Header from '@/components/ScapComponents/Header';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import { auth } from '@/firebase/clientApp';
import useNavigation from '@/hooks/useNavigation';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { Add } from '@mui/icons-material';
import { Box, Chip, List, ListItem, ListItemText, Tooltip, Typography, useTheme } from '@mui/material';
import { blue, green, orange, red } from '@mui/material/colors';
import { DataGrid, GridEventListener, GridToolbar } from "@mui/x-data-grid";
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
 
type OrderProps = {

}

function DropdownMenu(params: any) {
  const { item, onEdit, onDelete } = params;
  return (
    <ScapPrimaryButton color="primary" variant="contained" sx={{padding: "5px 18px 5px 13px"}} onClick={()=>onEdit(item.id)}>
        <Add sx={{fontSize:"24px"}}/> Edit
    </ScapPrimaryButton>
  )
}

function FullfillementStatus(params: any){
  const { hex2rgb } = useRgbConverter();
  const { item } = params;
  let color: any;
  if(item.fullfillmentStatus === 'Pending'){
    color = blue[500];
  } else if(item.fullfillmentStatus === 'Fulfilled'){
    color = green[500];
  } else if(item.fullfillmentStatus === 'Canceled'){
    color = orange[500];
  } else if(item.fullfillmentStatus === 'Unfulfilled'){
    color = red[500];
  }

  return (
    <Tooltip title={item.fullfillmentStatus}>
      <Chip 
        label={item.fullfillmentStatus} 
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

function PaymentStatus(params: any){
  const { hex2rgb } = useRgbConverter();
  const { item } = params;
  let color: any;
  if(item.paymentStatus === 'Partially Refunded'){
    color = blue[500];
  } else if(item.paymentStatus === 'Refunded'){
    color = orange[500];
  }else if(item.paymentStatus === 'Paid'){
    color = green[500];
  }

  return (
    <Tooltip title={item.paymentStatus}>
      <Chip 
        label={item.paymentStatus} 
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

function OrderDetails(params: any){
  const { item, navigatePage } = params;
  return(
    <FlexBetween sx={{height:"100%", width: "100%", cursor: "pointer"}} onClick={()=>navigatePage(`/scenes/orders/orderKey=${item.id}`)}>
      <Typography>{item.order}</Typography>
    </FlexBetween>
  )
}

function Date(params: any){
  const { item } = params;
  const theme = useTheme();
  const { hex2rgb } = useRgbConverter();
  
  return(
    <List sx={{display: "flex", alignItems: "center", cursor: "pointer"}}>
      <ListItem 
        sx={{
          display: "inline-block",
          width: "55px",
          backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.dark : hex2rgb(theme.palette.primary.light, "50").rgb, 
          p: "1px 10px", 
          borderRadius: "12px"
        }}    
      >
        <ListItemText 
          primary={<Typography variant="body1" sx={{textAlign: "center", textTransform: "uppercase", fontWeight: 700}}>Dec</Typography>} 
          secondary={<Typography variant="body1" sx={{textAlign: "center"}} >12</Typography>}
        />
      </ListItem>
      <ListItem sx={{ display:"inline-block " }} >
        <ListItemText 
          primary={<Typography variant="body1" sx={{textTransform: "uppercase", fontWeight: 500}}>2023</Typography>} 
          secondary="12:21am"
        />
      </ListItem>
    </List>
  )
}

function createColumns(params: any) {
  const { actionsProps, rowCount } = params;
  return [
    { 
      field: "order", 
      headerName: `Order`, 
      minWidth: 50,
    },
    { 
      field: "date", 
      headerName: "Date", 
      minWidth: 150, 
      flex: 1,
      renderCell: (params: any) => {
        return <Date item={params.row}/>
      }
    },
    { field: "customer", headerName: "Customer", minWidth: 150, flex: 1},
    { field: "total", headerName: "Total", minWidth: 50},
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      minWidth: 100,
      flex: 1,
      renderCell: (params: any) => {
        return <PaymentStatus item={params.row}/>;
      }
    },
    {
      field: "fullfillmentStatus",
      headerName: "Fullfillment Status",
      minWidth: 100,
      flex: 1,
      renderCell: (params: any) => {
        return <FullfillementStatus item={params.row}/>;
      }
    },
    // {
    //   field: "customActions",
    //   minWidth: 100,
    //   sortable: false,
    //   renderCell: (params: any) => {
    //     return <DropdownMenu item={params.row} {...actionsProps} />;
    //   }
    // },
  ];
}

const Orders:React.FC<OrderProps> = () => {

  const [user] = useAuthState(auth);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hex2rgb } = useRgbConverter();
  const { navigatePage } = useNavigation();

  const onEdit = React.useCallback((val: string) => {
    console.log("edit: ", val);
  }, []);

  const onDelete = React.useCallback(() => {
    console.log("delete");
  }, []);

  const rows = [
    { id: 1, order: "#1043", date: "Dec 2 at 12:21 am", customer: "Seth Euruba", total: "$29.99", paymentStatus: "Paid", fullfillmentStatus: 'Pending' },
    { id: 2, order: "#1044", date: "Nov 2 at 12:21 am", customer: "Christian Hidalgo", total: "$29.99", paymentStatus: "Refunded", fullfillmentStatus: 'Fulfilled' },
    { id: 3, order: "#1045", date: "Oct 2 at 12:21 am", customer: "Ric Ronan Grapa", total: "$29.99", paymentStatus: "Partially Refunded", fullfillmentStatus: 'Canceled' },
    { id: 4, order: "#1046", date: "Jul 2 at 12:21 am", customer: "Stephen Christian Pelagio", total: "$29.99", paymentStatus: "Paid", fullfillmentStatus: 'Unfulfilled' }
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

  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    navigatePage(`/scenes/orders/u=${user?.uid}=orderKey=${params.row.id}`)
  };
  
  return (
    <FlexBetween sx={{width: "100%", height:"90%", justifyContent: "center"}} >
      <FlexBetween mb="20px" sx={{width: "100%", height:"100%", alignItems: "flex-start", maxWidth: "1440px"}}>
          {/* HEADER */}
          <FlexBetween sx={{flexDirection: "row", width: "inherit", flexGrow: 0}}>
              <Box sx={{flexGrow: 1}}>  
                  <Header title="Orders" />
              </Box>
              <Box sx={{flexGrow: 0, height: "inherit"}}>  
                  <ScapPrimaryButton onClick={()=>{navigatePage(`/scenes/orders/createorder`)}} color="primary" variant="contained" sx={{padding: "5px 13px 5px 13px"}} >
                      Create Order
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
              }}
            >
              <DataGrid
                loading={false}
                checkboxSelection={false} 
                rowHeight={85} 
                disableRowSelectionOnClick 
                rows={rows} 
                columns={columns}
                slots={{
                  toolbar: GridToolbar,
                }}
                onRowClick={handleRowClick}
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
export default Orders;

//ServerProps