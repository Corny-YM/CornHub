import PostItem from "@/components/post";
import Posting from "./Posting";

const NewFeeds = () => {
  return (
    <div className="w-full max-w-full flex flex-col justify-center items-center flex-1 h-fit pb-4">
      <div className="w-full max-w-[680px] flex flex-col h-fit">
        {/* Posting */}
        <Posting />

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

export default NewFeeds;
