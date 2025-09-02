import React from "react";
import Star from "../Star";
import Image from "next/image";

const UserReviewHeroSection = () => {
  return (
    <div className="mt-36 mb-20">
      <div className="flex gap-1 justify-center items-center">
        <Star />
        <Star />
        <Star />
        <Star />
        <Star />
      </div>

      <div className="max-w-[450px] md:max-w-[600px] mx-auto mt-10 ">
        <h2 className="text-center text-2xl md:text-3xl leading-10 md:leading-12 dark:text-[var(--text-white)]">
          The stylists at TrimTree guided me through every step of my hair
          transformation with amazing expert care
        </h2>
      </div>
      
      {/* User review */}
      <div className="flex justify-center gap-4 max-w-[200px] mx-auto mt-8">
        <div>
          <Image src={"/images/hero/avatar-one.svg"} height={50} width={50} alt="user-review avatar" />
        </div>
        <div className="flex-1 flex justify-center flex-col">
          <h3 className="font-semibold text-xl dark:text-[var(--text-primary)]">Amit Singh</h3>
          <p className="text-[var(--text-gray-light)] text-sm">Balayage & Styling</p>
        </div>
      </div>
    </div>
  );
};

export default UserReviewHeroSection;
