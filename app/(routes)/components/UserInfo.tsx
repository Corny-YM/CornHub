import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const UserInfo = () => {
  const { user } = useUser();

  if (!user) return null;
  return (
    <div className="px-2 flex justify-center items-center">
      <div className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70">
        <div className="relative flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
          <Image
            className="absolute w-full h-full aspect-square"
            priority
            src={user?.imageUrl!}
            alt={user?.fullName || ""}
            fill
          />
        </div>
        <div className="font-semibold">{user?.fullName || "---"}</div>
      </div>
    </div>
  );
};

export default UserInfo;
