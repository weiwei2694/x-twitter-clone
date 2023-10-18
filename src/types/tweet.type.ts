import { DetailTweet } from "@/interfaces/tweet.interface";

export type GetTweetsActionType = {
  data: DetailTweet[];
  hasNext: boolean;
}