import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { ConversationProvider } from "@/providers/conversation-provider";
import { Separator } from "@/components/ui/separator";
import ChatHeader from "@/components/pages/messages/[conversationId]/chat-header";
import ChatInput from "@/components/pages/messages/[conversationId]/chat-input";
import { auth } from "@clerk/nextjs/server";
import { TypeConversationEnum } from "@/lib/enum";

interface Props {
  children: React.ReactNode;
  params: { conversationId: string };
}

const ConversationIdLayout = async ({ children, params }: Props) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  // Params Id can be a "conversationId" or a "userId"
  let conversation = await prisma.conversation.findFirst({
    include: { file: true, user: true, createdBy: true },
    where: {
      OR: [
        { id: params.conversationId },
        { user_id: params.conversationId, created_by: userId },
        { created_by: params.conversationId, user_id: userId },
      ],
    },
  });

  const existedUser = await prisma.user.findFirst({
    where: { id: params.conversationId },
  });

  if (existedUser && !conversation) {
    conversation = await prisma.conversation.create({
      include: { file: true, user: true, createdBy: true },
      data: {
        created_by: userId,
        user_id: params.conversationId,
        active: 0,
        type: TypeConversationEnum.private,
      },
    });
  }

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
