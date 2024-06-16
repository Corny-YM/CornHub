import {
  User,
  Comment,
  Reaction,
  CommentReply,
  File as IFile,
} from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "comments";

export interface ICommentData extends Record<string, any> {
  postId: number;
  commentId?: number;
  content?: string;
  file?: File;
}

export const store = async (data: ICommentData): Promise<Comment> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data?.[key];
    if (!value) return;
    formData.append(key, value);
  });
  return defHttp.put(indexApi, formData);
};

export const update = async ({
  commentId,
  data,
}: {
  commentId: number;
  data: ICommentData;
}): Promise<Comment> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data?.[key];
    if (!value) return;
    formData.append(key, value);
  });
  return defHttp.put(`${indexApi}/${commentId}`, formData);
};

export const destroy = async (commentId: number): Promise<Comment> =>
  defHttp.delete(`${indexApi}/${commentId}`);

export const getReplies = async (data: {
  postId: number;
  commentId: number;
}): Promise<
  (CommentReply & {
    user: User;
    file?: IFile;
    reactions: Reaction[];
    _count: { reactions: number };
  })[]
> => {
  const { commentId, postId } = data;
  return defHttp.get(`${indexApi}/${commentId}/replies`, {
    params: { postId },
  });
};
