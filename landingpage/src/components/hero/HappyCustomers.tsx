import Image from "next/image";
import React from "react";

const HappyCustomers = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        <Image
          src="/images/avatar-one.svg"
          alt="user-avatar-1"
          width={40}
          height={40}
          className="-ml-3 border border-gray-600 rounded-full"
        />
        <Image
          src="/images/avatar-two.svg"
          alt="user-avatar-2"
          width={40}
          height={40}
          className="-ml-3 border border-gray-600 rounded-full"
        />
        <Image
          src="/images/avatar-three.svg"
          alt="user-avatar-3"
          width={40}
          height={40}
          className="-ml-3 border border-gray-600 rounded-full"
        />
      </div>
      <div className="flex items-center">
        <span className="text-xl font-secondary dark:text-[var(--text-white)]">32K+</span><span className="text-[var(--text-gray-light)] ml-2 font-secondary">Happy Customers</span>
      </div>
    </div>
  );
};

export default HappyCustomers;
