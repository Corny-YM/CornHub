"use client";

import { useMemo } from "react";
import { Group, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { getMembers } from "@/actions/group";
import { Skeleton } from "@/components/ui/skeleton";
import AvatarImg from "@/components/avatar-img";

interface Props {
  data: Group & { owner: User; _count: { groupMembers: number } };
}

const CardGroupDetail = ({ data }: Props) => {
  const { id, description } = data;

  const { data: members, isLoading } = useQuery({
    queryKey: ["group", "members", id],
    queryFn: () => getMembers(id),
  });

  const content = useMemo(() => {
    if (isLoading) return <Skeleton className="friends-icon" />;
    if (!members || !members.length) return null;
    return members.map((item, index) => (
      <div
        key={item.id}
        className="friends-icon"
        style={{ zIndex: length - index + 5 }}
      >
        <AvatarImg src={item.avatar} />
      </div>
    ));
  }, [members, isLoading]);

  return (
    <div className="px-4 mt-2 space-y-2">
      {content}

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: description || "" }}
      />
    </div>
  );
};

export default CardGroupDetail;
