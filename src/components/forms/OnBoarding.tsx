"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { userSchema } from "@/validations/user.validation";
import { saveUserAction } from "@/actions/user.action";

import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";
import { toastOptions } from "@/lib/utils";

interface InitialValueInterface {
	id: string;
	name: string;
	bio: string;
}

interface OnBoardingProps {
	initialValue: InitialValueInterface;
}

const OnBoarding = ({ initialValue }: OnBoardingProps) => {
	const form = useForm<z.infer<typeof userSchema>>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			id: initialValue.id,
			name: initialValue.name,
			bio: initialValue.bio,
		},
	});

	async function onSubmit(values: z.infer<typeof userSchema>) {
		const newDataUser = {
			...values,
			isCompleted: true,
		};

		try {
			const data = await saveUserAction(newDataUser);
			if (!data) {
				return toast.error("Something went wrong!", {
					duration: 2000,
				});
			}

			window.location.href = "/home";
		} catch (error) {
			console.log("[ERROR_ONBOARDING]", error);
		}
	}

	const isLoading = form.formState.isSubmitting;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<Label className="font-bold" htmlFor="name">
								Name
							</Label>
							<FormControl>
								<Input
									{...field}
									id="name"
									className="onboarding__input"
									disabled={isLoading}
								/>
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
							<Label htmlFor="bio" className="font-bold">
								Bio
							</Label>
							<FormControl>
								<Textarea
									{...field}
									id="bio"
									className="onboarding__textarea"
									disabled={isLoading}
									rows={6}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					disabled={isLoading}
					variant="primary"
					type="submit"
					className="w-full rounded-xl"
				>
					Continue
				</Button>
			</form>
		</Form>
	);
};

export default OnBoarding;
