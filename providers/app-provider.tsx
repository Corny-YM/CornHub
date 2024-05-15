"use client";

import toast, { Toaster } from "react-hot-toast";
import { Info } from "lucide-react";
import { User } from "@prisma/client";
import { useSession, useUser } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { store } from "@/actions/user";

interface Props {
  children: React.ReactNode;
}

type Context = {
  currentUser?: User | null;
  toastFeatureUpdating: () => void;
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const AppContext = createContext<Context>({
  currentUser: null,
  toastFeatureUpdating: () => {},
});

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

  const toastFeatureUpdating = useCallback(() => {
    toast(<div className="text-sm font-semibold">Coming soon!</div>, {
      icon: <Info className="text-blue-400" />,
      position: "bottom-right",
    });
  }, []);

  return (
    <AppContext.Provider value={{ currentUser, toastFeatureUpdating }}>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {children}
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
