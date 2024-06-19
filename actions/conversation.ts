import { Conversation } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "conversations";

export interface IStoreData {
  name: string;
  ids?: string[];
}

export const store = async (data: IStoreData): Promise<Conversation> =>
  await defHttp.post(`${indexApi}`, data);
