import * as z from "zod";

export const userSchema = z.object({
	id: z.string(),
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

export const editUserSchema = z.object({
	id: z.string(),
	bannerUrl: z.string().optional(),
	imageUrl: z.string(),
	name: z
		.string()
		.min(1, {
			message: "name can't be blank",
		})
		.max(30, {
			message: "maximum character is 30",
		}),
	bio: z.string().max(255, {
		message: "maximum character is 255",
	}),
	location: z.string().max(30, {
		message: "maximum character is 30",
	}),
	website: z.string().max(100, {
		message: "maximum character is 100",
	}),
});
