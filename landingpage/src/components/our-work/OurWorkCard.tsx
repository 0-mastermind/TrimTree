import { OurWorkCardProps } from "@/types/type";
import Image from "next/image";
import React from "react";

const OurWorkCard = ({
  iconSrc,
  cardHeading,
  cardDescription,
  iconDarkBG,
}: OurWorkCardProps) => {
  return (
    <div className="max-w-[300px] ">
      <div className="flex justify-center pb-10">
        <div
          className={`
          h-18 w-18 rounded-full flex items-center justify-center ${
            iconDarkBG
              ? "bg-[var(--bg-primary)]/90"
              : "bg-[var(--bg-primary)]/5 dark:bg-[var(--bg-primary)]/15"
          }
          `}>
          {iconDarkBG ? (
            <Image src={`${iconSrc.slice(0, -4)}-dark.svg`} alt="icon" width={35} height={35} />
          ) : (
            <Image src={iconSrc} alt="icon" width={35} height={35} />
          )}
        </div>
      </div>
      <h2 className="text-center text-3xl dark:text-[var(--text-primary)]">
        {cardHeading}
      </h2>
      <p className="text-center mt-3 font-secondary px-2 text-[var(--text-gray-light)] leading-6">
        {cardDescription}
      </p>
    </div>
  );
};

export default OurWorkCard;
