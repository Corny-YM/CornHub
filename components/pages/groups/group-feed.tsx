import PostItem from "@/components/post";

const GroupFeed = () => {
  return (
    <div className="w-full max-w-full flex flex-col justify-center items-center flex-1 h-fit pb-4">
      <div className="w-full max-w-[680px] flex flex-col h-fit">
        <div>Hoạt động gần đây</div>

        {/* List Posts */}
        <div className="w-full flex flex-col mt-4">
          <PostItem />
          <PostItem />
          <PostItem />
          <PostItem />
          <PostItem />
        </div>
      </div>
    </div>
  );
};

export default GroupFeed;
