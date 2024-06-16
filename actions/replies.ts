import { CommentReply } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "replies";

export interface IReplyData extends Record<string, any> {
  postId: number;
  commentId: number;
  content?: string;
  file?: File;
}

export const store = async (data: IReplyData): Promise<CommentReply> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data?.[key];
    if (!value) return;
    formData.append(key, value);
  });
  return defHttp.put(indexApi, formData);
};

export const update = async ({
  replyId,
  data,
}: {
  replyId: number;
  data: IReplyData;
}): Promise<CommentReply> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data?.[key];
    if (!value) return;
    formData.append(key, value);
  });
  return defHttp.put(`${indexApi}/${replyId}`, formData);
};

export const destroy = async (replyId: number): Promise<CommentReply> =>
  defHttp.delete(`${indexApi}/${replyId}`);
