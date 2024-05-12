"use client";

import Image from "next/image";
import { useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Contact, MonitorPlay, UsersRound } from "lucide-react";

const actions = [
  {
    url: "/friends",
    label: "Bạn bè",
    icon: Contact,
  },
  {
    url: "/groups",
    label: "Nhóm",
    icon: UsersRound,
  },
  {
    url: "/watch",
    label: "Video",
    icon: MonitorPlay,
  },
];

const UserActions = () => {
  const router = useRouter();
  const { user } = useUser();

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    const url = target.dataset.url;
    if (!url) return;
    router.push(url);
  }, []);

  const userInfo = useMemo(() => {
    if (!user) return null;
    return (
      <div className="px-2 flex justify-center items-center">
        <div
          className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70"
          data-url={`/account/${user.id}`}
          onClick={handleClick}
        >
          <div className="relative flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
            <Image
              className="absolute w-full h-full aspect-square"
              priority
              src={user.imageUrl!}
              alt={user.fullName || ""}
              fill
            />
          </div>
          <div className="font-semibold">{user.fullName || "---"}</div>
        </div>
      </div>
    );
  }, [user]);

  const content = useMemo(
    () =>
      actions.map(({ url, label, icon: Icon }) => (
        <div key={url} className="px-2 flex justify-center items-center">
          <div
            className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70"
            data-url={url}
            onClick={handleClick}
          >
            <div className="flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
              <Icon />
            </div>
            <div className="font-semibold">{label}</div>
          </div>
        </div>
      )),
    [actions]
  );

  return (
    <>
      {/* Info */}
      {userInfo}
      {/* Friends */}
      {content}
    </>
  );
};

export default UserActions;
