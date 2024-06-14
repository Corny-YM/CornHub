import { Group, Post, Reaction, User, File as IFile } from "@prisma/client";

import { TypeFileEnum } from "@/lib/enum";
import defHttp from "@/lib/defHttp";

interface IUpdateData extends Record<string, any> {
  group_name?: string;
  cover?: File | string | null;
  status?: Boolean;
  approve_members?: Boolean;
  approve_posts?: Boolean;
  description?: Boolean;
}

const indexApi = "groups";

export const store = async (data: any): Promise<Group> =>
  await defHttp.post(indexApi, data);

export const update = async (data: IUpdateData): Promise<Group> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data?.[key];
    if (!value) return;
    formData.append(key, value);
  });
  return await defHttp.put(indexApi, formData);
};

// TODO: api for remove cover
export const removeCover = async (): Promise<Group> =>
  defHttp.delete(`${indexApi}/remove/cover`);

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
