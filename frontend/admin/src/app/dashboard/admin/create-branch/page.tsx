"use client";
import WarningMessage from "@/components/common/WarningMessage";
import ImageCropper from "@/components/ImageCropper";
import { useAppDispatch } from "@/store/store";
import { createBranch } from "@/utils/api/branches";
import { Store } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface FormDataState {
  name?: string;
  address?: string;
  imageFile?: File | null;
  imageUrl?: string;
}

const page = () => {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    address: "",
    imageFile: null,
    imageUrl: "",
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isDataValid = Object.values(formData).every(
      (val) => val !== null && val !== ""
    );

    if (!isDataValid) {
      toast.error("All fields are required!");
    }

    const data = new FormData();

    data.append("name", formData.name!);
    data.append("address", formData.address!);
    data.append("branchImage", formData.imageFile!);

    const uploadForm = async () => {
      try {
        const res = await dispatch(createBranch(data));

        if (res) {
          console.log("success");
          router.push("/dashboard/admin/branches");
        }
      } catch (error) {
        console.error("Error! While uploading create branch file", error);
      }
    };

    uploadForm();
  };

  const handleCroppedImage = (file: File, url: string) => {
    setFormData({
      ...formData,
      imageFile: file,
      imageUrl: url,
    });
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-semibold">Add a new branch</h1>
        <button
          className="text-xs cursor-pointer transition-all bg-green-600 text-white px-6 py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center"
          onClick={() => redirect("/dashboard/admin/branches")}>
          <Store className="h-4 w-4 md:h-5 md:w-5" /> View branches
        </button>
      </div>
      
      <WarningMessage message="All fields are required" />
      
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="order-1 md:order-2">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Branch Image</legend>
            <ImageCropper onImageCropped={handleCroppedImage} aspect={1 / 1} />
          </fieldset>
        </div>

        <div className="flex flex-col gap-2 order-2 md:order-1">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Branch name</legend>
            <input
              type="text"
              name="name"
              className="input focus:outline-none w-full"
              placeholder="Branch One"
              onChange={handleInputChange}
            />
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Address</legend>
            <input
              type="text"
              name="address"
              className="input focus:outline-none w-full"
              placeholder="Durgacity"
              onChange={handleInputChange}
            />
          </fieldset>

          <div className="mt-2 mb-6">
            <button
              className="text-xs font-semibold cursor-pointer transition-all bg-green-600 text-white py-3 md:px-8 md:py-2 rounded-lg border-green-700 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex gap-2 items-center justify-center w-full md:w-auto"
              type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default page;
