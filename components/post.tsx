"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Group, Post, User, File as IFile, Reaction } from "@prisma/client";

import { cn } from "@/lib/utils";
import { useToggle } from "@/hooks/useToggle";
import { Button } from "@/components/ui/button";
import Video from "@/components/video";
import PostFooter from "@/components/post-footer";
import PostHeader from "@/components/post-header";
import CommentsModal from "./comments-modal";
import ReactionsModal from "./reactions-modal";

interface Props {
  className?: string;
  isModal?: boolean;
  isApproving?: boolean;
  isGroupOwner?: boolean;
  isGroupOwnerPost?: boolean;
  data: Post & {
    user: User;
    group: Group | null;
    file: IFile | null;
    reactions: Reaction[];
    _count: { comments: number; reactions: number };
  };
  onSuccessDelete?: () => void;
}

const limitContent = 1000;

const PostItem = ({
  data,
  className,
  isModal,
  isApproving,
  isGroupOwner,
  isGroupOwnerPost,
  onSuccessDelete,
}: Props) => {
  const [dataPost, setDataPost] = useState(data);
  const [showFullContent, toggleShowFullContent] = useToggle(
    !((dataPost.content || "").length > limitContent)
  );
  const [modalComments, toggleModalComments] = useToggle(false);
  const [modalReactions, toggleModalReactions] = useToggle(false);

  useEffect(() => {
    setDataPost(data);
  }, [data]);

  const file = useMemo(() => dataPost.file, [dataPost]);
  const type = useMemo(() => file?.type, [file]);
  const path = useMemo(() => {
    return file?.path;
  }, [file]);

  const content = useMemo(
    () =>
      showFullContent
        ? dataPost.content
        : dataPost.content?.slice(0, limitContent) + " ...",
    [(dataPost.content, showFullContent)]
  );

  return (
    <div className={cn("post-item", isModal && "popup", className)}>
      {/* Header */}
      <PostHeader
        data={dataPost}
        isModal={isModal}
        isApproving={isApproving}
        isGroupOwner={isGroupOwner}
        isGroupOwnerPost={isGroupOwnerPost}
        onSuccessDelete={onSuccessDelete}
        onSuccessUpdate={(newPostData) => {
          setDataPost((prev) => {
            return { ...prev, ...newPostData };
          });
        }}
      />

      {/* Content */}
      <div className="flex flex-col w-full text-sm">
        {/* content */}
        <div className="px-4 pb-4 pt-1">
          <span
            className={cn("post-content", isModal && "px-0")}
            dangerouslySetInnerHTML={{ __html: content || "" }}
          />
          <Button
            className="w-fit h-fit px-2 mt-1 hover:bg-primary/50"
            size="sm"
            variant="outline"
            onClick={() => toggleShowFullContent()}
          >
            {showFullContent ? "Ẩn bớt" : "Đọc thêm"}
          </Button>
        </div>

        {file && path && (
          <div className="flex w-full px-12 bg-primary-foreground/40 mb-2">
            {type === "image" && (
              <div className="relative w-full aspect-square flex justify-center items-center">
                <Image
                  className="absolute w-full h-full object-cover"
                  src={path}
                  alt={dataPost.file?.name || `post-img-${dataPost.id}`}
                  fill
                  priority
                  sizes="100%"
                />
              </div>
            )}
            {type === "video" && (
              <div className="relative w-full aspect-video flex justify-center items-center">
                <Video
                  className="absolute object-cover"
                  src={path}
                  type={`${file.type}/${file.ext}`}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <PostFooter
        data={dataPost}
        isModal={isModal}
        onClickReaction={() => toggleModalReactions(true)}
        onClickComment={() => !isModal && toggleModalComments(true)}
      />

      {/* Modals */}
      <ReactionsModal
        data={dataPost}
        open={modalReactions}
        onOpenChange={toggleModalReactions}
      />
      {!isModal && (
        <CommentsModal
          data={dataPost}
          open={modalComments}
          onOpenChange={toggleModalComments}
        />
      )}
    </div>
  );
};

export default PostItem;
