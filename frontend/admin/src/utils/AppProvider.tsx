"use client";
import { useAppDispatch, useAppSelector } from "@/store/store";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { getProfile } from "./api/auth";
import { usePathname, useRouter } from "next/navigation";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const initalize = useCallback(async () => {
    try {
      const res = await dispatch(getProfile());

      if (res) {
        setTimeout(() => {}, 2000);
      }
    } catch (error) {
      console.error("Error while initializing app");
    }
  }, [dispatch]);

  useLayoutEffect(() => {
    initalize();
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!auth.isLoggedIn && !auth.user) {
      // router.push("/login");
    }
  }, [auth.isLoggedIn, auth.user]);

  if (
    typeof window !== "undefined" &&
    isClient &&
    !auth.isLoggedIn &&
    pathname !== "/login"
  ) {
    return <div>Redirecting...</div>;
  }

  return <div>{children}</div>;
}
