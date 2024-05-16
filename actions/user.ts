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

export const isAddedFriend = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}): Promise<Friend & { user: User; friend: User }> =>
  defHttp.get(`${indexApi}/${userId}/friends/${friendId}/added`);
