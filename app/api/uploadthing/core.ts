import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from '@clerk/nextjs';

import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
const getUser  = () => {
  const { userId } = auth()
  if(!userId) throw new Error("User Unauthorized")
  return { userId }
}
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
   bleepImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 }})
   .middleware(()=>getUser())
   .onUploadComplete(()=>{})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;





