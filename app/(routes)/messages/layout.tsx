import { MessageProvider } from "@/providers/message-provider";
import Header from "@/components/header";
import SidebarLeft from "@/components/pages/messages/sidebar-left";

interface Props {
  children: React.ReactNode;
}

const MessagesLayout = async ({ children }: Props) => {
  return (
    <div className="relative w-full h-full max-h-full flex items-center">
      <Header />

      <MessageProvider>
        <div className="flex-1 w-full h-full max-h-full flex relative pt-14">
          <SidebarLeft />

          {/* Content */}
          {children}
        </div>
      </MessageProvider>
    </div>
  );
};

export default MessagesLayout;
