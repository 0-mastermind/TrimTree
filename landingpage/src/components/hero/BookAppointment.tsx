import React from "react";
import ArtistsHighlights from "./ArtistsHighlights";

const BookAppointment = () => {
  return (
    <div className="mt-20 max-w-200 flex flex-col items-center">
      <h1 className="text-6xl capitalize text-center dark:text-[var(--text-white)]">
        Let your hair shine with strength & beauty
      </h1>
      <p className="text-center mt-6 text-xl max-w-140 font-secondary text-[var(--text-gray-light)]">
        A haircut is just the beginning. Experience hair artistry that enhances
        your beauty and boosts
      </p>
      <button className="mt-6 font-secondary px-8 py-3 bg-[var(--bg-primary)] text-white font-semibold rounded-xl cursor-pointer">
        Get in touch
      </button>

      <div className="relative mt-6">
        <ArtistsHighlights />
        <div className="hero-gradient h-[600px] w-[800px] absolute top-22 left-1/2 -translate-x-1/2 -z-99"></div>
      </div>
    </div>
  );
};

export default BookAppointment;
