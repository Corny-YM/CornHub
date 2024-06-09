import { CommentReply } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "replies";

interface IStoreData extends Record<string, any> {
  postId: number;
  commentId: number;
  content?: string;
  file?: File;
}

export const store = async (data: IStoreData): Promise<CommentReply> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data?.[key];
    if (!value) return;
    formData.append(key, value);
  });
  return defHttp.put(indexApi, formData);
};
