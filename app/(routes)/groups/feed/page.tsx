import GroupFeed from "@/components/pages/groups/group-feed";

interface Props {}

const GroupFeedPage = ({}: Props) => {
  return (
    <div className="flex-1 h-full px-8 pt-4">
      <GroupFeed />
    </div>
  );
};

export default GroupFeedPage;
