import { Product, productState } from '@/atoms/productsAtom';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useRecoilState } from 'recoil';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type TextEditorProps = {
    
};

const TextEditor:React.FC<TextEditorProps> = () => {
    const [value, setValue] = useState('');
    const [productValue, setProductValue] = useRecoilState(productState);
    useEffect(()=>{
      let timer = setTimeout(()=>{
        setProductValue((prev) => ({
          ...prev,
          product: {
              ...prev.product,
              description: value
          } as Product
      }));
      }, 2500);

      return () => {
        clearTimeout(timer);
      };
      //eslint-disable-next-line react-hooks/exhaustive-deps
    },[value]);

    //Pre-set value
    useEffect(() => {
      setValue(productValue.product.description);
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link'],
          ['clean']
        ],
      }
    
     const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ]

    return(
        <ReactQuill placeholder= "Write something" value={value} onChange={setValue} modules={modules} formats={formats} className="quillTextEditor" />
    )
}
export default TextEditor;