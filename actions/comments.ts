import { Comment } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "comments";

interface ICommentData extends Record<string, any> {
  content?: string;
  postId: number;
  commentId?: number;
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
