import { Reaction, User } from "@prisma/client";

import defHttp from "@/lib/defHttp";

export interface IRequestData {
  type: string;
  user_id: string;
  post_id: number;
  comment_id?: number;
  reply_id?: number;
}

const indexApi = "reactions";

export interface IReactionTypes {
  type: string;
  _count: { _all: number };
}

export const index = async (params: {
  postId: number;
  commentId?: number;
  replyId?: number;
  type?: string;
}): Promise<(Reaction & { user: User })[]> => defHttp.get(indexApi, { params });

export const getAllReactionTypes = async (params: {
  postId: number;
  commentId?: number;
  replyId?: number;
}): Promise<IReactionTypes[]> => defHttp.get(`${indexApi}/types`, { params });

export const store = async (data: IRequestData): Promise<Reaction> =>
  defHttp.post(indexApi, data);

export const destroy = async (reactionId: number): Promise<Reaction> =>
  defHttp.delete(`${indexApi}/${reactionId}`);
