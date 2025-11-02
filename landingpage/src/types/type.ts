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
    sectionSubHeading?: string;
    sectionHeading: string;
}

export interface Service {
  _id: string;
  name: string;
  rate: number;
  description: string;
}

export interface Category {
  _id: string;
  name: string;
  services: Service[];
}

export interface Reviews {
  _id: string;
  customerName: string;
  service : string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  _id: string;
  designation: string;
  userId: {
    _id: string;
    name: string;
    designation: string;
    image: {
      publicId: string;
      url: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }
}