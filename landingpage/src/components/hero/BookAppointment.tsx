import React from "react";

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

      <div className="relative">
        <div className="hero-gradient h-[400px] w-[800px] absolute top-40 left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default BookAppointment;
