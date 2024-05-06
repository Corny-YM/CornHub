import { cn } from "@/lib/utils";

import GroupCard from "@/components/pages/groups/group-card";

const GroupJoinPage = () => {
  return (
    <div className="flex-1 h-full px-8 pt-4">
      <div className="font-semibold text-lg mb-4">
        Tất cả các nhóm bạn đã tham gia
      </div>

      <div
        className={cn(
          "w-full grid gap-2 pb-4",
          "grid-cols-1",
          "xl:grid-cols-2",
          "min-[1440px]:grid-cols-3"
        )}
      >
        {Array.from({ length: 50 }).map((item) => (
          <GroupCard key={item + ""} />
        ))}
      </div>
    </div>
  );
};

export default GroupJoinPage;
