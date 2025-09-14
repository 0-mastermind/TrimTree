"use client"
import { redirect } from "next/navigation";
import { useLayoutEffect } from "react"

const page = () => {
  useLayoutEffect(() => {
    redirect("/dashboard/admin/branches");
  }, []);
  
  return (
    <div className="">
      <div className="h-[1200px]">
      </div>
    </div>
  )
}

export default page