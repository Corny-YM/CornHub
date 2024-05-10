"use client";

import { User } from "@prisma/client";
import { useSession, useUser } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContext, createContext, useEffect, useState } from "react";

import { store } from "@/actions/user";

interface Props {
  children: React.ReactNode;
}

type Context = {
  currentUser?: User | null;
};

const queryClient = new QueryClient();

const AppContext = createContext<Context>({});

export const AppProvider = ({ children }: Props) => {
  const { user } = useUser();
  const { isSignedIn, session } = useSession();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!session || !isSignedIn || !user) return;
    // Upsert user
    const {
      id,
      imageUrl,
      fullName,
      lastName,
      firstName,
      lastSignInAt,
      emailAddresses,
    } = user;
    const email = emailAddresses?.[0]?.emailAddress;
    const fetch = async () => {
      const res = await store({
        id,
        email,
        avatar: imageUrl,
        full_name: fullName,
        last_name: lastName,
        first_name: firstName,
        last_sign_in: lastSignInAt,
      });
      setCurrentUser(res);
    };
    fetch();
  }, [session, isSignedIn, user]);

  return (
    <AppContext.Provider value={{ currentUser }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
