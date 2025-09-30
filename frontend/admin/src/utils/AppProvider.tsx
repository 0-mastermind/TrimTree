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
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const initalize = useCallback(async () => {
    try {
      const res = await dispatch(getProfile());

      if (res) {
        setTimeout(() => {
          setIsInitialized(true);
        }, 500);
      } else {
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Error while initializing app");
      setIsInitialized(true);
    }
  }, [dispatch]);

  useLayoutEffect(() => {
    initalize();
    setIsClient(true);
  }, []);

  // Check if user has access to the current route based on role
  const checkRouteAccess = useCallback(() => {
    if (!auth.isLoggedIn || !auth.user) {
      // Not logged in, redirect to login (except if already on login page)
      if (pathname !== "/login") {
        router.push("/login");
        return false;
      }
      return true;
    }

    const userRole = auth.user.role;

    // Role-based route protection
    if (pathname.startsWith("/dashboard/admin")) {
      if (userRole !== "ADMIN") {
        // Non-admin trying to access admin routes
        if (userRole === "MANAGER") {
          router.push("/dashboard/manager");
        } else {
          router.push("/dashboard");
        }
        return false;
      }
    }

    if (pathname.startsWith("/dashboard/manager")) {
      if (userRole !== "MANAGER") {
        // Non-manager trying to access manager routes
        if (userRole === "ADMIN") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
        return false;
      }
    }

    // If logged in and on login page, redirect to appropriate dashboard
    if (pathname === "/login") {
      if (userRole === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (userRole === "MANAGER") {
        router.push("/dashboard/manager");
      } else {
        router.push("/dashboard");
      }
      return false;
    }

    return true;
  }, [auth.isLoggedIn, auth.user, pathname, router]);

  useEffect(() => {
    if (isInitialized && isClient) {
      checkRouteAccess();
    }
  }, [isInitialized, isClient, checkRouteAccess]);

  // Show loading state while initializing
  if (!isInitialized || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Show redirecting message when checking access
  if (
    typeof window !== "undefined" &&
    isClient &&
    !auth.isLoggedIn &&
    pathname !== "/login"
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
}