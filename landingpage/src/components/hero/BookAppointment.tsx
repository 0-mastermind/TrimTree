import React from "react";
import ArtistsHighlights from "./ArtistsHighlights";
import Link from "next/link";

const BookAppointment = () => {
  return (
    <div className="mt-20 max-w-200 flex flex-col items-center">
      <h1 className="text-5xl md:text-6xl capitalize text-center dark:text-[var(--text-white)] font-semibold">
        Feel beautiful look flawless stay confident
      </h1>
      <p className="text-center mt-6 text-md md:text-xl p-2 max-w-120 md:max-w-140 font-secondary text-[var(--text-gray-light)]">
        Experience expert styling, personalized care, and luxury treatments that
        bring out your natural beauty effortlessly
      </p>
      <Link
        target="_blank"
        href={
          "https://wa.me/+917536803403?text=Hello%20Trim%20Tree%20Salon,%20I%20would%20like%20to%20book%20an%20appointment."
        }
        className="mt-6 font-secondary px-8 py-3 bg-[var(--bg-primary)] text-white font-semibold rounded-xl cursor-pointer">
        Get in touch
      </Link>

      <div className="relative mt-12">
        <ArtistsHighlights />
        <div className="hero-gradient h-[400px] w-[400px] md:h-[600px] md:w-[800px] absolute top-22 left-1/2 -translate-x-1/2 -z-99"></div>
      </div>
    </div>
  );
};

export default BookAppointment;
