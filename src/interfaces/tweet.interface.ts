import { Bookmark, Follower, Like, Thread, User } from "@prisma/client";

interface UserWithFollowers extends User {
    followers: Follower[];
    followings: Follower[];
}

interface Replies {
    id: string;
}

export interface TweetWithConnection extends Thread {
    replies: Replies[];
    user: UserWithFollowers;
    bookmarks: Bookmark[];
    likes: Like[]
}

export interface DataTweet {
    id: string;
    text: string;
    imageUrl: string | null;
    createdAt: Date;
    user: {
        name: string;
        username: string;
        imageUrl: string;
    }
}