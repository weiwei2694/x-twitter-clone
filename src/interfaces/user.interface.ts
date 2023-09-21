import { Follower, User } from "@prisma/client";

export interface UserWithFollowers extends User {
    followers: Follower[];
    followings: Follower[];
  }