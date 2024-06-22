import { Conversation, ConversationMember, User } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "conversations";

export interface IStoreData {
  name: string;
  ids?: string[];
}

export const store = async (data: IStoreData): Promise<Conversation> =>
  await defHttp.post(`${indexApi}`, data);

export const getMembers = async (
  id: string
): Promise<(ConversationMember & { member: User })[]> =>
  await defHttp.get(`${indexApi}/${id}/members`);
