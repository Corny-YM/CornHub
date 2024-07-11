"use client";

import Image from "next/image";
import { Report } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { show } from "@/actions/user";
import EmptyData from "@/components/empty-data";
import Loading from "@/components/icons/loading";
import NoBackground from "@/public/no-background.jpg";
import AvatarImg from "../avatar-img";
import CardUserDetail from "./card-user-detail";

interface Props {
  id: string;
  data: Report;
  enabled?: boolean;
}

const InfoUser = ({ id, data, enabled }: Props) => {
  const { data: userData, isLoading } = useQuery({
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
  if (!userData) return <EmptyData />;

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-center shadow-2xl rounded-b-lg overflow-hidden dark:border dark:border-solid dark:border-neutral-600/50">
        <div className="relative w-full aspect-[5/1] flex items-center justify-center">
          <Image
            className="absolute w-full h-full object-cover"
            src={userData.cover || NoBackground}
            alt="banner"
            fill
            priority
          />
        </div>
      </div>
      <div className="w-full flex items-center px-4 -mt-4">
        <AvatarImg className="w-20 h-20" src={userData.avatar} />
        <div className="ml-2 font-semibold line-clamp-1">
          {userData.full_name || "---"}
        </div>
      </div>

      {!!userData.userDetails?.[0] && (
        <CardUserDetail infoDetails={userData.userDetails[0]} />
      )}
    </div>
  );
};

export default InfoUser;
