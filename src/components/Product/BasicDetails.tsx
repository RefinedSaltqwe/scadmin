import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FlexContainer from '../ScapComponents/FlexContainer';
import ScapPrimaryTextField from '../ScapComponents/PrimaryTextField';
import TextEditor from '../ScapComponents/TextEditor';
import useRgbConverter from '@/hooks/useRgbConverter';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Product, productState } from '@/atoms/productsAtom';

type BasicDetailsProps = {
    
};

const BasicDetails:React.FC<BasicDetailsProps> = () => {

    const theme = useTheme();
    const { hex2rgb } = useRgbConverter();
    const [productValue, setProductValue] = useRecoilState(productState);
    const [title, setTitle] = useState("");

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    useEffect(() => {
        let timer = setTimeout(() => {
            console.log("set title")
            setProductValue((prev) => ({
                ...prev,
                product: {
                    ...prev.product,
                    title: title
                } as Product
            }));
        }, 2000);

        return () => {
            clearInterval(timer);
        }
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title]);

    useEffect(() => {
        setTitle(productValue.product.title);
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <FlexContainer
            sx={{
                '& .ql-snow .ql-tooltip':{
                    boxShadow: "0px 0px 0px #ddd",
                    left: "0"
                },
                '& .quillTextEditor > div': {
                    backgroundColor: "transparent",
                    borderColor: hex2rgb(theme.palette.primary.light, '100').rgb,
                },
                '& .quillTextEditor > div > span > span > span::before': {
                    color: theme.palette.text.primary
                },
                '& .quillTextEditor .ql-stroke': {
                    stroke: `${theme.palette.text.primary} !important`
                },
                '& .quillTextEditor .ql-fill': {
                    fill: `${theme.palette.text.primary} !important`
                },
                '& .editorClassName': {
                    padding: "0 5px",
                    border: `1px solid ${hex2rgb(theme.palette.primary.light, '60').rgb}`
                },
                '& .quillTextEditor .ql-toolbar': {
                    marginBottom: "12px",
                    borderRadius: "8px"
                },
                '& .quillTextEditor .ql-container': {
                    height: "250px",
                    border: `1px solid ${hex2rgb(theme.palette.primary.light, '100').rgb} !important`,
                    borderRadius: "8px"
                },
                '& .quillTextEditor .ql-picker-label:hover::before': {
                    color: `${theme.palette.secondary.main} !important`
                },
                ' .quillTextEditor .ql-picker-label:hover > svg > polygon.ql-stroke':{
                    stroke: `${theme.palette.secondary.main} !important`
                },
                '& .quillTextEditor .ql-picker-item:hover, .quillTextEditor .ql-selected':{
                    color: `${theme.palette.secondary.main} !important`
                },
                '& .quillTextEditor button:hover .ql-stroke, .quillTextEditor button.ql-active .ql-stroke': {
                    stroke: `${theme.palette.secondary.main} !important`
                },
                '& .quillTextEditor button:hover .ql-fill, .quillTextEditor button.ql-active .ql-fill': {
                    fill: `${theme.palette.secondary.main} !important`
                },
                '& .quillTextEditor .ql-active': {
                    color: `${theme.palette.secondary.main} !important`
                },
                '& .quillTextEditor .ql-container > .ql-editor.ql-blank::before': {
                    color: `${theme.palette.text.secondary} !important`,
                    fontStyle: "normal",
                },
                // '& .quillTextEditor .ql-container:active':{
                //     border: `${theme.palette.secondary.main} 3px solid !important`
                // }
            }}
        >
            <Box sx={{width: "100%", display:"flex", flexDirection: "row"}}>
                <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
                    <Typography variant="h5" sx={{fontWeight: 600}}>Basic Details</Typography>
                </Box>
            </Box>
            <Box sx={{margin: "24px 0 20px 0"}}>
                <ScapPrimaryTextField type="text" label="Title" name="title" onChange={onChange} resetValue={title}/>
            </Box>
            <TextEditor/>
        </FlexContainer>
    )
}
export default BasicDetails;