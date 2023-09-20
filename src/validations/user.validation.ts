import * as z from "zod";

export const userSchema = z.object({
	id: z.string(),
	imageUrl: z.string(),
	name: z
		.string()
		.min(1, {
			message: "name required",
		})
		.max(30, {
			message: "maximum character is 30",
		}),
	bio: z.string().max(255, {
		message: "maximum character is 255",
	}),
});
