import React from "react"
import Navbar from "../components/Navbar";

const AppProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="container mx-auto">
      <Navbar />
      {children}
      {/* Hello! Testing branch protection */}
    </div>
  )
}

export default AppProvider;