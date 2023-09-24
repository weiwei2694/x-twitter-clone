"use client";

import { usePathname } from "next/navigation";
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
import { createTweetAction } from "@/actions/tweet.action";
import { cn, customDatePost } from "@/lib/utils";
import { DataTweet } from "@/interfaces/tweet.interface";
import { renderText } from "@/lib/tweet";

interface Props {
    isModal?: boolean;
    userId: string;
    imageUrl: string;
    htmlForId: string;
    parentId?: string | undefined;
    isReply?: boolean;
    dataTweet?: DataTweet;
}

const CreateTweetForm = ({
    isModal,
    userId,
    imageUrl,
    htmlForId,
    parentId,
    isReply,
    dataTweet
}: Props) => {
    const tweetModal = useTweetModal();
    const path = usePathname();

    const [file, setFile] = useState<File>();
    const [previewImage, setPreviewImage] = useState("");
    const textarea = useRef<HTMLTextAreaElement | null>(null);

    const form = useForm<z.infer<typeof tweetSchema>>({
        resolver: zodResolver(tweetSchema),
        defaultValues: {
            userId,
            text: "",
            imageUrl: "",
            parentId
        }
    })

    // create previewImage when user try upload file image
    const onChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ?? []
        if (!files.length) return;

        const file = files[0]
        const maxSizeInBytes = 2 * 1024 * 1024; // 2mb
        if (!file) return;

        // if file size greather then 2mb, return alert
        if (file.size > maxSizeInBytes) return alert("Maximum Size Image 2MB")

        setFile(file);
        const previewPhoto = URL.createObjectURL(file);
        setPreviewImage(previewPhoto);
    };

    async function onSubmit(values: z.infer<typeof tweetSchema>) {
        try {
            // if previewImage exist, upload image to server
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

                // changes current values.imageUrl
                values.imageUrl = response.data.url
            }

            // RESET
            form.reset();
            setPreviewImage("");
            if (isModal) {
                tweetModal.setDataTweet(undefined);
                tweetModal.setParentId(undefined);
                tweetModal.onClose();
            }

            await createTweetAction({
                ...values,
                path
            })
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

        return () => {
            current.removeEventListener('input', autoResize)
        }
    }, [textarea])

    const autoResize = () => {
        const { current } = textarea
        if (!current) return;
        current.style.height = 'auto'
        current.style.height = current.scrollHeight + 'px';
    }

    // component
    const IsReplyComponent = () => {
        // if isReply false or dataTweet empty, return null
        if (!isReply || !dataTweet) return null;
        // if is isn't modal, don't display reply comment component
        if (!isModal) return null;

        // format date | dataTweet.createdAt
        const formattedCreatedAt = customDatePost(dataTweet.createdAt.getTime());

        return (
            <section className="flex justify-start items-start gap-x-5 h-full">
                <div className="flex flex-col items-center justify-start gap-y-1 h-full">
                    <Image
                        src={dataTweet.user.imageUrl}
                        alt={dataTweet.user.name}
                        width={35}
                        height={35}
                        className="object-cover rounded-full"
                    />

                    <div
                        className="h-full w-[2px] bg-gray-300 rounded-full"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-y-5">
                    <div className="flex-1 flex items-center flex-wrap gap-x-2">
                        <h5 className="text-ellipsis overflow-hidden whitespace-nowrap font-bold text-white w-fit max-w-[150px]">
                            {dataTweet.user.name}
                        </h5>
                        <p
                            className="text-ellipsis whitespace-nowrap font-normal text-gray-200"
                        >
                            @{dataTweet.user.username} · {formattedCreatedAt}
                        </p>
                    </div>
                    <p className="whitespace-break-spaces">
                        {renderText(dataTweet.text)}
                    </p>
                </div>
            </section>
        )
    }

    // show text submit button
    const showTextSubmitButton = () => {
        if (!dataTweet) return "Post";
        if (isReply) return "Reply";
    }

    // show text placeholder
    const showTextPlaceholder = () => {
        if (!dataTweet) return "What is happening?";
        if (isReply) return "Post your reply";
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={
                    cn(
                        "flex flex-col w-full space-y-4 relative z-0 h-full",
                        !isModal
                        &&
                        cn("px-3 py-4", isLoading && "bg-gray-300")
                    )
                }
            >
                <IsReplyComponent />

                <section className="flex items-start justify-start gap-x-5 w-full">
                    <div className="flex jsutify-start rounded-full overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt="User Profile"
                            width={35}
                            height={35}
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
                                            className="no-focus !border-none !outline-none w-full p-0 text-white rounded-none placeholder:text-gray-200 font-normal tracking-wide text-xl resize-none block overlow-hidden max-h-[300px] overflow-y-auto bg-transparent"
                                            disabled={isLoading}
                                            placeholder={showTextPlaceholder()}
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
                </section>

                {/* divider */}
                <div className="h-[1px] w-full bg-gray-300" />

                <section className="flex items-center justify-between">
                    {/* Choosing Files */}
                    <div>
                        <Label htmlFor={`image-upload-${htmlForId}`} className="cursor-pointer">
                            <ImageIcon size="20px" className="text-blue hover:text-blue/90" />
                        </Label>
                        <Input accept="image/*" id={`image-upload-${htmlForId}`} type="file" onChange={onChangeImage} className="hidden" />
                    </div>

                    {/* Submit Button */}
                    <div className="flex-1 flex justify-end">
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            className="px-6 py-1.5 w-fit"
                            type="submit"
                        >
                            {showTextSubmitButton()}
                        </Button>
                    </div>
                </section>
            </form>
        </Form>
    )
}

export default CreateTweetForm