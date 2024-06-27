import { File as IFile, Message, MessageReaction, User } from "@prisma/client";

import defHttp from "@/lib/defHttp";

export type IMessage = Message & {
  sender: User;
  file?: IFile;
  messageReactions: MessageReaction[];
  _count: { messageReactions: number };
};

export interface IStoreData extends Record<string, any> {
  conversationId: string;
  content?: string | null;
  file?: File | null;
}

const indexApi = "messages";

export const index = async ({
  cursor,
  conversationId,
}: {
  cursor: any;
  conversationId: string;
}): Promise<{
  items: IMessage[];
  nextCursor: any;
}> => defHttp.get(indexApi, { params: { cursor, conversationId } });

export const store = async (data: IStoreData): Promise<Message> => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data?.[key];
    formData.append(key, value);
  });
  return await defHttp.put(`socket/${indexApi}/`, formData);
};

export const getReactions = async (
  id: number,
  params?: any
): Promise<(MessageReaction & { user: User })[]> =>
  defHttp.get(`socket/${indexApi}/${id}/reaction`, { params });

export const reactionMessage = async (data: {
  id: number;
  type: string;
  conversationId: string;
}): Promise<Message> =>
  defHttp.post(`socket/${indexApi}/${data.id}/reaction`, data);

export const destroyMessage = async (data: {
  id: number;
  type: string;
  conversationId: string;
}): Promise<Message> =>
  defHttp.post(`socket/${indexApi}/${data.id}/delete`, data);
