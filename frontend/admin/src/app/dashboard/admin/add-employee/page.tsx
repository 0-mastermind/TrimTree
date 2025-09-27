"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import ImageCropper from "@/components/ImageCropper";
import { Store } from "lucide-react";
import { redirect } from "next/navigation";

interface FormDataState {
  name: string;
  username: string;
  email: string;
  password: string;
  salary: number;
  branch: string;
  role: "MANAGER" | "STAFF" | "";
  manager: string;
  image: File | null; 
}

const page = () => {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    username: "",
    email: "",
    password: "",
    salary: 0,
    branch: "",
    role: "",
    manager: "",
    image: null
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleCroppedImage = (file: File, url: string) => {
    setFormData(prev => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-semibold">Add Employee</h1>
        <button
          className="text-xs cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center"
          onClick={() => redirect("/dashboard/admin/branches")}>
          <Store className="h-4 w-4 md:h-5 md:w-5" /> View branches
        </button>
      </div>
      
      <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
        <div className="order-1 md:order-2">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">User Profile Picture</legend>
            <ImageCropper 
              aspect={1 / 1} 
              onImageCropped={handleCroppedImage}
            />
          </fieldset>
        </div>

        <div className="flex flex-col gap-2 order-2 md:order-1">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Name</legend>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input focus:outline-none w-full"
              placeholder="Abhishek Sharma"
            />
          </fieldset>

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Username</legend>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="input focus:outline-none w-full"
              placeholder="abhishek"
            />
          </fieldset>

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input focus:outline-none w-full"
              placeholder="abhishek@mail.com"
            />
          </fieldset>

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input focus:outline-none w-full"
              placeholder="password@123"
            />
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Salary</legend>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="input focus:outline-none w-full"
                placeholder="50000"
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Branch</legend>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="input w-full focus:outline-none"
                placeholder="Select a branch"
                list="branches"
              />
              <datalist id="branches">
                <option value="Main Branch"></option>
                <option value="North Branch"></option>
                <option value="South Branch"></option>
                <option value="East Branch"></option>
                <option value="West Branch"></option>
              </datalist>
            </fieldset>

            <fieldset className="fieldset w-full focus:outline-none">
              <legend className="fieldset-legend">Role</legend>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input focus:outline-none w-full"
                placeholder="Select a role"
                list="designation"
              />
              <datalist id="designation">
                <option value="MANAGER"></option>
                <option value="STAFF"></option>
              </datalist>
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Manager</legend>
              <input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={handleInputChange}
                className="input w-full focus:outline-none"
                placeholder="Select a manager"
                list="managers"
              />
              <datalist id="managers">
                <option value="John Doe"></option>
                <option value="Jane Smith"></option>
                <option value="Mike Johnson"></option>
                <option value="Sarah Wilson"></option>
                <option value="David Brown"></option>
              </datalist>
            </fieldset>
          </div>

          <div className="mt-2 mb-6">
            <button
              type="submit"
              className="text-xs font-semibold cursor-pointer transition-all bg-green-600 text-white py-3 md:px-8 md:py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center justify-center w-full md:w-auto">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default page;