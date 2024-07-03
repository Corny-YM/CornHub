import Tabs from "@/components/pages/account/friends/tabs";

interface Props {
  children: React.ReactNode;
  params: { userId: string };
}

const UserFriendsLayout = ({ children }: Props) => {
  return (
    <div className="mt-4 flex w-full pb-4 relative">
      <div className="w-full h-full flex flex-col p-4 rounded-lg dark:bg-neutral-800 bg-gray-100">
        <div className="font-semibold text-xl mb-4">Bạn bè</div>

        {/* Tabs */}
        <Tabs />

        {children}
      </div>
    </div>
  );
};

export default UserFriendsLayout;
