import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { SocketProvider } from "@/providers/socket-provider";
import { MessageProvider } from "@/providers/message-provider";
import prisma from "@/lib/prisma";
import Header from "@/components/header";
import SidebarLeft from "@/components/pages/messages/sidebar-left";

interface Props {
  children: React.ReactNode;
}

const MessagesLayout = async ({ children }: Props) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const conversations = await prisma.conversation.findMany({
    include: { file: true, user: true, createdBy: true },
    where: {
      OR: [
        { created_by: userId },
        { user_id: userId },
        { conversationMembers: { some: { member_id: userId } } },
      ],
    },
  });

  return (
    <SocketProvider>
      <div className="relative w-full h-full max-h-full flex items-center">
        <Header />

        <MessageProvider>
          <div className="flex-1 w-full h-full max-h-full flex relative pt-14">
            <SidebarLeft conversations={conversations} />

            {/* Content */}
            {children}
          </div>
        </MessageProvider>
      </div>
    </SocketProvider>
  );
};

export default MessagesLayout;
