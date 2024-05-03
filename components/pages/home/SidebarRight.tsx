import ListFriends from "./ListFriends";

const SidebarRight = () => {
  return (
    <div className="side-bar">
      <div className="flex flex-col w-full">
        <div className="mx-4 font-semibold mb-2 text-slate-400">
          Người liên hệ
        </div>

        {/* List fiends */}
        <ListFriends />
      </div>
    </div>
  );
};

export default SidebarRight;
