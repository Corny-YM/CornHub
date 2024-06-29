import {
  User,
  Conversation,
  File as IFile,
  ConversationMember,
} from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "conversations";

export type IConversation = Conversation & {
  createdBy: User;
  user?: User | null;
  file?: IFile | null;
};
export interface IStoreData {
  name: string;
  ids?: string[];
}

export const index = async (data: {
  cursor: any;
}): Promise<{ items: IConversation[]; nextCursor: any }> =>
  await defHttp.get(`${indexApi}`, { params: { cursor: data.cursor } });

export const store = async (data: IStoreData): Promise<IConversation> =>
  await defHttp.post(`${indexApi}`, data);

export const getMembers = async (
  id: string
): Promise<(ConversationMember & { member: User })[]> =>
  await defHttp.get(`${indexApi}/${id}/members`);

export const addMembers = async ({
  conversationId,
  ids,
}: {
  conversationId: string;
  ids: string[];
}): Promise<(ConversationMember & { member: User })[]> =>
  await defHttp.post(`${indexApi}/${conversationId}/members`, { ids });
