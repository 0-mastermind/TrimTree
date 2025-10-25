import React from "react";
import OurWorkCard from "./OurWorkCard";
import { OurWorkCardProps, OurWorkSectionProps } from "@/types/type";

const Problems = ({
  cardData,
  sectionHeading,
}: OurWorkSectionProps) => {
  return (
    <div>
      <h1 className="my-4 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)] font-semibold">
        {sectionHeading}
      </h1>

      <div className="my-14 flex flex-wrap justify-center items-center gap-8 mx-auto mt-20">
        {cardData.map((item: OurWorkCardProps, index) => (
          <OurWorkCard
            key={index}
            cardDescription={item.cardDescription}
            cardHeading={item.cardHeading}
            iconSrc={item.iconSrc}
            iconDarkBG={item.iconDarkBG}
          />
        ))}
      </div>
    </div>
  );
};

export default Problems;
