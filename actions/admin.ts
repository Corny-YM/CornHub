import { User } from "@prisma/client";

import defHttp from "@/lib/defHttp";

const indexApi = "admin";

export const banUser = async (userId: string): Promise<User> =>
  defHttp.post(`${indexApi}/ban-user`, { userId });

export const unBanUser = async (userId: string): Promise<User> =>
  defHttp.post(`${indexApi}/unban-user`, { userId });
