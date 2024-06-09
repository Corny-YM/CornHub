"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Contact, MonitorPlay, UsersRound } from "lucide-react";
import Link from "next/link";

const actions = [
  { url: "/friends", label: "Bạn bè", icon: Contact },
  { url: "/groups", label: "Nhóm", icon: UsersRound },
  { url: "/watch", label: "Video", icon: MonitorPlay },
];

const UserActions = () => {
  const router = useRouter();
  const { user } = useUser();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const url = target.dataset.url;
      if (!url) return;
      router.push(url);
    },
    [router]
  );

  const userInfo = useMemo(() => {
    if (!user) return null;
    return (
      <div className="px-2 flex justify-center items-center">
        <Link
          href={`/account/${user.id}`}
          className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70 text-inherit hover:no-underline"
        >
          <div className="relative flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
            <Image
              className="absolute w-full h-full aspect-square"
              priority
              src={user.imageUrl!}
              alt={user.fullName || ""}
              fill
              sizes="w-9"
            />
          </div>
          <div className="font-semibold">{user.fullName || "---"}</div>
        </Link>
      </div>
    );
  }, [user, handleClick]);

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
    [handleClick]
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
