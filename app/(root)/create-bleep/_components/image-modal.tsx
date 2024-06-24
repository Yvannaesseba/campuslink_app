"use client"

import{
    Dialog,
    DialogHeader,    
    DialogTitle,          
    DialogContent,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"

import{
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import  { FileUpload }   from "@/components/shared/file-upload";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useImageModal } from "@/hooks/use-modal";



const formSchema = z.object({
    imageUrl: z.string().min(1),
})

export const ImageModal = async () => {
    // const [isEditing, setIsEditing] = useState(false)
    // const toggleEdit = () => setIsEditing((current)=>!current);
    const { isOpen, onClose, type } = useImageModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === "addImage";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    })
    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset()
        onClose()
    }
    return(
        <Dialog open onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-8">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your Server
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Personalize your server by giving it a name and an image. Don&apos;t worry you can change it later
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={() => {}} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field })=>(
                                    <FormItem>
                                    <FormControl>
                                        <FileUpload
                                            endpoint="bleepImage"
                                            value={field.value}
                                            onChange={field.onChange}
                                        /> 
                                    </FormControl>
                                    </FormItem>
                                )}
                            />
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field })=>(
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter server name"  
                                                {...field}

                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} className="bg-orange-500 hover:bg-orange-300">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
