"use client";

import { useEffect, useState } from "react";
import CreateTweet from "./CreateTweet";

interface Props {
	imageUrl: string;
	userId: string;
}

const Modal = ({ imageUrl, userId }: Props) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<CreateTweet userId={userId} imageUrl={imageUrl} />
		</>
	);
};

export default Modal;
