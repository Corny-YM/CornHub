import prisma from "@/lib/prisma";
import { TypeNotificationEnum } from "@/lib/enum";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

interface IData {
  receiver_id?: string | null;
  post_id?: number | null;
  comment_id?: number | null;
  reply_id?: number | null;
  group_id?: number | null;
  type: keyof typeof TypeNotificationEnum;
}

export default async function (data: IData): Promise<void> {
  console.log("Sending Notification");
  const { userId } = auth();
  if (!userId) return;

  const currentUser = await prisma.user.findFirst({ where: { id: userId } });
  if (!currentUser) return;

  const { receiver_id, type, post_id, comment_id, reply_id, group_id } = data;

  let url = "";
  let description = "";
  let receiver: User | null = null;

  if (type === TypeNotificationEnum.reaction && post_id) {
    if (reply_id) {
      const res = await prisma.commentReply.findFirst({
        include: { user: true },
        where: { id: reply_id },
      });
      receiver = res?.user!;
      description = `<strong>${currentUser.full_name}</strong> đã tương tác phản hồi của bạn`;
    } else if (comment_id) {
      const res = await prisma.comment.findFirst({
        include: { user: true },
        where: { id: comment_id },
      });
      receiver = res?.user!;
      description = `<strong>${currentUser.full_name}</strong> đã tương tác bình luận của bạn`;
    } else {
      const res = await prisma.post.findFirst({
        include: { user: true },
        where: { id: post_id },
      });
      receiver = res?.user!;
      description = `<strong>${currentUser.full_name}</strong> đã tương tác bài viết của bạn`;
    }
  } else if (type === TypeNotificationEnum.reply && comment_id) {
    const res = await prisma.comment.findFirst({
      include: { user: true },
      where: { id: comment_id },
    });
    receiver = res?.user!;
    description = `<strong>${currentUser.full_name}</strong> đã phản hồi bình luận của bạn`;
  } else if (type === TypeNotificationEnum.comment && post_id) {
    const res = await prisma.post.findFirst({
      include: { user: true },
      where: { id: post_id },
    });
    receiver = res?.user!;
    description = `<strong>${currentUser.full_name}</strong> đã bình luận bài viết của bạn`;
  }

  if (receiver_id) {
    receiver = await prisma.user.findFirst({
      where: { id: receiver_id },
    });
    if (type === TypeNotificationEnum.friend) {
      description = `<strong>${currentUser.full_name}</strong> đã gửi cho bạn lời mời kết bạn`;
    } else if (type === TypeNotificationEnum.group) {
      description = `<strong>${currentUser.full_name}</strong> đã gửi cho bạn lời mời vào nhóm`;
    }
  }

  if (!receiver || receiver.id === userId) return;

  if (type === TypeNotificationEnum.friend) {
    url = `/account/${userId}`;
  } else if (type === TypeNotificationEnum.group && group_id) {
    url = `/groups/${group_id}`;
  } else if (post_id && group_id) {
    url = `/groups/${group_id}/posts/${post_id}`;
  } else if (post_id) {
    url = `/${receiver.id}/posts/${post_id}`;
  }

  const existed = await prisma.notification.findFirst({
    where: {
      type: type,
      sender_id: userId,
      receiver_id: receiver.id,
      post_id: post_id,
      comment_id: comment_id,
      reply_id: reply_id,
    },
  });
  if (existed) return;
  await prisma.notification.create({
    data: {
      url: url,
      description: description,
      type: type,
      sender_id: userId,
      receiver_id: receiver.id,
      group_id: group_id,
      post_id: post_id,
      comment_id: comment_id,
      reply_id: reply_id,
    },
  });
}
