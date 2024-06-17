import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useOrganization } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { ChangeEvent, useState } from 'react';

import { createEvent } from '@/lib/actions/event.actions';
import { EventValidation } from '@/lib/validations/event';

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
  const { organization } = useOrganization();
  const pathname = usePathname();
  const { startUpload } = useUploadThing("media");

  const [files, setFiles] = useState<File[]>([]);

  const form = useForm({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      event: '',
      venue: '',
      description: '',
      date: '',
      image: '',
      accountId: userId,
    }
  });

  const onSubmit = async (values: z.infer<typeof EventValidation>) => {
    try {
      // Check if image field is a base64 string and upload if so
      const hasImageChanged = isBase64Image(values.image);
      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0]) {
          const fileUrl = imgRes[0]?.url || '';
          values.image = fileUrl;
        }
      }

      await createEvent({
        text: values.event,
        venue: values.venue,
        description: values.description,
        date: values.date,
        author: userId,
        communityId: organization ? organization.id : null,
      });

      router.push("/");
    } catch (error) {
      console.error('Error creating event:', error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="event"
          render={({ field }) => (
            <FormItem className="mt-10 flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Event Title
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Venue
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Description
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Date (YYYY-MM-DD)
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Image URL
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className='bg-secondary-500'>
          Post Event
        </Button>

      </form>
    </Form>
  );
}

export default PostEvent;
