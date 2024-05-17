import { Friend, Group, Post, User } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "users";

export const store = async (user: {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  avatar?: string | null;
  last_sign_in?: Date | null;
}): Promise<User> => defHttp.post(indexApi, { user });

export const getPosts = async (
  userId: string
): Promise<(Post & { user: User; group: Group })[]> =>
  defHttp.get(`${indexApi}/${userId}/posts`);

export const getFriends = async (
  userId: string
): Promise<(Friend & { user: User; friend: User })[]> =>
  defHttp.get(`${indexApi}/${userId}/friends`);

// TODO: Khi người dùng gửi lời mời kết bạn
// Bên phía người gửi => hiển thị nút đã gửi lời mời kết bạn
// Bên phía người nhận => hiển thị chấp nhận hoặc hủy bỏ lời mời kết bạn
export const isAddedFriend = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}): Promise<Friend & { user: User; friend: User }> =>
  defHttp.get(`${indexApi}/${userId}/friends/${friendId}/added`);

export const sendFriendRequest = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}): Promise<Friend> =>
  defHttp.post(`${indexApi}/${userId}/send-friend-request`, { friendId });

export const acceptFriendRequest = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}): Promise<Friend> =>
  defHttp.post(`${indexApi}/${userId}/accept-friend-request`, { friendId });

export const unFriend = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}): Promise<Friend> =>
  defHttp.post(`${indexApi}/${userId}/unfriend`, { friendId });
