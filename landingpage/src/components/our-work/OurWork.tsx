import React from "react";
import Problems from "./Problems";
import { cardDataProblem, cardDataSolution } from "./data";

const OurWork = () => {
  return (
    <div className="my-20">
      <Problems
        sectionHeading="Common problems you may experience"
        cardData={cardDataProblem}
        sectionSubHeading="problems"
      />
      <div className="bg-[var(--bg-primary)]/2 py-20">
        <Problems
          sectionHeading="This is how we bring your beauty back to life"
          cardData={cardDataSolution}
          sectionSubHeading="solution"
        />
      </div>
    </div>
  );
};

export default OurWork;
