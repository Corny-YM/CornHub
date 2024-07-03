import prisma from "@/lib/prisma";
import Video from "@/components/video";
import EmptyData from "@/components/empty-data";

interface Props {
  params: { userId: string };
}

const UserVideosPage = async ({ params }: Props) => {
  const videos = await prisma.file.findMany({
    where: { user_id: params.userId, type: "video" },
  });

  return (
    <div className="mt-4 flex w-full pb-4 relative">
      <div className="w-full h-full flex flex-col p-4 rounded-lg dark:bg-neutral-800 bg-gray-100">
        {(!videos || !videos.length) && <EmptyData />}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {videos.map((fileVid) => (
            <div
              key={fileVid.id}
              className=" relative w-full h-auto aspect-square rounded-lg overflow-hidden bg-primary-foreground"
            >
              <Video
                className="absolute w-full h-full object-contain"
                src={fileVid.path}
                type={`${fileVid.type}/${fileVid.ext}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserVideosPage;
