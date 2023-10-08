"use server";

import { FollowUserNotificationActionProps } from "@/interfaces/notification.interface";
import prisma from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const followUserNotificationAction = async ({
	userId,
	parentIdUser,
	sourceId,
	path,
}: FollowUserNotificationActionProps) => {
  if (!userId) throw new Error("userId required")
  if (!parentIdUser) throw new Error("parentIdUser required")
  if (!sourceId) throw new Error("sourceId required")
  if (!path) throw new Error("path required")

	try {
		await prisma.notification.create({
			data: {
				userId,
				parentIdUser,
				sourceId,
				activityType: "Follow",
				parentType: "User",
			},
		});
	} catch (error) {
		console.info("[ERROR_FOLLOW_USER_NOTIFICATION_ACTION]", error);
	} finally {
		revalidatePath(path);
	}
};
