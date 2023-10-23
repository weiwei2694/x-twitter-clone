"use client";

import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { tweetSchema } from "@/validations/tweet.validation";
import { useTweetModal } from "@/hooks/useTweetModal";
import { useReplyTweet } from "@/hooks/useReplyTweet";
import { ChangeEvent, useState, useRef, useEffect } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../../ui/textarea";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { cn } from "@/lib/utils";
import SubmitButton from "./SubmitButton";
import Topbar from "./Topbar";
import PreviewImage from "./PreviewImage";
import Reply from "./Reply";
import { uploadFile } from "@/lib/cloudinary";
import toast from "react-hot-toast";
import { createTweetAction } from "@/actions/tweet.action";
import {
	commentPostNotificationAction,
	replyCommentPostNotificationAction,
} from "@/actions/notification.action";

interface Props {
	isModal?: boolean;
	userId: string;
	imageUrl: string;
	htmlForId: string;
	isMobile?: boolean;
	isReply?: boolean;
}

const CreateTweetForm = ({
	isModal,
	userId,
	imageUrl,
	htmlForId,
	isMobile,
	isReply,
}: Props) => {
	const onCloseModal = useTweetModal((state) => state.onClose);
	const { dataTweet, setDataTweet } = useReplyTweet();
	const path = usePathname();
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [file, setFile] = useState<File>();
	const [previewImage, setPreviewImage] = useState("");
	const textarea = useRef<HTMLTextAreaElement | null>(null);

	const form = useForm<z.infer<typeof tweetSchema>>({
		resolver: zodResolver(tweetSchema),
		defaultValues: {
			userId,
			text: "",
			imageUrl: "",
			parentId: dataTweet?.parentId,
		},
	});

	const onChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files ?? [];
		if (!files.length) return;

		const file = files[0];
		const maxSizeInBytes = 2 * 1024 * 1024;
		if (!file) return;

		if (file.size > maxSizeInBytes) return toast(`Maximum Size Image 2MB`);

		setFile(file);
		const previewPhoto = URL.createObjectURL(file);
		setPreviewImage(previewPhoto);
	};

	async function onSubmit(values: z.infer<typeof tweetSchema>): Promise<void> {
		try {
			setIsLoading(true);

			if (previewImage) {
				const imageUrl = await uploadFile(file!);
				values.imageUrl = imageUrl;
			}

			await createTweetAction({ ...values, path });

			if (dataTweet && dataTweet.user.id !== userId) {
				const dataNotification = {
					userId: dataTweet.user.id,
					sourceId: userId,
					parentIdPost: dataTweet.id,
					path,
				};

				const notificationType = dataTweet.isParentIdExist
					? replyCommentPostNotificationAction
					: commentPostNotificationAction;

				await notificationType(dataNotification);
			}

			const redirectTo =
				isMobile && isReply
					? `/${dataTweet?.user?.username}/status/${dataTweet?.id}`
					: "/home";

			if (isMobile) router.push(redirectTo);
		} catch (error) {
			console.info("[ERROR_CREATE_TWEET_FORM]", error);
		} finally {
			setIsLoading(false);

			// RESET
			setDataTweet(null);
			onCloseModal();
			form.reset();
			setPreviewImage("");
		}
	}

	useEffect(() => {
		const { current } = textarea;
		if (!current) return;
		current.addEventListener("input", autoResize);
		autoResize();

		return () => {
			current.removeEventListener("input", autoResize);
		};
	}, [textarea]);

	const autoResize = () => {
		const { current } = textarea;
		if (!current) return;
		current.style.height = "auto";
		current.style.height = current.scrollHeight + "px";
	};

	const showTextSubmitButton = () => {
		if (!dataTweet) return "Post";
		if (isReply) return "Reply";
	};

	const showTextPlaceholder = () => {
		if (!dataTweet) return "What is happening?";
		if (isReply) return "Post your reply";
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn(
					"flex flex-col w-full space-y-4 relative z-0 h-full",
					!isModal && "px-3 py-4",
				)}
			>
				<Topbar
					isMobile={isMobile!}
					title={showTextSubmitButton()!}
					isLoading={isLoading}
				/>

				<Reply isReply={isReply!} dataTweet={dataTweet!} />

				<section className="flex items-start justify-start gap-x-5 w-full">
					<Image
						src={imageUrl}
						alt="User Profile"
						width={35}
						height={35}
						priority
						className="object-cover rounded-full w-[35px] h-[35px]"
					/>
					<section className="flex-1 flex flex-col space-y-8">
						<FormField
							control={form.control}
							name="text"
							render={({ field }) => (
								<FormItem className="flex-1 mt-2">
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
						<PreviewImage
							previewImage={previewImage}
							setPreviewImage={setPreviewImage}
						/>
					</section>
				</section>

				<div className="h-[1px] w-full bg-gray-300" />

				<section className="flex items-center justify-between">
					<div>
						<Label
							htmlFor={`image-upload-${htmlForId}`}
							className="cursor-pointer"
						>
							<ImageIcon size="20px" className="text-blue hover:text-blue/90" />
						</Label>
						<Input
							accept="image/*"
							id={`image-upload-${htmlForId}`}
							type="file"
							onChange={onChangeImage}
							className="hidden"
						/>
					</div>

					{!isMobile && (
						<SubmitButton
							isMobile={isMobile!}
							isLoading={isLoading}
							title={showTextSubmitButton()!}
						/>
					)}
				</section>
			</form>
		</Form>
	);
};

export default CreateTweetForm;
