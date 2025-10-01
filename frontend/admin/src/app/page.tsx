"use client"
import Loader from "@/components/common/Loader";
import { RootState, useAppDispatch } from "@/store/store";
import { getProfile } from "@/utils/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    } else if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div>
    </div>
  );
}
