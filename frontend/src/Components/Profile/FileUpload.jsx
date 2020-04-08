import React, { useState} from 'react';

export default function FileUpload(props) {
    const [ imagePreview, setImagePreview ] = useState(props.imageLink);

    const image_preview = event => {
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
            }
        reader.readAsDataURL(event.target.files[0]);
    }

    const handleFileInput = event => {
        props.setPicFile(event.target.files[0]);
        image_preview(event);
    }


    return (
        <>
        <div className='custom-file col-sm-6'>
            <input 
                className='custom-file-input' 
                id='fileUpload' 
                type='file' 
                accept='image/*' 
                onInput={handleFileInput} 
                onChange={e => e.target.value = null} 
            />
            
            <label className='custom-file-label' htmlFor='fileUpload'>
                Upload a profile image
            </label>
        </div>
        
        {imagePreview 
            ? <img 
                className='d-block w-75 mx-auto my-2 p-2' 
                src={imagePreview} 
                alt='User profile preview' 
                style={{objectFit: 'scale-down'}}
                />
            : null
        }
        </>
    )
}