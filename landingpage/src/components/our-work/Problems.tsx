import React from "react";
import OurWorkCard from "./OurWorkCard";
import { OurWorkCardProps, OurWorkSectionProps } from "@/types/type";

const Problems = ({
  cardData,
  sectionSubHeading,
  sectionHeading,
}: OurWorkSectionProps) => {
  return (
    <div>
      <h6 className="text-center text-lg text-[var(--text-primary)] font-secondary capitalize">
        - {sectionSubHeading}
      </h6>
      <h1 className="my-10 text-4xl md:text-5xl max-w-[700px] text-center mx-auto text-[var(--text-primary)]">
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
