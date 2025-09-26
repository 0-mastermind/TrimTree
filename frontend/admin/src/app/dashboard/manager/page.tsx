"use client";
import DetailsToday from "@/components/Manager/DetailsToday";
import { useAppSelector } from "@/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";

const page = () => {
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
    
  useLayoutEffect(() => {
    if (!auth.isLoggedIn) return;
    
    if (auth.isLoggedIn && auth.user?.role !== "MANAGER") {
      router.push("/dashboard/admin");    
    }
  });

  return (
    <div className="mt-6">
      <div className="flex gap-5 items-center">
        <Image src="/store.svg" alt="store image" height={100} width={100} />
        <div>
          <h3 className="font-bold flex text-2xl">Branch One</h3>
          <p className="text-gray-400">Main Branch</p>
        </div>
      </div>
      <DetailsToday />
    </div>
  );
};

export default page;
