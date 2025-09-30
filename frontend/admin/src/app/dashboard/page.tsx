"use client"

import { redirect } from "next/navigation";
import { useLayoutEffect } from "react"

const page = () => {
  useLayoutEffect(() => {
    redirect("/dashboard/profile");
  }, [])
  
  return (
    <div>page</div>
  )
}

export default page