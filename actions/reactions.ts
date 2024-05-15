import { Reaction } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "reactions";

export const store = async (data: any): Promise<Reaction> =>
  defHttp.post(indexApi, data);

export const destroy = async (reactionId: number): Promise<Reaction> =>
  defHttp.delete(`${indexApi}/${reactionId}`);
