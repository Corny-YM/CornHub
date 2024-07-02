"use client";

import { MediaRoom } from "@/components/media-room";
import ChatContent from "@/components/pages/messages/[conversationId]/chat-content";
import { useConversationContext } from "@/providers/conversation-provider";

interface Props {}

const ConversationIdPage = ({}: Props) => {
  const { call, callVideo, conversationData, toggleCall, toggleCallVideo } =
    useConversationContext();

  if (call)
    return (
      <MediaRoom
        audio
        video={false}
        chatId={conversationData.id}
        onDisconnected={() => toggleCall(false)}
      />
    );

  if (callVideo)
    return (
      <MediaRoom
        audio
        video
        chatId={conversationData.id}
        onDisconnected={() => toggleCallVideo(false)}
      />
    );

  return <ChatContent />;
};

export default ConversationIdPage;
