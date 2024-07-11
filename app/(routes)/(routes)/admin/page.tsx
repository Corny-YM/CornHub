import {
  Users,
  AppWindow,
  UserRound,
  UsersRound,
  CloudUpload,
  MessagesSquare,
  MessageCircleCode,
  MessageSquareText,
} from "lucide-react";
import React from "react";

import prisma from "@/lib/prisma";
import CardTotal from "@/components/pages/report/card-total";

const AdminPage = async () => {
  const userTotal = await prisma.user.count({});
  const groupTotal = await prisma.group.count({});
  const postTotal = await prisma.post.count({});
  const commentTotal = await prisma.comment.count({});
  const replyTotal = await prisma.commentReply.count({});
  const reactionTotal = await prisma.reaction.count({});
  const messageTotal = await prisma.message.count({});
  const fileTotal = await prisma.file.count({});

  return (
    <div className="w-full grid grid-cols-3 gap-2">
      <CardTotal
        title="Tổng số người dùng"
        href="/admin/users"
        total={userTotal}
        icon={<UserRound size={20} />}
      />
      <CardTotal
        title="Tổng số nhóm"
        href="/admin/groups"
        total={groupTotal}
        icon={<UsersRound size={20} />}
      />
      <CardTotal
        title="Tổng số bài viết"
        total={postTotal}
        icon={<AppWindow size={20} />}
      />
      <CardTotal
        title="Tổng số bình luận"
        total={commentTotal}
        icon={<MessageSquareText size={20} />}
      />
      <CardTotal
        title="Tổng số phản hồi"
        total={replyTotal}
        icon={<MessagesSquare size={20} />}
      />
      <CardTotal
        title="Tổng số tương tác"
        total={reactionTotal}
        icon={<Users size={20} />}
      />
      <CardTotal
        title="Tổng số tin nhắn"
        total={messageTotal}
        icon={<MessageCircleCode size={20} />}
      />
      <CardTotal
        title="Tổng số tệp tin"
        total={fileTotal}
        icon={<CloudUpload size={20} />}
      />
    </div>
  );
};

export default AdminPage;
