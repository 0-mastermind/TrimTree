import type { JSX } from "react";

export interface AppRoute {
  path: string;
  element: JSX.Element;
  protected?: boolean;
  guest?: boolean;
}

export type UserRole = "ADMIN" | "MANAGER" | "STAFF";


export interface User {
  _id: string;
  name: string;
  username: string;
  image: {
    url: string;
    public_id: string;
  }
  email?: string;
  role: UserRole;
  branch: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  _id: string;         
  userId: User;       
  designation?: string;
  manager: string;
  salary: number;
  createdAt?: string;
  updatedAt?: string;
}
