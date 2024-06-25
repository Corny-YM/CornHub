"use client";

import { io as ClientIO, Socket } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/app/socket";

interface Props {
  children: React.ReactNode;
}

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("Socket connected");
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      console.log("Socket disconnected");
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  //   const url = process.env.NEXT_PUBLIC_APP_URL!;
  //   console.log(url);

  //   const socketInstance = ClientIO(url, {
  //     path: "/api/socket/app-io",
  //     addTrailingSlash: false,
  //   });

  //   // const socketInstance = new (ClientIO as any)(
  //   //   process.env.NEXT_PUBLIC_APP_URL!,
  //   //   {
  //   //     path: "/api/socket/io",
  //   //     addTrailingSlash: false,
  //   //   }
  //   // );

  //   socketInstance.on("connect", () => {
  //     console.log("Socket connected");
  //     setIsConnected(true);
  //   });

  //   socketInstance.on("disconnect", () => {
  //     console.log("Socket disconnected");
  //     setIsConnected(false);
  //   });

  //   setSocket(socketInstance);

  //   return () => {
  //     socketInstance.disconnect();
  //   };
  // }, []);

  return (
    <SocketContext.Provider value={{ socket: socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
