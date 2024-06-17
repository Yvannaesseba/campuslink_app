// components/shared/ImageUpload.tsx
import React, { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';  // Ensure this path is correct

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { startUpload } = useUploadThing('media');  // Ensure this matches your backend configuration

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));

      try {
        const { data } = await startUpload([file]);
        if (data && data[0]?.url) {
          onImageUpload(data[0].url);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Image Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />}
    </div>
  );
};

export default ImageUpload;
