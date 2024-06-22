import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { ConversationProvider } from "@/providers/conversation-provider";
import { Separator } from "@/components/ui/separator";
import ChatHeader from "@/components/pages/messages/[conversationId]/chat-header";
import ChatInput from "@/components/pages/messages/[conversationId]/chat-input";

interface Props {
  children: React.ReactNode;
  params: { conversationId: string };
}

const ConversationIdLayout = async ({ children, params }: Props) => {
  const conversation = await prisma.conversation.findFirst({
    include: { file: true, user: true, createdBy: true },
    where: {
      id: params.conversationId,
    },
  });

  if (!conversation) redirect("/messages");

  return (
    <div className="flex-grow h-full max-h-full flex flex-col px-2 pt-4 pb-4">
      <ConversationProvider data={conversation}>
        {/* Header */}
        <ChatHeader />

        <Separator className="my-2" />

        {/* Content */}
        {children}

        {/* Input */}
        <ChatInput />
      </ConversationProvider>
    </div>
  );
};

export default ConversationIdLayout;
