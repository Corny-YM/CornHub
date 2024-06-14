"use client";

import Link from "next/link";
import {
  Boxes,
  GitPullRequestCreateArrow,
  Newspaper,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useGroupsContext } from "@/providers/groups-provider";
import { Button } from "@/components/ui/button";
import ModalCreate from "./modal-create";
import { Group } from "@prisma/client";
import AvatarImg from "@/components/avatar-img";
import { Separator } from "@/components/ui/separator";

const actions = [
  { label: "Nhóm của bạn", url: "joins", icon: Boxes },
  { label: "Bảng feed của bạn", url: "feed", icon: Newspaper },
  {
    label: "Lời mời vào nhóm",
    url: "requests",
    icon: GitPullRequestCreateArrow,
  },
];

interface Props {
  groups: Group[];
}

const SidebarLeft = ({ groups }: Props) => {
  const { pathname } = useGroupsContext();

  return (
    <div className="side-bar">
      <div className="w-full flex flex-col px-2 pb-4">
        <div className="font-semibold text-xl mb-4 px-2">Nhóm</div>

        <div className="w-full flex flex-col gap-y-2">
          {actions.map(({ label, url, icon: Icon }) => (
            <Button
              key={url}
              className={cn(
                "w-full flex items-center justify-start",
                pathname?.includes(url) && "bg-primary/50 hover:bg-primary/60"
              )}
              variant="outline"
              asChild
            >
              <Link href={url}>
                <Icon className="mr-2" size={20} />
                {label}
              </Link>
            </Button>
          ))}

          <ModalCreate>
            <Button className="w-full bg-primary/50" size="sm">
              <Plus className="mr-2" size={20} /> Tạo nhóm mới
            </Button>
          </ModalCreate>

          {/*  */}
          <Separator className="my-2" />
          <div className="font-semibold px-2">Nhóm của bạn</div>

          {groups.map((group) => (
            <Button
              key={group.id}
              className="w-full h-fit flex items-center p-2"
              variant="outline"
              asChild
            >
              <Link
                className="w-full flex items-center justify-between"
                href={`/groups/${group.id}`}
              >
                <AvatarImg className="mr-2" src={group.cover} isGroup />
                <div className="flex-1 font-semibold">{group.group_name}</div>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
