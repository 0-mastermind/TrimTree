export interface Demo {
  message: string;
}

export interface OurWorkCardProps {
  iconSrc: string;
  iconDarkBG: boolean; 
  cardHeading: string;
  cardDescription: string;
}

export interface OurWorkSectionProps {
    cardData: OurWorkCardProps[];
    sectionSubHeading: string;
    sectionHeading: string;
}

export interface Service {
  name: string;
  rate: number;
  description: string;
}

export interface Category {
  name: string;
  services: Service[];
}