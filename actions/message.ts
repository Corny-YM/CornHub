import { File as IFile, Message, User } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "messages";

export interface IStoreData extends Record<string, any> {
  conversationId: string;
  content?: string | null;
  file?: File | null;
}

export const index = async ({
  cursor,
  conversationId,
}: {
  cursor: any;
  conversationId: string;
}): Promise<{
  items: (Message & { sender: User; file?: IFile })[];
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

export const destroyMessage = async (data: {
  id: number;
  type: string;
  conversationId: string;
}): Promise<Message> =>
  defHttp.post(`socket/${indexApi}/${data.id}/delete`, data);
