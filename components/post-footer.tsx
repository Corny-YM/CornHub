import { Forward, MessageCircle, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Like from "@/components/icons/like";
import Heart from "@/components/icons/heart";
import Love from "@/components/icons/love";
// import Smile from "@/components/icons/smile";
// import Wow from "@/components/icons/wow";
// import Sad from "@/components/icons/sad";
// import Angry from "@/components/icons/angry";

const fakeEmotions = [Like, Heart, Love];
const length = fakeEmotions.length;

const PostFooter = () => {
  return (
    <div className="w-full flex flex-col justify-center text-sm px-4">
      <div className="w-full flex items-center py-3">
        {/* Emotions */}
        <div className="flex-1 flex items-center">
          <div className="flex items-center">
            {fakeEmotions.map((Item, index) => (
              <div
                key={index}
                className="emotions"
                style={{ zIndex: length - index }}
              >
                <Item />
              </div>
            ))}
          </div>
          <div className="pl-1 cursor-pointer hover:underline">111</div>
        </div>

        {/* Comments */}
        <div className="flex ml-3 items-center">
          <span className="cursor-pointer hover:underline">45 bình luận</span>
        </div>
      </div>

      <Separator className="dark:bg-neutral-200/50 bg-neutral-400" />

      <div className="w-full flex items-center pt-2 pb-3 gap-x-2">
        <Button
          className="hover:bg-primary/50 transition flex-1"
          variant="outline"
        >
          <ThumbsUp className="mr-1" size={20} />
          Thích
        </Button>
        <Button
          className="hover:bg-primary/50 transition flex-1"
          variant="outline"
        >
          <MessageCircle className="mr-1" size={20} />
          Bình luận
        </Button>
        <Button
          className="hover:bg-primary/50 transition flex-1"
          variant="outline"
        >
          <Forward className="mr-1" size={20} />
          Chia sẻ
        </Button>
      </div>
    </div>
  );
};

export default PostFooter;
