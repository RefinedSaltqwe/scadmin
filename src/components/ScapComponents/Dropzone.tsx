import { snackbarState } from '@/atoms/snackbarAtoms';
import useRgbConverter from '@/hooks/useRgbConverter';
import { AddPhotoAlternateOutlined } from '@mui/icons-material';
import { Box, useTheme } from '@mui/material';
import { green, red } from '@mui/material/colors';
import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSetRecoilState } from 'recoil';

type DropzoneProps = {
  size: string;
  // setSelectedImage: (value: React.SetStateAction<string | undefined>) => void;
  setSelectedImageBlob: React.Dispatch<React.SetStateAction<Blob | Blob[] | undefined>>;
  setSelectedImageBase64: React.Dispatch<React.SetStateAction<string | string [] | undefined>>;
  multipleFiles: boolean;
};

const Dropzone:React.FC<DropzoneProps> = ({size, setSelectedImageBlob, setSelectedImageBase64, multipleFiles}) => {
  
  const theme = useTheme();
  const { hex2rgb } = useRgbConverter();
  const setSnackbarValue = useSetRecoilState(snackbarState);
  
  const baseStyle = {
    flex: 1,
    width:"100%",
    height:"150px",
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: hex2rgb(theme.palette.primary.light, "70").rgb,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const focusedStyle = {
    borderColor: theme.palette.secondary.main
  };
  
  const acceptStyle = {
    borderColor: green[700]
  };
  
  const rejectStyle = {
    borderColor: red[700]
  };

const onDrop = useCallback(async(acceptedFiles: any) => {
  let imagesBlob: Blob [] = [];
  acceptedFiles.forEach( async (file: Blob) => {
    const reader = new FileReader();
    // const readerReview = new FileReader();
    if(file){
      reader.readAsDataURL(file);
    }
    reader.onabort = () => setSnackbarValue({ open: true, type: "error", text: `File reading was aborted.` });
    reader.onerror = () => setSnackbarValue({ open: true, type: "error", text: `File reading has failed.` });
    reader.onload = (readerEvent) => {
      if(multipleFiles){
        setSelectedImageBase64(prev => [...prev as string [], readerEvent.target?.result as string ]);
        imagesBlob.push(file)
      } else {
        setSelectedImageBase64(readerEvent.target?.result as string);
        setSelectedImageBlob(file);
      }
    }
  })
  
  if(multipleFiles){
    setSelectedImageBlob(imagesBlob);
  }
   // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
} = useDropzone({onDrop, multiple: multipleFiles, accept: {'image/*': []}, maxFiles: 10});

    
const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    isFocused,
    isDragAccept,
    isDragReject
]);

  return (
    <Box
        borderRadius="5px"
        // mt="9px"
        // p="1rem"
        sx={{width: "100%", cursor: "pointer", height: "100%"}}
    >
        <Box className="container" sx={{width: "100%", height: "100%"}}>
            <Box {...getRootProps({style})} sx={{borderRadius: "12px !important", display: "flex", justifyContent: "center", height: "100% !important"}}>
                <input {...getInputProps()} />
                <AddPhotoAlternateOutlined sx={{height: size, width: size, color: hex2rgb(theme.palette.primary.light, "70").rgb, m: "24px"}} />
                {/* <Typography variant="h6" sx={{color: theme.palette.text.secondary, fontWeight: 500}}>{`Drag 'n' drop an image here, or click to select image`}</Typography> */}
            </Box>
        </Box>
    </Box>
  )
}
export default Dropzone;