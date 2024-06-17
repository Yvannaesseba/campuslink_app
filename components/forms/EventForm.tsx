// components/forms/EventForm.tsx

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Event } from '../../models/Event';
import UploadThing from '@uploadthing/react'; // Adjust as per your actual import
import { useClient } from 'next/client'; // Import useClient from next/client

const EventForm: React.FC<{ onSubmit: (formData: Event) => void }> = ({ onSubmit }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  // Ensure that hooks like useState are only used on the client side
  const client = useClient();

  useEffect(() => {
    if (client) {
      console.log('Component mounted on client');
      // Additional client-side logic here
      return () => {
        console.log('Component unmounted from client');
        // Cleanup logic if needed
      };
    }
  }, [client]);

  const { register, handleSubmit, reset } = useForm<Event>();

  const handleImageUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: Event) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="...">
      {/* Form inputs and fields */}
      <UploadThing onChange={(files) => handleImageUpload(files)}>
        <button type="button">Upload Image</button>
      </UploadThing>
      {imageUrl && <img src={imageUrl} alt="Uploaded" className="..." />}
      <input {...register('eventName')} placeholder="Event Name" className="..." />
      {/* Other form fields */}
      <button type="submit" className="...">Submit</button>
    </form>
  );
};

export default EventForm;
