"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { tweetSchema } from '@/validations/tweet.validation'
import { useTweetModal } from "@/hooks/useTweetModal";
import { ChangeEvent, useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Image as ImageIcon, X } from "lucide-react"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createTweet } from "@/actions/tweet.action";

const OnBoarding = () => {
    const tweetModal = useTweetModal();
    const router = useRouter();

    const [file, setFile] = useState<File>();
    const [previewImage, setPreviewImage] = useState("");
    const textarea = useRef<HTMLTextAreaElement | null>(null);

    const form = useForm<z.infer<typeof tweetSchema>>({
        resolver: zodResolver(tweetSchema),
        defaultValues: {
            userId: tweetModal.userId!,
            text: "",
            imageUrl: ""
        }
    })

    const onChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files)
        const files = event.target.files ?? []
        if (!files.length) return;

        const file = files[0]
        const maxSizeInBytes = 2 * 1024 * 1024;
        if (!file) return;

        if (file.size > maxSizeInBytes) return alert("Maximum Size Image 2MB")

        setFile(file);
        const previewPhoto = URL.createObjectURL(file);
        setPreviewImage(previewPhoto);
    };

    async function onSubmit(values: z.infer<typeof tweetSchema>) {
        try {
            if (previewImage) {
                const formData = new FormData();
                formData.append("file", file!);
                formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET!);

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
                    formData
                );

                const isStatus200 = response.status === 200
                if (!isStatus200) return;

                values.imageUrl = response.data.url
            }

            const result = await createTweet(values)

            if (!result) return;

            router.refresh();
            tweetModal.onClose();
        } catch (error: any) {
            console.log("[ERROR_CREATE_TWEET_FORM]", error.message)
        }
    }

    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        const { current } = textarea
        if (!current) return;
        current.addEventListener('input', autoResize);
        autoResize()
    }, [textarea])

    const autoResize = () => {
        const { current } = textarea
        if (!current) return;
        current.style.height = 'auto'
        current.style.height = current.scrollHeight + 'px';
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full space-y-4">
                <div className="flex items-start justify-start gap-x-5 w-full">
                    <div className="flex jsutify-start rounded-full overflow-hidden">
                        <Image
                            src={tweetModal.imageUrl!}
                            alt="User Profile"
                            width={50}
                            height={50}
                            priority
                            className="object-cover rounded-full"
                        />
                    </div>
                    <div className="mt-2 flex flex-col space-y-4 w-full">
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Textarea
                                            className="no-focus !border-none !outline-none w-full p-0 text-white bg-black-100 rounded-none placeholder:text-gray-200 font-normal tracking-wide text-xl resize-none block overlow-hidden max-h-[300px] overflow-y-auto"
                                            disabled={isLoading}
                                            placeholder="What is happening?"
                                            {...field}
                                            ref={textarea}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {previewImage &&
                            <div className="relative">
                                <div className="absolute top-3 right-3">
                                    <Button onClick={() => setPreviewImage("")} size="icon" variant="ghost" className="rounded-xl !text-white bg-black-100/90 hover:bg-black-100/80">
                                        <X />
                                    </Button>
                                </div>
                                <Image
                                    src={previewImage}
                                    alt="Preview Image"
                                    width={600}
                                    height={300}
                                    className="object-contain rounded-xl"
                                />
                            </div>
                        }
                    </div>
                </div>

                <div className="h-[1px] w-full bg-gray-300" />

                <div className="flex items-center justify-between">
                    {/* Choosing Files */}
                    <div>
                        <Label htmlFor="image-url" className="cursor-pointer">
                            <ImageIcon size="20px" className="text-blue hover:text-blue/90" />
                        </Label>
                        <Input id="image-url" type="file" onChange={onChangeImage} className="hidden" />
                    </div>

                    {/* Submit Button */}
                    <div className="flex-1 flex justify-end">
                        <Button disabled={isLoading} variant="primary" className="px-6 py-1.5 w-fit" type="submit">Post</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default OnBoarding