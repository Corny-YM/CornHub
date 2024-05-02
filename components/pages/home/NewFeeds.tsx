import Posting from "./Posting";

const NewFeeds = () => {
  return (
    <div className="w-full max-w-full flex flex-col justify-center items-center flex-1 h-full pt-4">
      <div className="w-full max-w-[680px] flex flex-col h-full overflow-hidden overflow-y-auto">
        {/* Posting */}
        <Posting />
      </div>
    </div>
  );
};

export default NewFeeds;
