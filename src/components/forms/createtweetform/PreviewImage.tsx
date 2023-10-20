"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface Props {
	previewImage: string;
	setPreviewImage: Dispatch<SetStateAction<string>>;
}

const PreviewImage = ({ previewImage, setPreviewImage }: Props) => {
	return (
		previewImage && (
			<div className="relative">
				<div className="absolute top-3 right-3">
					<Button
						onClick={() => setPreviewImage("")}
						size="icon"
						variant="ghost"
						className="rounded-xl !text-white bg-black-100/90 hover:bg-black-100/80"
					>
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
		)
	);
};

export default PreviewImage;
