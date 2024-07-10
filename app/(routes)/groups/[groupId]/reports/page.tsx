import { auth } from "@clerk/nextjs/server";

import { ReportToEnum } from "@/lib/enum";
import prisma from "@/lib/prisma";
import EmptyData from "@/components/empty-data";
import CardReport from "@/components/reports/card-report";
import { redirect } from "next/navigation";

interface Props {
  params: { groupId: string };
}

const ReportsPage = async ({ params }: Props) => {
  const { userId } = auth();

  const group = await prisma.group.findFirst({
    where: { id: +params.groupId },
  });

  if (!userId || !group) redirect("/groups/join");

  if (userId !== group.owner_id) redirect(`/groups/${group.id}`);

  const reports = await prisma.report.findMany({
    include: {
      sender: true,
      user: true,
      group: true,
      post: true,
      comment: true,
      reply: true,
    },
    where: { group_id: +params.groupId, report_to: ReportToEnum.group },
  });

  return (
    <div className="w-full flex flex-col justify-center items-center mt-4 pb-4 px-4 gap-4">
      {!reports.length && <EmptyData />}
      {!!reports.length && (
        <div className="grid grid-cols-3 gap-2 w-full">
          {reports.map((report) => (
            <CardReport key={report.id} data={report} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
