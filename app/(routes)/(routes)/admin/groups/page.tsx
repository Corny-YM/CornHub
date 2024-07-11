import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import EmptyData from "@/components/empty-data";
import CardGroup from "@/components/pages/report/card-group";

const AdminGroupsPage = async () => {
  const groups = await prisma.group.findMany({});

  return (
    <div className="flex-1 h-full px-8 pt-4">
      <div className="font-semibold text-lg mb-4">Danh sách nhóm</div>

      {!groups.length && <EmptyData />}
      {!!groups.length && (
        <div
          className={cn(
            "w-full grid gap-2 pb-4",
            "grid-cols-1",
            "xl:grid-cols-2",
            "min-[1440px]:grid-cols-3"
          )}
        >
          {groups.map((item) => (
            <CardGroup key={item.id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGroupsPage;
