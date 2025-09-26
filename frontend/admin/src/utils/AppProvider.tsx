"use client";
import { useAppDispatch, useAppSelector } from "@/store/store";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { getProfile } from "./api/auth";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  const initalize = useCallback(async () => {
    try {
      const res = await dispatch(getProfile());

      if (res) {
        setTimeout(() => {
        }, 2000);
      }
    } catch (error) {
      console.error("Error while initializing app");
    }
  }, [dispatch]);

  useLayoutEffect(() => {
    initalize();
  }, []);

  return <div>{children}</div>;
}
