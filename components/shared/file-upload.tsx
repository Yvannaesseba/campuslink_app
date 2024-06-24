import React, {useCallback, useState} from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone';
import Image from 'next/image'
import { Button } from '../ui/button'

interface FileUploaderProps{
fieldChange: (FILES: File[]) => void;
mediaUrl: string;}
const FileUploader = ({fieldChange, mediaUrl}: FileUploaderProps) => {
const [file, setFile] = useState<File[]>([])
const [imageUrl, setImageUrl] = useState('')
const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
setFile(acceptedFiles)
fieldChange(acceptedFiles)
setImageUrl(URL.createObjectURL(acceptedFiles[0]))
}, [file])
const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,
accept:{
'image/*': ['.png','.jpeg','.jpg','.svg']
}
})
    
return (

       
  <div {...getRootProps()} classname="flex flex-center flex-col bg-dark-4 rounded-xl cursor-pointer">
  <input {...getInputProps()} className="cursor-pointer"/>
  {
    imageUrl ? (
      <div className="flex flex-col gap-2 flex-1 justify-center w-full p-5 lg:p-10 bg-dark-2"> 
          <Image
              width={500}
              height={500}
              src={imageUrl}
              alt="CampusLink-Upload"
          />
          <p className="text-gray-100 font-thin text-center">Drag and Drop Media to Replace </p>
      </div>
    ):(
      <div className="text-white bg-dark-4 p-40 rounded-lg flex flex-col items-center gap-2">
          <Image
              width={60}
              height={60}
              src='/assets/file-upload.svg'
              alt='CampusLink-Upload'
          />
          <h3 className="text-white small-regular mt-2">Drag and Drop your Media Here</h3>
          <p className="text-white text-xs">PNG, JPEG</p>
          <Button className="bg-secondary-500  mt-2 hover:bg-yellow-500">Select from Device</Button>
      </div>
    )
  }
  </div>
);
}
 
export default FileUploader;