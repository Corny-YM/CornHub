import CardMember from "@/components/pages/groups/[groupId]/card-member";
import React from "react";

interface Props {
  params: { groupId: string };
}

const GroupIdMembersPage = ({ params }: Props) => {
  const { groupId } = params;
  return (
    <div className="w-full flex flex-col justify-center items-center mt-4 pb-4 px-4 gap-4">
      {/* Admin */}
      <div className="w-full max-w-[680px] flex flex-col px-2 pb-3 pt-1 rounded-lg shadow-sm dark:bg-neutral-800/40 bg-[#f0f2f5]">
        <div className="w-full flex flex-col justify-center">
          <div className="font-semibold px-2 mb-2">
            Quản trị viên & người kiểm duyệt
          </div>
          <div className="w-full flex flex-col gap-2">
            <CardMember />
            <CardMember />
            <CardMember />
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="w-full max-w-[680px] flex flex-col px-2 pb-3 pt-1 rounded-lg shadow-sm dark:bg-neutral-800/40 bg-[#f0f2f5]">
        <div className="w-full flex flex-col justify-center">
          <div className="font-semibold px-2 mb-2">Thành viên</div>
          <div className="w-full flex flex-col gap-2">
            <CardMember />
            <CardMember />
            <CardMember />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupIdMembersPage;
