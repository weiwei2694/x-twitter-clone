"use client";

import { DataNotification } from "@/interfaces/notification.interface";

interface Props {
  dataNotification: DataNotification
}

const LikeNotification = ({ dataNotification }: Props) => {
  return (
    <div>Like Notifications</div>
  )
}

export default LikeNotification