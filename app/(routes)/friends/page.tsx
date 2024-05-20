import { cn } from "@/lib/utils";
import FriendCard from "@/components/pages/friends/friend-card";

const FriendsPage = () => {
  return (
    <div className="flex-1 h-full px-8 pt-4">
      <div className="font-semibold text-lg mb-4">Danh sách bạn bè</div>

      <div
        className={cn(
          "w-full grid gap-2 pb-4",
          "grid-cols-1",
          "md:grid-cols-2",
          "lg:grid-cols-3",
          "xl:grid-cols-4",
          "min-[1440px]:grid-cols-5",
          "2xl:grid-cols-6"
        )}
      >
        {Array.from({ length: 50 }).map((item) => (
          <FriendCard key={item + ""} />
        ))}
      </div>
    </div>
  );
};

export default FriendsPage;
