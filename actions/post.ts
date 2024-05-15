import { Post, Reaction } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "posts";

export const store = async (data: any): Promise<Post> =>
  defHttp.post(indexApi, data);

// =============================Comments=============================
export const countComments = async (id: number): Promise<number> =>
  defHttp.get(`${indexApi}/${id}/comments/count`);

export const getComments = async (id: number): Promise<Comment[]> =>
  defHttp.get(`${indexApi}/${id}/comments`);

// =============================Reactions=============================
export const countReactions = async (id: number): Promise<number> =>
  defHttp.get(`${indexApi}/${id}/reactions/count`);

export const getCurrentUserReaction = async ({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}): Promise<Reaction> =>
  defHttp.get(`${indexApi}/${postId}/reactions/${userId}`);
