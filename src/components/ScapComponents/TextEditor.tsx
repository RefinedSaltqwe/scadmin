import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type TextEditorProps = {
    
};

const TextEditor:React.FC<TextEditorProps> = () => {
    const [value, setValue] = useState('');

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link'],
          // ['link', 'image'],
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