import { ReportToEnum } from "@/lib/enum";
import prisma from "@/lib/prisma";
import EmptyData from "@/components/empty-data";
import CardReport from "@/components/reports/card-report";

const AdminReportsPage = async () => {
  const reports = await prisma.report.findMany({
    include: { sender: true },
    where: { report_to: ReportToEnum.admin },
    orderBy: { created_at: "desc" },
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

export default AdminReportsPage;
