import { Group, Post, Reaction, User, File as IFile } from "@prisma/client";

import defHttp from "@/lib/defHttp";
import { TypeFileEnum } from "@/lib/enum";
import { IGroupWithCountMember } from "@/providers/group-provider";

interface IUpdateData extends Record<string, any> {
  group_name?: string;
  cover?: File | string | null;
  status?: boolean | null;
  approve_members?: boolean | null;
  approve_posts?: boolean | null;
  description?: boolean | null;
}

const indexApi = "groups";

export const store = async (data: any): Promise<Group> =>
  await defHttp.post(indexApi, data);

export const update = async ({
  data,
  groupId,
}: {
  groupId: number;
  data: IUpdateData;
}): Promise<IGroupWithCountMember> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data?.[key];
    formData.append(key, value);
  });
  return await defHttp.put(`${indexApi}/${groupId}`, formData);
};

export const removeCover = async (groupId: number): Promise<Group> =>
  defHttp.delete(`${indexApi}/${groupId}/remove/cover`);

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

export const getFiles = async (
  groupId: number,
  params?: { type: TypeFileEnum.image | TypeFileEnum.video }
): Promise<IFile[]> =>
  await defHttp.get(`${indexApi}/${groupId}/files`, { params });

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
