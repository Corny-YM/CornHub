import {
  Post,
  User,
  Group,
  Friend,
  Follower,
  Reaction,
  File as IFile,
  UserDetail,
} from "@prisma/client";

import defHttp from "@/lib/defHttp";
import { TypeFileEnum } from "@/lib/enum";

const indexApi = "users";

interface IUpdateData extends Record<string, any> {
  // User
  cover?: File | string | null;
  avatar?: File | string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;

  // User details
  gender?: string | null;
  biography?: string | null;
  work?: string | null;
  education?: string | null;
  living?: string | null;
  country?: string | null;
  relationship?: string | null;
  portfolio?: string | null;
  birth?: string | null;
}

export const update = async (
  data: IUpdateData
): Promise<User & { userDetails: UserDetail[] }> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data?.[key];
    if (!value) return;
    formData.append(key, value);
  });
  return await defHttp.put(indexApi, formData);
};

export const store = async (user: {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  avatar?: string | null;
  last_sign_in?: Date | null;
}): Promise<User> => defHttp.post(indexApi, { user });

export const removeCover = async (): Promise<User> =>
  defHttp.delete(`${indexApi}/remove/cover`);

export const removeAvatar = async (): Promise<User> =>
  defHttp.delete(`${indexApi}/remove/avatar`);

export const getFiles = async (data: {
  userId: string;
  type?: TypeFileEnum.image | TypeFileEnum.video;
}): Promise<IFile[]> => {
  const { userId, type } = data;
  return defHttp.get(`${indexApi}/${userId}/files`, { params: { type } });
};

export const getPosts = async (
  userId: string
): Promise<
  (Post & {
    user: User;
    group: Group | null;
    file: IFile | null;
    reactions: Reaction[];
    _count: { comments: number; reactions: number };
  })[]
> => defHttp.get(`${indexApi}/${userId}/posts`);

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

export const searching = async (params: {
  searchKey: string;
  limit?: number;
}): Promise<{
  users: User[];
  groups: Group[];
}> => defHttp.get(`${indexApi}/searching`, { params });
