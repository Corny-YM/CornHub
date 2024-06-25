import { NextApiResponse } from "next";
import { Dispatch, SetStateAction } from "react";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import { Member, Profile, Server } from "@prisma/client";

// types.d.ts
import { Server as HttpServer } from "http";

import { Server as SocketIOServer } from "socket.io";

declare global {
  namespace NodeJS {
    interface Global {
      io: SocketIOServer;
    }
  }

  var io: SocketIOServer; // Ensures global variable is recognized
}

export {};

declare module "http" {
  interface IncomingMessage {
    socket: {
      server: HttpServer & { io?: SocketIOServer };
    };
  }
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket?: Socket & {
    server?: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export type ILucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref">>;

export type IDispatchState<T = any> = Dispatch<SetStateAction<T>>;
