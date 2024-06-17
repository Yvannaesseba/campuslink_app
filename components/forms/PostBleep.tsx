"use client" 

import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel, FormMessage} from "@/components/ui/form" 
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import { useOrganization } from '@clerk/nextjs';
//import { updateUser } from "@/lib/actions/user.actions";
import { BleepValidation } from '@/lib/validations/bleep';
import { createBleep } from '@/lib/actions/bleep.actions';

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio:string;
    image: string;
  };
  btnTitle: string;
}

function PostBleep({ userId} : { userId: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization} = useOrganization();

  const form = useForm({
    resolver: zodResolver(BleepValidation), 
    defaultValues:{
      bleep: '',
      accountId: userId,
    }
  })

  const onSubmit =  async (values: z.infer<typeof BleepValidation>) => {
    await createBleep({
      text: values.bleep,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname
    });

    router.push("/")
  }

  return (
    <Form {...form}>
    <form 
    onSubmit={form.handleSubmit(onSubmit)} 
    className="flex flex-col justify-start gap-10"
    >
       <FormField
          control={form.control}
          name="bleep"
          render={({ field }) => (
            <FormItem className="mt-10 flex flex-col w-full gap-3 ">
              <FormLabel className="text-base-semibold text-light-2">
                Bleep
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea 
                rows={15}
                {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <Button type="submit" className='bg-secondary-500'>
            Post Bleep
        </Button>

    </form>
    </Form>
  )
}

export default PostBleep;