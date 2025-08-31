import React from "react"
import Navbar from "../components/Navbar";

const AppProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="container mx-auto">
      <Navbar />
      {children}
      {/* Hello! Test 2 */}
    </div>
  )
}

export default AppProvider;