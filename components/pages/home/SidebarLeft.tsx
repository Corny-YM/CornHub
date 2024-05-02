import ListFriends from "./ListFriends";

const SidebarLeft = () => {
  return (
    <div className="sticky h-full basis-80 flex flex-col overflow-hidden overflow-y-auto">
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

export default SidebarLeft;
