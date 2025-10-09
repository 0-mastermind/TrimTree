"use client"

import { redirect } from "next/navigation";
import { useLayoutEffect } from "react"

const Dashboard = () => {
  useLayoutEffect(() => {
    redirect("/dashboard/profile");
  }, []);
  
  return (
    <div>page</div>
  )
}

export default Dashboard