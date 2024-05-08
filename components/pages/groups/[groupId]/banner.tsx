import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

const Banner = () => {
  return (
    <div className="relative w-full flex items-center justify-center shadow-2xl rounded-b-lg overflow-hidden dark:border dark:border-solid dark:border-neutral-600/50">
      <div className="relative w-full h-96 aspect-video flex items-center justify-center">
        <Image
          className="absolute w-full h-full object-cover"
          src="https://res.cloudinary.com/doyuaf8uu/image/upload/v1714837605/17d7c12ac7661acb487019f62c09835d_ifcezd.png"
          alt="banner"
          fill
        />
      </div>
      <div className="absolute right-4 bottom-4">
        <Button variant="outline">
          <Camera size={20} className="mr-2" /> Chỉnh sửa ảnh bìa
        </Button>
      </div>
    </div>
  );
};

export default Banner;
