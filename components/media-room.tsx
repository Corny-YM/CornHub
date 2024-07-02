"use client";

import "@livekit/components-styles";

import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

import { getToken } from "@/actions/livekit";

interface Props {
  chatId: string;
  video: boolean;
  audio: boolean;
  onDisconnected?: () => void;
}

const serverUrl = process.env.NEXT_PUBLIC_LK_SERVER_URL;

export const MediaRoom = ({ chatId, video, audio, onDisconnected }: Props) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  const { data, isLoading } = useQuery({
    enabled: !!user && !!chatId,
    queryKey: ["livekit", "room", chatId, user?.fullName],
    queryFn: () =>
      user &&
      getToken({
        room: chatId,
        username: user?.fullName || user?.id,
      }),
  });

  useEffect(() => {
    if (!data || token) return;
    setToken(data.token);
  }, [data, token]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-hidden overflow-y-auto">
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={serverUrl}
        token={token}
        connect={true}
        video={video}
        audio={audio}
        onDisconnected={onDisconnected}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
};
