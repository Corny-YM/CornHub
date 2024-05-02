import { Contact, MonitorPlay, UsersRound } from "lucide-react";

const UserActions = () => {
  return (
    <>
      {/* Friends */}
      <div className="px-2 flex justify-center items-center">
        <div className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70">
          <div className="flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
            <Contact />
          </div>
          <div className="font-semibold">Bạn bè</div>
        </div>
      </div>

      {/* Group */}
      <div className="px-2 flex justify-center items-center">
        <div className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70">
          <div className="flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
            <UsersRound />
          </div>
          <div className="font-semibold">Nhóm</div>
        </div>
      </div>

      {/* Video */}
      <div className="px-2 flex justify-center items-center">
        <div className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70">
          <div className="flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
            <MonitorPlay />
          </div>
          <div className="font-semibold">Video</div>
        </div>
      </div>
    </>
  );
};

export default UserActions;
