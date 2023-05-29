import { Box, Divider, TextField, useTheme } from '@mui/material';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import FlexBetween from './FlexBetween';
import { DataGrid, GridRowSelectionModel, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from '@mui/x-data-grid';
import useRgbConverter from '@/hooks/useRgbConverter';
import { tokens } from '@/mui/theme';
import { VariantObject, VariantOption, VariantValue } from '../Product/ProductVariant';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { FormatProps } from '@/pages/scenes/products/list/[details]';

type ProductOptionDataGridProps = {
    variantOptionValuesParent: VariantOption[];
    variantOptionChangeType: React.MutableRefObject<string>;
};

interface VariantDataGrid {
    variantsDataGrid: VariantValue [];
}

const defaultVariantDataGrid: VariantDataGrid = {
    variantsDataGrid: []
}

const defaultVariantValue: VariantValue = {
    id: "",
    variantName: "",
    variantImage: "",
    variantPrice: "",
    variantComparePrice: "",
    variantAvailability: "",
    variantOnHand: "",
    variantSKU: "",
    variantBarcode: "",
}

function ProductToolBar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );
}

const CurrencyNumericFormat = React.forwardRef<NumericFormatProps, FormatProps>(
    function CurrencyNumericFormat(props, ref) {
        const { onChange, ...other } = props;
        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                valueIsNumericString
                prefix="$"
            />
        );
    },
);

function DataGridInput(params: any){
    const { item, setVariantDataGrid, fieldName } = params;
    const theme = useTheme();
    const { hex2rgb } = useRgbConverter();
    let value: any;
    let inputProps: any = {};
    let inputType: string = "text";
    let placeholder: string = "0";

    if(fieldName === "variantPrice"){
        value = item.variantPrice;
        placeholder = "$0.00";
        inputProps = {
            inputComponent: CurrencyNumericFormat as any,
        }
    } else if(fieldName === "variantComparePrice"){
        // ! logic if Compare Price is lower than Price
        value = item.variantComparePrice;
        placeholder = "$0.00";
        inputProps = {
            inputComponent: CurrencyNumericFormat as any,
        }
    } else if(fieldName === "variantSKU"){
        placeholder = "SKU";
        value = item.variantSKU;
    } else if(fieldName === "variantBarcode"){
        placeholder = "Barcode";
        value = item.variantBarcode;
    } else if (fieldName === "variantAvailability"){
        value = item.variantAvailability;
        inputType = "number"
    } else if (fieldName === "variantOnHand"){
        value = item.variantOnHand;
        inputType = "number";
    }

    return(
        <FlexBetween sx={{height:"100%", width: "100%", cursor: "pointer"}}>
            <TextField 
                fullWidth 
                id={`${item.id}-${fieldName}-adornment-amount`}
                value={value}
                name={fieldName}
                type={inputType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                    setVariantDataGrid((prev: VariantObject) => ({ 
                        ...prev,
                        variantsDataGrid: prev.variantsDataGrid.map((item1) => 
                            item1.id === item.id 
                                ? {...item1, [e.target.name]: e.target.value }
                                : item1
                        )
                    })); 
                }}
                onFocus={(e)=>{e.target.select()}}
                InputProps={{ 
                    ...inputProps
                }}
                placeholder={placeholder}
                onWheel={(e) => e.currentTarget.querySelector('input')?.blur()}
                sx={{ 
                    '& label.Mui-focused': {
                        color: theme.palette.secondary.main,
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            color: "white",
                            borderRadius: "8px",
                            borderColor: hex2rgb(theme.palette.primary.light, "80").rgb
                        },
                        '&:hover fieldset': {
                            backgroundColor: theme.palette.mode === "dark" ? hex2rgb(theme.palette.secondary.dark, "25").rgb : hex2rgb(theme.palette.primary.light, "25").rgb,
                            borderColor: hex2rgb(theme.palette.primary.light, "80").rgb
                        },
                        '&.Mui-focused fieldset': {
                            color: "white",
                            border: `3px solid ${theme.palette.secondary.main}`,
                        },
                        '&.mui-style-1p4l6zo-MuiInputBase-root-MuiOutlinedInput-root': {
                            color: theme.palette.text.primary
                        }
                    },
                }} 
            />
        </FlexBetween>
    )
}

function createColumns(params: any) {
    const { actionsProps } = params;
    return [
        { field: "variantName", headerName: "Variant Name", minWidth: 150},
        { 
            field: "variantPrice", 
            headerName: "Price", 
            minWidth: 150, 
            flex: 0,
            renderCell: (params: any) => {
                return <DataGridInput fieldName="variantPrice" item={params.row}  {...actionsProps}/>
            }
        },
        { 
            field: "variantComaprePrice", 
            headerName: "Compare-at Price", 
            minWidth: 150, 
            flex: 0,
            renderCell: (params: any) => {
                return <DataGridInput fieldName="variantComparePrice" item={params.row}  {...actionsProps}/>
            }
        },
        { 
            field: "variantAvailability", 
            headerName: "Available", 
            minWidth: 150, 
            flex: 0,
            renderCell: (params: any) => {
                return <DataGridInput fieldName="variantAvailability" item={params.row}  {...actionsProps}/>
            }
        },
        { 
            field: "variantOnHand", 
            headerName: "On Hand", 
            minWidth: 150, 
            flex: 0,
            renderCell: (params: any) => {
                return <DataGridInput fieldName="variantOnHand" item={params.row}  {...actionsProps}/>
            }
        },
        { 
            field: "variantSKU", 
            headerName: "SKU", 
            minWidth: 150, 
            flex: 0,
            renderCell: (params: any) => {
                return <DataGridInput fieldName="variantSKU" item={params.row}  {...actionsProps}/>
            }
        },
        { 
            field: "variantBarcode", 
            headerName: "Barcode", 
            minWidth: 150, 
            flex: 0,
            renderCell: (params: any) => {
                return <DataGridInput fieldName="variantBarcode" item={params.row}  {...actionsProps}/>
            }
        }
    ];
}

const variantObjectBuilder = (variantName: string) => {
    const variant: VariantValue = {
        ...defaultVariantValue,
        id: variantName,
        variantName: variantName,
    }
    return variant;
}

const variantDataGridBuilder = (variantOptionValues: VariantOption []) => {
    let variantOption: VariantValue [] = [];
    if(variantOptionValues.length > 0){
        variantOptionValues[0].values.forEach((optionValue1) => {
            if(variantOptionValues.length === 1){
                const variantName = optionValue1;
                variantOption.push(variantObjectBuilder(variantName));
            } else if(variantOptionValues.length === 2){
                if(variantOptionValues[1].values.length > 0){
                    variantOptionValues[1].values.forEach((optionValue2) => {
                        const variantName = `${optionValue1}/${optionValue2}`;
                        variantOption.push(variantObjectBuilder(variantName));
                    });
                } else {
                    const variantName = optionValue1;
                    variantOption.push(variantObjectBuilder(variantName));
                }
            } else if(variantOptionValues.length === 3) {
                variantOptionValues[1].values.forEach((optionValue2) => {
                    if(variantOptionValues[2].values.length > 0){
                        variantOptionValues[2].values.forEach((optionValue3) => {
                            const variantName = `${optionValue1}/${optionValue2}/${optionValue3}`;
                            variantOption.push(variantObjectBuilder(variantName));
                        })
                    } else {
                        const variantName = `${optionValue1}/${optionValue2}`;
                        variantOption.push(variantObjectBuilder(variantName));
                    }
                })
            } else if(variantOptionValues.length === 4){
                variantOptionValues[1].values.forEach((optionValue2) => {
                    variantOptionValues[2].values.forEach((optionValue3) => {
                        if(variantOptionValues[3].values.length > 0){
                            variantOptionValues[3].values.forEach((optionValue4) => {
                                const variantName = `${optionValue1}/${optionValue2}/${optionValue3}/${optionValue4}`;
                                variantOption.push(variantObjectBuilder(variantName))
                            });
                        } else {
                            const variantName = `${optionValue1}/${optionValue2}/${optionValue3}`;
                            variantOption.push(variantObjectBuilder(variantName));
                        }
                    });
                });
            }
        });
    }
    return variantOption; 
}

const ProductOptionDataGrid:React.FC<ProductOptionDataGridProps> = ({ variantOptionValuesParent, variantOptionChangeType }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { hex2rgb } = useRgbConverter();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const [variantDataGrid, setVariantDataGrid] = useState<VariantDataGrid>(defaultVariantDataGrid);
    const builtvariantOptionValues = useMemo(() => variantDataGridBuilder(variantOptionValuesParent), [variantOptionValuesParent]);
    const firstRenderControl = useRef(false);
    // console.log(builtvariantOptionValues, variantDataGrid.variantsDataGrid);

    useEffect(()=>{
        let variantIdArray1: string [] = [];
        let variantIdArray2: string [] = [];
        variantDataGrid.variantsDataGrid.forEach((item) =>  variantIdArray1.push(item.id));
        builtvariantOptionValues.forEach((item) =>  variantIdArray2.push(item.id));
        // console.log(builtvariantOptionValues, variantIdArray1, " ======= ", variantDataGrid.variantsDataGrid, variantIdArray2);

        if(variantOptionChangeType.current === "add" && firstRenderControl.current === true){
            // console.log("add")
            setVariantDataGrid((prev) => ({
                ...prev,
                variantsDataGrid: [...prev.variantsDataGrid, ...builtvariantOptionValues.filter(item => 
                    !variantIdArray1.includes(item.id)
                )]
            }));
        } else if(variantOptionChangeType.current === "delete"){
            // console.log("delete")
            setVariantDataGrid((prev) => ({
                ...prev,
                variantsDataGrid: [...prev.variantsDataGrid.filter(item => 
                    variantIdArray2.includes(item.id)
                )]
            }));
        } 
        if(builtvariantOptionValues.length > 0 && variantDataGrid.variantsDataGrid.length > 0){
            if(builtvariantOptionValues[0].id !== variantDataGrid.variantsDataGrid[0].id) {
                setVariantDataGrid((prev) => ({
                    ...prev,
                    variantsDataGrid: [...builtvariantOptionValues]
                }));
            }
        }
        firstRenderControl.current = true;
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[builtvariantOptionValues]);

    const onEdit = React.useCallback((val: string) => {
        console.log("edit: ", val);
    }, []);

    const onDelete = React.useCallback(() => {
        console.log("delete");
    }, []);

    const columns = React.useMemo(() => {
        return createColumns({
            actionsProps: {
                setVariantDataGrid,
                onEdit,
                onDelete
            },
            rowCount: variantDataGrid.variantsDataGrid.length
        });
    }, [onEdit, onDelete, setVariantDataGrid, variantDataGrid.variantsDataGrid.length]);
    
    return (
        <>
            <Divider sx={{marginY: "10px", width: "100%"}}/>
            <FlexBetween m="25px 0 0 0" sx={{width: "100%", height: "100%", flexDirection: "column", flexGrow: 1}}>
                <Box
                    sx={{
                        width: "100%",
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
                            backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.dark : hex2rgb(theme.palette.primary.light, "30").rgb,
                            borderColor: hex2rgb(theme.palette.primary.light, "50").rgb,
                            borderBottom: "none",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            borderRadius: "0"
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: theme.palette.primary.main,
                        },
                        "& .MuiDataGrid-row.Mui-selected": {
                            backgroundColor: hex2rgb(theme.palette.primary.light, "10").rgb,
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop:  `none`,
                            borderBottom: "none",
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: "0 0 12px 12px"
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
                        autoHeight
                        loading={false}
                        checkboxSelection={true} 
                        rowHeight={85} 
                        disableRowSelectionOnClick 
                        rows={variantDataGrid.variantsDataGrid} 
                        columns={columns}
                        slots={{
                            toolbar: ProductToolBar,
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
            </FlexBetween>
        </>
    )
}
export default memo(ProductOptionDataGrid);