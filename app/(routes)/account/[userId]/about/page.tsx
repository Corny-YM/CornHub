import { BriefcaseBusiness, Ellipsis, GraduationCap, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

const UserAboutPage = () => {
  return (
    <div className="mt-4 flex w-full pb-4 relative">
      <div className="w-full h-full flex flex-col p-4 rounded-lg dark:bg-neutral-800 bg-gray-100">
        <div className="font-semibold text-xl mb-4">Giới thiệu</div>

        <div className="w-full h-fit flex">
          <div className="w-1/4 flex flex-col">
            <Button
              className="w-full bg-primary/50 hover:bg-primary/50"
              variant="outline"
            >
              Tổng quan
            </Button>
          </div>

          <div className="flex-1 flex flex-col ml-4 px-4 border-l gap-y-2 border-solid border-gray-100/50">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center">
                <BriefcaseBusiness />
                <div className="ml-2">Làm việc tại AecomTech</div>
              </div>
              <Button
                className="rounded-full overflow-hidden hover:bg-primary/50"
                variant="outline"
                size="icon"
              >
                <Ellipsis size={20} />
              </Button>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center">
                <GraduationCap />
                <div className="ml-2">
                  Học Công Nghệ Thông Tin tại Đại Học Công Nghệ Đông Á
                </div>
              </div>
              <Button
                className="rounded-full overflow-hidden hover:bg-primary/50"
                variant="outline"
                size="icon"
              >
                <Ellipsis size={20} />
              </Button>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center">
                <Home />
                <div className="ml-2">Sống tại Hà Nội</div>
              </div>
              <Button
                className="rounded-full overflow-hidden hover:bg-primary/50"
                variant="outline"
                size="icon"
              >
                <Ellipsis size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAboutPage;
