import { Post, Reaction, Comment, User, File as IFile } from "@prisma/client";

import defHttp from "@/lib/defHttp";

interface IPostData extends Record<string, any> {
  status: string;
  userId: string;
  content: string;
  file?: File | null;
  groupId?: number | null;
}

const indexApi = "posts";

export const store = async (data: IPostData): Promise<Post> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data?.[key];
    if (!value) return;
    formData.append(key, value);
  });
  return defHttp.put(indexApi, formData);
};

export const destroy = async (id: number): Promise<number> =>
  defHttp.delete(`${indexApi}/${id}`);

// =============================Comments=============================
export const countComments = async (id: number): Promise<number> =>
  defHttp.get(`${indexApi}/${id}/comments/count`);

export const getComments = async (
  id: number
): Promise<
  (Comment & {
    user: User;
    file?: IFile;
    _count: { reacts: number; commentReplies: number };
  })[]
> => await defHttp.get(`${indexApi}/${id}/comments`);

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
