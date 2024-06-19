import { Message } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "messages";

export interface IStoreData {}

export const store = async (data: IStoreData): Promise<Message> =>
  await defHttp.post(indexApi, data);
