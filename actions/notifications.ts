import {
  Post,
  User,
  Group,
  Comment,
  CommentReply,
  Notification,
} from "@prisma/client";

import defHttp from "@/lib/defHttp";

export type INotification = Notification & {
  post: Post;
  group: Group;
  reply: CommentReply;
  sender: User;
  comment: Comment;
};

const indexApi = "notifications";

export const getByUserId = async (userId: string): Promise<INotification[]> =>
  defHttp.get(`${indexApi}/user/${userId}`);
