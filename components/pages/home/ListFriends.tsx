import Image from "next/image";

const itemsArray: any[] = [];
for (let i = 1; i <= 10; i++) {
  itemsArray.push(i);
}

const ListFriends = () => {
  return (
    <div className="w-full flex flex-col">
      {itemsArray.map((item) => (
        <div
          key={item}
          className="px-2 flex justify-center items-center min-h-11"
        >
          <div className="w-full flex items-center px-2 rounded-md transition select-none cursor-pointer dark:hover:bg-primary/20 hover:bg-primary/70">
            <div className="relative flex justify-center items-center w-9 h-9 my-2 mr-3 overflow-hidden rounded-full">
              <Image
                className="absolute w-full h-full aspect-square"
                priority
                src={"https://i.pravatar.cc/150?img=3"}
                alt={"Group"}
                fill
              />
            </div>
            <div className="font-semibold line-clamp-2 py-3 text-sm">
              Nguyễn Thế Anh
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListFriends;
