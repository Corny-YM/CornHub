import { Follower, Friend, Group, Post, User } from "@prisma/client";

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
  userId: string,
  params?: any
): Promise<{
  friends: (Friend & { user: User; friend: User })[];
  totalFriends: number;
}> =>
  defHttp.get(`${indexApi}/${userId}/friends`, {
    params,
  });

export const getFollowing = async (
  userId: string,
  params?: any
): Promise<(Follower & { user: User; follower: User })[]> =>
  defHttp.get(`${indexApi}/${userId}/following`, {
    params,
  });

export const getFollowers = async (
  userId: string,
  params?: any
): Promise<(Follower & { user: User; follower: User })[]> =>
  defHttp.get(`${indexApi}/${userId}/followers`, {
    params,
  });

export const getStatusFollowers = async (
  userId: string,
  params?: any
): Promise<Follower[]> =>
  defHttp.get(`${indexApi}/${userId}/status-followers`, { params });

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

export const deniedFriendRequest = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}): Promise<Friend> =>
  defHttp.post(`${indexApi}/${userId}/denied-friend-request`, { friendId });

export const unfriend = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}): Promise<Friend> =>
  defHttp.post(`${indexApi}/${userId}/unfriend`, { friendId });

export const following = async ({
  userId,
  followerId,
}: {
  userId: string;
  followerId: string;
}): Promise<Follower> =>
  defHttp.post(`${indexApi}/${userId}/following`, { followerId });

export const unfollow = async ({
  userId,
  followerId,
}: {
  userId: string;
  followerId: string;
}): Promise<Follower> =>
  defHttp.post(`${indexApi}/${userId}/unfollow`, { followerId });
