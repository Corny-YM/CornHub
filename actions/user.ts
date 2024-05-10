import { User } from "@prisma/client";

import defHttp from "@/lib/defHttp";

export const store = async (user: {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  avatar?: string | null;
  last_sign_in?: Date | null;
}): Promise<User> => defHttp.post("users", { user });
