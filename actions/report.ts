import { Report } from "@prisma/client";

import defHttp from "@/lib/defHttp";
import { ReportToEnum } from "@/lib/enum";

export interface IStoreData {
  report_to: ReportToEnum;
  sender_id: string;
  post_id?: number | null;
  user_id?: string | null;
  comment_id?: number | null;
  reply_id?: number | null;
  group_id?: number | null;
  description: string;
}

const indexApi = "reports";

export const store = async (data: IStoreData): Promise<Report> =>
  defHttp.post(indexApi, data);
