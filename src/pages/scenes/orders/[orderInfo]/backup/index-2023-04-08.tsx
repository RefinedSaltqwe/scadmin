import FlexBetween from '@/components/ScapComponents/FlexBetween';
import Header from '@/components/ScapComponents/Header';
import ScapPrimaryButton from '@/components/ScapComponents/PrimaryButton';
import { Add } from '@mui/icons-material';
import { Box, useTheme, Typography, Button } from '@mui/material';
import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { tokens } from '@/mui/theme';
import { TouchRippleActions } from '@mui/material/ButtonBase/TouchRipple';
import useRgbConverter from '@/hooks/useRgbConverter';
 
type OrderProps = {

}
function DropdownMenu(params: any) {
  const { item, onEdit, onDelete } = params;
  return <div>{item.id}</div>;
}

function createColumns(params: any) {
  const { actionsProps, rowCount } = params;
  return [
    { field: "username", headerName: `${rowCount} rows` },
    { field: "age" },
    {
      field: "customActions",
      width: 200,
      renderCell: (params: any) => {
        return <DropdownMenu item={params.row} {...actionsProps} />;
      }
    }
  ];
}

const Orders:React.FC<OrderProps> = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { hex2rgb } = useRgbConverter();

    const onEdit = React.useCallback(() => {
      console.log("edit");
    }, []);
  
    const onDelete = React.useCallback(() => {
      console.log("delete");
    }, []);
  
    const rows = [
      { id: 1, username: "@MUI", age: 20 },
      { id: 2, username: "@MUI2", age: 30 }
    ];
  
    const columns = React.useMemo(() => {
      return createColumns({
        actionsProps: {
          onEdit,
          onDelete
        },
        rowCount: rows.length
      });
    }, [onEdit, onDelete, rows.length]);
    
    return (
        <FlexBetween mb="20px" sx={{width: "100%"}}>
            {/* HEADER */}
            <FlexBetween sx={{flexDirection: "row", width: "inherit"}}>
                <Box sx={{flexGrow: 1}}>  
                    <Header title="Orders" subtitle="Manage the orders." />
                </Box>
                <Box sx={{flexGrow: 0, height: "inherit"}}>  
                    <ScapPrimaryButton color="primary" variant="contained" sx={{padding: "5px 18px 5px 13px"}} >
                        <Add sx={{fontSize:"24px"}}/> Add
                    </ScapPrimaryButton>
                </Box>
            </FlexBetween>
            {/* BODY */}
            <FlexBetween sx={{width: "100%", height: "100%"}}>
                <Box
                    m="40px 0 0 0"
                    height="60vh"
                    sx={{
                    width: "inherit",
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderTop:  `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`,
                        borderBottom: "none"
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[700],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.background.default,
                        borderTop:  `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`,
                        borderBottom: "none"
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: theme.palette.background.default,
                    },
                    "& .MuiDataGrid-row.Mui-selected": {
                        backgroundColor: hex2rgb(theme.palette.primary.light, "10").rgb,
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop:  `1px ${hex2rgb(theme.palette.primary.light, "80").rgb} solid`,
                        borderBottom: "none",
                        backgroundColor: theme.palette.background.default,
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[600]} !important`,
                    },
                    "& .css-1ycxvqq-MuiSwitch-root .MuiSwitch-thumb":{
                        color: "#6a7081",
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                    }}
                >
                    <DataGrid rowHeight={65} checkboxSelection rows={rows} columns={columns}/>
                    {/* <DataGrid checkboxSelection rows={mockDataTeam} columns={columns} components={{BaseCheckbox: RoundDataGridCheckBox}}/> */}
                </Box>
            </FlexBetween>
        </FlexBetween>
    )
}
export default Orders;

//ServerProps