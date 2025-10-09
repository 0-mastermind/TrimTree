"use client";
import React from "react";
import { useAppSelector } from "@/store/store";
import { User, Mail, MapPin, Calendar, Building2, Shield } from "lucide-react";
import Image from "next/image";

interface UserImage {
  url: string;
  publicId: string;
}

interface Branch {
  _id: string;
  name: string;
  address: string;
  image?: UserImage;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  image?: UserImage;
  branch?: Branch;
  createdAt: string;
  updatedAt: string;
}

const ProfilePage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user) as UserData | null;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-base-content/70">No user data available</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "badge-error";
      case "MANAGER":
        return "badge-warning";
      default:
        return "badge-info";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-base-content">My Profile</h1>
          {/* <button className="btn btn-primary btn-sm gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </button> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                {/* Profile Image */}
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden relative">
                    {user.image?.url ? (
                      <Image
                        src={user.image.url}
                        alt={user.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="flex items-center justify-center bg-primary/20 w-full h-full">
                        <User className="h-16 w-16 text-primary" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Name and Username */}
                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-base-content">
                    {user.name}
                  </h2>
                  <p className="text-base-content/70 mt-1">@{user.username}</p>
                </div>

                {/* Role Badge */}
                <div className="mt-3">
                  <span
                    className={`badge ${getRoleBadgeColor(user.role)} gap-2`}>
                    <Shield className="h-3 w-3" />
                    {user.role}
                  </span>
                </div>

                {/* Member Since */}
                <div className="mt-6 w-full">
                  <div className="divider">Member Since</div>
                  <p className="text-sm text-base-content/70">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">Contact Information</h3>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-base-content/70 font-medium">
                        Email Address
                      </p>
                      <p className="text-base-content mt-1">{user.email}</p>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-base-content/70 font-medium">
                        Username
                      </p>
                      <p className="text-base-content mt-1">{user.username}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch Information */}
            {user.branch && (
              <div className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-4">
                    Branch Information
                  </h3>

                  <div className="space-y-4">
                    {/* Branch Image */}
                    {user.branch.image?.url && (
                      <div className="w-full h-48 rounded-lg overflow-hidden">
                        <Image
                          src={user.branch.image.url}
                          alt={user.branch.name}
                          layout="fill"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Branch Name */}
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-base-content/70 font-medium">
                          Branch Name
                        </p>
                        <p className="text-base-content mt-1">
                          {user.branch.name}
                        </p>
                      </div>
                    </div>

                    {/* Branch Address */}
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-base-content/70 font-medium">
                          Address
                        </p>
                        <p className="text-base-content mt-1">
                          {user.branch.address}
                        </p>
                      </div>
                    </div>

                    {/* Branch Created */}
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-base-content/70 font-medium">
                          Branch Established
                        </p>
                        <p className="text-base-content mt-1">
                          {formatDate(user.branch.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">Account Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-base-200 rounded-lg">
                    <p className="text-sm text-base-content/70 font-medium mb-1">
                      Account Created
                    </p>
                    <p className="text-base-content">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>

                  <div className="p-4 bg-base-200 rounded-lg">
                    <p className="text-sm text-base-content/70 font-medium mb-1">
                      Last Updated
                    </p>
                    <p className="text-base-content">
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>

                  <div className="p-4 bg-base-200 rounded-lg">
                    <p className="text-sm text-base-content/70 font-medium mb-1">
                      User ID
                    </p>
                    <p className="text-base-content text-xs font-mono">
                      {user._id}
                    </p>
                  </div>

                  <div className="p-4 bg-base-200 rounded-lg">
                    <p className="text-sm text-base-content/70 font-medium mb-1">
                      Role
                    </p>
                    <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
