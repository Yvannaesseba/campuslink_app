import { useForm } from 'react-hook-form'; // Importing useForm hook from react-hook-form for form management
import { Button } from "@/components/ui/button"; // Importing Button component from custom UI library
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"; // Importing form-related components from custom UI library
import { useState } from "react"; // Importing useState hook from React

import { Textarea } from "@/components/ui/textarea"; // Importing Textarea component from custom UI library
import { zodResolver } from '@hookform/resolvers/zod'; // Importing zodResolver from hookform for Zod schema validation
import * as z from "zod"; // Importing z from Zod for defining schemas
import { usePathname, useRouter } from "next/navigation"; // Importing useRouter and usePathname hooks from Next.js for client-side navigation
import { useOrganization } from '@clerk/nextjs'; // Importing useOrganization hook from Clerk for fetching organization data
// import { updateUser } from "@/lib/actions/user.actions"; // Importing updateUser action from user actions (commented out)
import { BleepValidation } from '@/lib/validations/bleep'; // Importing BleepValidation schema from validations folder
import { createBleep } from '@/lib/actions/bleep.actions'; // Importing createBleep action from bleep actions
import { Image } from 'lucide-react'; // Importing Image component from Lucide React for displaying icons
import { useImageModal } from '@/hooks/use-modal'; // Importing useImageModal custom hook for handling image modals
import FileUploader from '../shared/file-upload'; // Importing FileUploader component for uploading files

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

function PostBleep({ userId }: { userId: string }, { post }: Props) {
  const [showModal, setShowModal] = useState(false); // State for managing modal visibility

  const router = useRouter(); // Initializing useRouter hook for client-side navigation
  const pathname = usePathname(); // Fetching current pathname using usePathname hook
  const { organization } = useOrganization(); // Fetching organization data using useOrganization hook
  const { onOpen } = useImageModal(); // Destructuring onOpen function from useImageModal hook

  const form = useForm({
    resolver: zodResolver(BleepValidation), // Setting resolver for form validation using Zod schema
    defaultValues: {
      bleep: '', // Initializing bleep field in form
      file: [], // Initializing file field in form
      accountId: userId, // Setting accountId field to userId
    }
  });

  const onSubmit = async (values: z.infer<typeof BleepValidation>) => {
    await createBleep({
      text: values.bleep, // Passing bleep text from form values
      file: values.bleep, // Passing bleep file from form values
      author: userId, // Setting author to userId
      communityId: organization ? organization.id : null, // Setting communityId based on organization data
      path: pathname // Passing current pathname
    });
    router.push("/"); // Navigating to home page after posting bleep
  };

  return (
    <>
      <Form {...form}> {/* Form component from custom UI library with useForm hook */}
        <form
          onSubmit={form.handleSubmit(onSubmit)} // Handling form submission with onSubmit function
          className="flex flex-col justify-start gap-10"
        >

          <FormField
            control={form.control}
            name="bleep"
            render={({ field }) => ( // Rendering bleep field
              <FormItem className="mt-10 flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Bleep
                </FormLabel>
                <FormControl className="no-focus border border-light-2 text-dark-1">
                  <Textarea
                    rows={12}
                    placeholder='What is in your Mind?'
                    {...field} // Binding field props to Textarea component
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bleepImage"
            render={({ field }) => ( // Rendering bleepImage field
              <FormItem className="mt-10 flex flex-col w-full gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Add Media
                </FormLabel>
                <FormControl className="no-focus border border-light-2 text-dark-1">
                  <FileUploader
                    fieldChange={field.onChange} // Passing field onChange function to FileUploader component
                    mediaUrl={post?.bleepImage} // Passing mediaUrl from post prop to FileUploader component
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className='bg-secondary-500'>
            Post Bleep {/* Button for submitting the form */}
          </Button>

        </form>
      </Form>
    </>
  );
}

export default PostBleep; // Exporting PostBleep component as default
