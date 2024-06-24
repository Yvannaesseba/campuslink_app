import * as z from 'zod';

export const BleepValidation = z.object({
  bleep: z.string().min(3, {message:'Minimum 3 characters'}) ,
  file: z.custom<File[]>(),
  accountId: z.string(),
})

export const CommentValidation = z.object({
  bleep: z.string().min(3, {message:'Minimum 3 characters'}) , 
  // accountId: z.string(),
});