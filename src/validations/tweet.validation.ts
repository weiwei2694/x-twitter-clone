import * as z from "zod";

export const tweetSchema = z.object({
	text: z.string().min(1).max(255),
	imageUrl: z.string().optional(),
	userId: z.string(),
	parentId: z.string().optional(),
});
