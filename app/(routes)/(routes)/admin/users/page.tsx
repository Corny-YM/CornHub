import prisma from "@/lib/prisma";

import EmptyData from "@/components/empty-data";
import CardUser from "@/components/pages/report/card-user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

const AdminUsersPage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/");

  const users = await prisma.user.findMany({
    where: { id: { not: userId } },
  });

  return (
    <div className="flex-1 h-full px-8 pt-4">
      <div className="font-semibold text-lg mb-4">Danh sách người dùng</div>

      {!users.length && <EmptyData />}

      {!!users.length && (
        <div
          className={cn(
            "w-full grid gap-2 pb-4",
            "grid-cols-1",
            "md:grid-cols-2",
            "lg:grid-cols-3",
            "xl:grid-cols-4",
            "min-[1440px]:grid-cols-5",
            "2xl:grid-cols-6"
          )}
        >
          {users.map((user) => (
            <CardUser key={user.id} data={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
