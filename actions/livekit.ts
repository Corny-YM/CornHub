import defHttp from "@/lib/defHttp";

const indexApi = "livekit";

export const getToken = async (params: {
  room: string;
  username: string;
}): Promise<{ token: string }> => defHttp.get(indexApi, { params });
