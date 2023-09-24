"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { useState } from "react";
import { userSchema } from '@/validations/user.validation'
import { saveUserAction } from "@/actions/user.action";

import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";

import { Button } from "@/components/ui/button"
import { Label } from "./ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea";
import Image from "next/image";

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
    const [isImageHasChange, setIsImageHasChange] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

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
        if (isImageHasChange) {
            values.imageUrl = imageUrl
        }

        const newUser = {
            ...values,
            username: initialValue.username,
            email: initialValue.email
        }

        try {
            const result = await saveUserAction(newUser);

            if (!result) return;

            window.location.href = "/home"
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
                            <div className="flex items-center gap-x-8 space-y-4 sm:space-y-8 flex-wrap">
                                <Label>
                                    <Image
                                        src={imageUrl || initialValue.imageUrl}
                                        alt={initialValue.username}
                                        width={80}
                                        height={80}
                                        className="object-contain rounded-full"
                                    />
                                </Label>
                                {/* @ts-ignore */}
                                <UploadButton
                                    endpoint="imageProfile"
                                    onClientUploadComplete={(res: any) => {
                                        setIsImageHasChange(true);
                                        setImageUrl(res[0].fileUrl)
                                    }}
                                    onUploadError={(error: Error) => {
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                />
                            </div>
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