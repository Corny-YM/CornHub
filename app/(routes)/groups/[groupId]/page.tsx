import PostItem from "@/components/post";
import Posting from "@/components/posting";
import CardInfo from "@/components/pages/groups/[groupId]/card-info";

interface Props {
  params: { groupId: string };
}

const GroupIdPage = ({ params }: Props) => {
  const { groupId } = params;
  return (
    <div className="mt-4 flex w-full pb-4 relative">
      <div className="w-full xl:w-2/3 flex flex-col">
        <Posting />

        {/* List Posts */}
        <div className="w-full flex flex-col mt-4">
          {/* <PostItem />
          <PostItem />
          <PostItem />
          <PostItem />
          <PostItem /> */}
        </div>
      </div>

      <div className="hidden xl:flex w-1/3 flex-col ml-4">
        <CardInfo />
      </div>
    </div>
  );
};

export default GroupIdPage;
