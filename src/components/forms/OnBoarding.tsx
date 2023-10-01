"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { ChangeEvent, useState } from "react";
import { userSchema } from '@/validations/user.validation'
import { saveUserAction } from "@/actions/user.action";

import { Button } from "@/components/ui/button"
import { Label } from "../ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import toast from "react-hot-toast";
import { toastOptions } from "@/lib/utils";
import axios from "axios";
import { Camera } from "lucide-react";

interface InitialValueInterface {
    id: string;
    imageUrl: string;
    name: string;
    email: string;
    username: string;
    bio: string;
}

interface OnBoardingProps {
    initialValue: InitialValueInterface
}

const OnBoarding = ({ initialValue }: OnBoardingProps) => {
    const [file, setFile] = useState<File>();
    const [previewImage, setPreviewImage] = useState("")

    const onChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ?? []
        if (!files.length) return;

        const file = files[0]
        const maxSizeInBytes = 1 * 1024 * 1024; // 1mb
        if (!file) return;

        // if file size greather then 1mb, return alert
        if (file.size > maxSizeInBytes) {
            toast.error("Maximum Size Image 1MB", { duration: 2000 })
            return;
        }

        setFile(file);
        const previewPhoto = URL.createObjectURL(file);
        setPreviewImage(previewPhoto);
    };


    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            id: initialValue.id,
            name: initialValue.name,
            imageUrl: initialValue.imageUrl,
            bio: initialValue.bio
        }
    })

    async function onSubmit(values: z.infer<typeof userSchema>) {
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

        const newUser = {
            ...values,
            username: initialValue.username,
            email: initialValue.email,
            isCompleted: true,
        }

        try {
            await saveUserAction(newUser);

            window.location.href = "/home";
        } catch (error) {
            console.log("ERROR_ONBOARDING", error)
        }
    }

    const isLoading = form.formState.isSubmitting;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden">
                                <Image
                                    src={previewImage || initialValue.imageUrl}
                                    alt={initialValue.username}
                                    width={80}
                                    height={80}
                                    className="object-cover w-[80px] h-[80px] rounded-full select-none"
                                />
                                <Label
                                    htmlFor="upload-profile-image"
                                    className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] p-3 rounded-full bg-gray-300/80 hover:bg-gray-300/50 transition text-white cursor-pointer"
                                >
                                    <Camera />
                                </Label>
                            </div>
                            <Input
                                id="upload-profile-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onChangeImage}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Name</Label>
                            <FormControl>
                                <Input className="no-focus" disabled={isLoading} placeholder="your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Bio</Label>
                            <FormControl>
                                <Textarea className="no-focus" disabled={isLoading} placeholder="your bio" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isLoading} variant="primary" type="submit" className="w-full">Continue</Button>
            </form>
        </Form>
    )
}

export default OnBoarding