import { Conversation } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "messages";

export interface IConversationData {
  name: string;
  ids?: string[];
}

export const storeConversation = async (
  data: IConversationData
): Promise<Conversation> => await defHttp.post(indexApi, data);
