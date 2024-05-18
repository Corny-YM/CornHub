import { Follower, Friend, FriendRequest } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "friends";

// Khi người dùng gửi lời mời kết bạn
// Bên phía người gửi => hiển thị nút đã gửi lời mời kết bạn
// Bên phía người nhận => hiển thị chấp nhận hoặc hủy bỏ lời mời kết bạn
export const getFriendStatus = async (data: {
  userId: string;
  friendId: string;
}): Promise<{
  friend: Friend;
  follower: Follower;
  friendRequest: FriendRequest;
}> => defHttp.post(`${indexApi}/status`, data);
