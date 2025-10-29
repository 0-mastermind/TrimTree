import { User } from "@/types/global";
import Image from "next/image";
import React from "react";

type NotAppliedCardProps = {
  user: User;
};

const NotAppliedCard: React.FC<NotAppliedCardProps> = ({ user }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 p-4 sm:p-6 shadow-sm hover:shadow-md">
      {/* Header Section - Only User Info */}
      <div className="flex items-center gap-3">
        <Image
          src={user.image?.url || "/user.png"}
          height={48}
          width={48}
          alt={user?.name || "User Avatar"}
          className="rounded-full border-2 border-gray-100 object-cover"
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-base">
            {user?.name || "Unknown User"}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-50 text-gray-700 border border-gray-100">
              Not Applied
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAppliedCard;