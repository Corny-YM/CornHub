import { Group, Post, Reaction, User, File as IFile } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "groups";

export const store = async (data: any): Promise<Group> =>
  await defHttp.post(indexApi, data);

export const sendGroupRequest = async (data: {
  ids: string[];
  groupId: number;
}): Promise<any> => await defHttp.post(`${indexApi}/send-group-request`, data);

export const getMembers = async (
  groupId: number,
  params?: any
): Promise<User[]> =>
  await defHttp.get(`${indexApi}/${groupId}/members`, { params });

export const getPosts = async (
  groupId: number,
  params?: any
): Promise<
  (Post & {
    user: User;
    group: Group | null;
    file: IFile | null;
    reactions: Reaction[];
    _count: { comments: number; reactions: number };
  })[]
> => await defHttp.get(`${indexApi}/${groupId}/posts`, { params });

export const userJoinGroup = async ({
  groupId,
  userId,
}: {
  groupId: number;
  userId: string;
}) => await defHttp.get(`${indexApi}/${groupId}/users/${userId}/join`);

export const userFollowingGroup = async ({
  groupId,
  userId,
}: {
  groupId: number;
  userId: string;
}) => await defHttp.get(`${indexApi}/${groupId}/users/${userId}/following`);

export const userUnfollowGroup = async ({
  groupId,
  userId,
}: {
  groupId: number;
  userId: string;
}) => await defHttp.get(`${indexApi}/${groupId}/users/${userId}/unfollow`);

export const userLeaveGroup = async ({
  groupId,
  userId,
}: {
  groupId: number;
  userId: string;
}) => await defHttp.get(`${indexApi}/${groupId}/users/${userId}/leave`);

export const userDeniedGroupRequest = async (groupId: number) =>
  await defHttp.post(`${indexApi}/denied-group-request`, { groupId });
