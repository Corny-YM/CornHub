import PostItem from "@/components/post";
import Posting from "@/components/posting";
import InfoDetail from "@/components/pages/account/info-detail";

const UserPage = () => {
  return (
    <div className="mt-4 flex w-full pb-4 relative">
      {/* Info Detail */}
      <div className="w-1/3 flex-shrink relative">
        <div className="w-full h-0"></div>
        <InfoDetail />
      </div>

      {/* Posts */}
      <div className="flex-1 flex flex-col ml-4">
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

export default UserPage;
