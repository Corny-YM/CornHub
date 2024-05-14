import { Post } from "@prisma/client";

import defHttp from "@/lib/defHttp";

export const store = async (data: any): Promise<Post> =>
  defHttp.post("posts", data);
