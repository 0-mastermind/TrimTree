import React from 'react'
import HappyCustomers from "./HappyCustomers"
import BookAppointment from "./BookAppointment"

const HeroSection = () => {
  return (
    <section className="mt-20">
      <div className="flex justify-center items-center flex-col">
        <HappyCustomers />
        <BookAppointment />
      </div>
    </section>
  )
}

export default HeroSection