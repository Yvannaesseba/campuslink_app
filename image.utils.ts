import { UploadedFile } from 'express-fileupload'; // Assuming use of express-fileupload or similar library

/**
 * Uploads an image file to a specified directory.
 * @param file UploadedFile object containing image data.
 * @returns Promise<string> Resolves with the uploaded image URL/path.
 */
export const uploadImage = async (file: UploadedFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { name, mv } = file;
    const uploadPath = `/path/to/upload/directory/${name}`; // Replace with your actual upload directory

    mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      } else {
        const imageUrl = `/uploads/${name}`; // Example: Assuming uploads are served from '/uploads' directory
        resolve(imageUrl);
      }
    });
  });
};