import * as z from 'zod';

export const EventValidation = z.object({
  event: z.string().nonempty().min(3, { message: 'Minimum 3 characters' }), 
  venue: z.string().nonempty().min(3, { message: 'Minimum 3 characters' }), 
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Invalid date format' }), // Example date validation
  description: z.string().nonempty().min(3, { message: 'Minimum 3 characters' }), 
  accountId: z.string(),
  image: z.string().url().nonempty(),// Example validation for image URL
})

export const CommentValidation = z.object({
  event: z.string().nonempty().min(3, {message:'Minimum 3 characters'}) , 
  // accountId: z.string(),
});