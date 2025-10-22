import React from 'react'
import HappyCustomers from "./HappyCustomers"
import BookAppointment from "./BookAppointment"
import UserReviewHeroSection from "./UserReviewHeroSection"

const HeroSection = () => {
  return (
    <section className="mt-20">
      <div className="flex justify-center items-center flex-col">
        <HappyCustomers />
        <BookAppointment />
        <UserReviewHeroSection />
      </div>
    </section>
  )
}

export default HeroSection