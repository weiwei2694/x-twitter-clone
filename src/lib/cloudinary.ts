import axios from "axios";

export const uploadFile = async (file: File) => {
	const formData = new FormData();
	formData.append("file", file!);
	formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET!);

	const response = await axios.post(
		`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
		formData
	);

	const isStatus200 = response.status === 200;
	if (!isStatus200) return;

	return response.data.url;
};
