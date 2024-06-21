import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  try {
    console.log("hello123123");
    if (!res?.socket?.server?.io) {
      const path = "/api/socket/io";
      const httpServer: NetServer = res.socket.server as any;
      const io = new ServerIO(httpServer, {
        path: path,
        addTrailingSlash: false,
      });
      if (res.socket.server) res.socket.server.io = io;
    }

    res.end();
  } catch (err) {
    console.log("[SOCKET.IO handler]", err);
  }
}
