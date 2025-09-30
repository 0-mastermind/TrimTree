import Image from "next/image";
import React from "react";

interface StaffCardProps {
  imageUrl: string;
  name: string;
  designation: string;
  branchName: string;
}

const StaffCard = ({ imageUrl, name, designation, branchName }: StaffCardProps) => {
  return (
    <div className="w-full rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex items-center gap-5">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Image
          src={imageUrl || "/user.png"}
          alt={`${name} Avatar`}
          height={90}
          width={90}
          className="rounded-xl object-cover border aspect-square"
          priority
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        {/* Staff Info */}
        <h1 className="text-lg font-semibold text-gray-800">{name}</h1>
        <p className="text-sm text-gray-600 capitalize">{designation}</p>

        {/* Divider */}
        <div className="my-2 h-[1px] w-12 bg-gray-200"></div>

        {/* Branch Info */}
        <p className="text-sm font-medium text-gray-700 capitalize">
          {branchName}
        </p>
      </div>
    </div>
  );
};

export default StaffCard;
