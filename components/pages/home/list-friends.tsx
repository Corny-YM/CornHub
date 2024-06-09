"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { Friend, User } from "@prisma/client";

interface Props {
  friends: (Friend & { user: User; friend: User })[];
}

const ListFriends = ({ friends }: Props) => {
  const { userId } = useAuth();

  return (
    <div className="w-full flex flex-col">
      {!friends.length && (
        <div className="opacity-60 px-4 text-sm">
          <i>Bạn chưa có bạn bè nào</i>
        </div>
      )}
      {friends.map((item) => {
        const { id, user_id, user, friend } = item;
        const person = user_id === userId ? friend : user;
        return (
          <div
            key={id}
            className="px-2 flex justify-center items-center min-h-11"
          >
            <Link
              className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70"
              href={`/account/${person.id}`}
            >
              <div className="relative flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
                <Image
                  className="absolute w-full h-full aspect-square"
                  priority
                  src={person.avatar || ""}
                  alt={person.full_name || `friend-avatar-${id}`}
                  fill
                  sizes="w-9"
                />
              </div>
              <div className="font-semibold line-clamp-2 py-3 text-sm">
                {person.full_name || "---"}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ListFriends;
