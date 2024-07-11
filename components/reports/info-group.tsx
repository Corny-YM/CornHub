"use client";

import Image from "next/image";
import { Report } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { show } from "@/actions/group";
import EmptyData from "@/components/empty-data";
import AvatarImg from "@/components/avatar-img";
import Loading from "@/components/icons/loading";
import NoBackground from "@/public/no-background.jpg";
import { formatAmounts } from "@/lib/utils";
import CardGroupDetail from "./card-group-detail";
import Link from "next/link";

interface Props {
  id: number;
  data: Report;
  enabled?: boolean;
}

const InfoGroup = ({ id, data, enabled }: Props) => {
  const { data: groupData, isLoading } = useQuery({
    enabled: enabled && !!id,
    queryKey: ["user", "show", id],
    queryFn: () => show(id),
  });

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  if (!groupData) return <EmptyData />;

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-center shadow-2xl rounded-b-lg overflow-hidden dark:border dark:border-solid dark:border-neutral-600/50">
        <div className="relative w-full aspect-[5/1] flex items-center justify-center">
          <Image
            className="absolute w-full h-full object-cover"
            src={groupData.cover || NoBackground}
            alt="banner"
            fill
            priority
          />
        </div>
      </div>
      <div className="w-full flex flex-col px-4 mt-2">
        <Link
          className="w-fit font-semibold line-clamp-1 hover:underline"
          href={`/groups/${groupData.id}`}
          target="_blank"
        >
          {groupData.group_name || "---"}
        </Link>
        <div>{formatAmounts(groupData._count.groupMembers)} thành viên</div>
      </div>

      <CardGroupDetail data={groupData} />
    </div>
  );
};

export default InfoGroup;
