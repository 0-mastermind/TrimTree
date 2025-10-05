"use client"
import { RootState } from "@/store/store";
import { redirect } from "next/navigation";
import { useLayoutEffect } from "react"
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const {user, isLoggedIn} = useSelector((state: RootState) => state.auth);
  
  useLayoutEffect(() => {
    if (!isLoggedIn) return;
    
    if (user && user.role === "ADMIN") {
      redirect("/dashboard/admin/branches");
    } else {
      redirect("/dashboard/manager");
    }
  }, [user, isLoggedIn]);
  
  return (
    <div className="">
      <div className="h-[1200px]">
      </div>
    </div>
  )
}

export default AdminDashboard