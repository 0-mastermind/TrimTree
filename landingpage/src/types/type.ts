export interface Demo {
  message: string;
}

export interface OurWorkCardProps {
  iconSrc: string;
  iconDarkBG: Boolean; 
  cardHeading: string;
  cardDescription: string;
}

export interface OurWorkSectionProps {
    cardData: OurWorkCardProps[];
    sectionSubHeading: string;
    sectionHeading: string;
}