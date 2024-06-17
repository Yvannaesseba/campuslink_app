"use client" 

import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel, FormMessage} from "@/components/ui/form" 
import { Input } from "@/components/ui/input"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image';
//import { updateUser } from "@/lib/actions/user.actions";
import { CommentValidation } from '@/lib/validations/bleep';
import { addCommentToBleep, createBleep } from '@/lib/actions/bleep.actions';

interface Props{
  bleepId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ bleepId, currentUserImg, currentUserId}: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation), 
    defaultValues:{
      bleep: '',
    }
  })
  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToBleep(bleepId, values.bleep, JSON.parse(currentUserId), pathname);
    form.reset();
  };
    
/*const onSubmit: SubmitHandler<{ bleep: string }> = async (data) => {
    await addCommentToBleep(bleepId, data.bleep, JSON.parse(currentUserId), pathname);
    form.reset();
  }; */
/* const onSubmit: SubmitHandler<z.infer<typeof CommentValidation>> = async (values) => {
  await addCommentToBleep(bleepId, values.bleep, JSON.parse(currentUserId), pathname);
  form.reset();
}; */

  return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
      <FormField
        control={form.control}
        name="bleep"
        render={({ field }) => (
          <FormItem className=" flex w-full items-center gap-3 ">
            <FormLabel>
              <Image 
              src={currentUserImg}
              alt="Profile image"
              width={48}
              height={48}
              className="rounded-full object-cover"
              />
            </FormLabel>
            <FormControl className="border-none bg-transparent">
              <Input
                type="text"
                placeholder='Comment...'
                className='no-focus text-dark-1 outline-none '
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Button type="submit" className='comment-form_btn'>
        Reply
      </Button>
    </form>
  </Form>
)
}

export default CommentForm;