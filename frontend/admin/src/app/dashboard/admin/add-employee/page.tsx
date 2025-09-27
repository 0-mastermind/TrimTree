"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ImageCropper from "@/components/ImageCropper";
import { Store } from "lucide-react";
import { redirect } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getAllBranches } from "@/utils/api/branches";
import DropDown from "@/components/common/DropDown";
import { getManagerNameByBranch } from "@/utils/api/manager";
import toast from "react-hot-toast";
import { createUser } from "@/utils/api/auth";
import WarningMessage from "@/components/common/WarningMessage";

interface FormDataState {
  name: string;
  username: string;
  email: string;
  password: string;
  salary: number | null;
  designation: string;
  branch: {
    branchId: string;
    name: string;
  };
  role: "MANAGER" | "STAFF" | "";
  manager: {
    id: string;
    name: string;
  };
  image: File | null;
}

const page = () => {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    username: "",
    email: "",
    password: "",
    salary: null,
    designation: "",
    branch: {
      branchId: "",
      name: "",
    },
    role: "",
    manager: {
      id: "",
      name: "",
    },
    image: null,
  });
  const dispatch = useAppDispatch();
  const branchData = useAppSelector((state) => state.branches.branches);
  const managersData = useAppSelector(
    (state) => state.branches.branchManagerName
  );
  const branchesName = branchData.map((item) => ({
    name: item.name,
    id: item._id,
  }));
  const managerName = managersData.map((item) => ({
    id: item._id,
    name: item.name,
  }));

  useEffect(() => {
    const fetch = async () => {
      try {
        await dispatch(getAllBranches());
      } catch (error) {
        console.error("Error! while fetching branch list");
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    const branchId = formData.branch.branchId;

    if (branchId) {
      const fetchManagersName = async () => {
        try {
          await dispatch(getManagerNameByBranch(branchId));
        } catch (error) {
          console.log("Error while fetching managers name", error);
        }
      };

      fetchManagersName();
    }
  }, [formData.branch.branchId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCroppedImage = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // checking required element should not be empty
    const isDataValid =
      formData.name.trim() !== "" &&
      formData.username.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.branch.branchId.trim() !== "" &&
      formData.branch.name.trim() !== "" &&
      formData.role.trim() !== "";
    formData.designation.trim() !== "";

    if (!isDataValid) {
      return toast.error("Please fill all required field!");
    }

    // Fixed select manager from inappropriate branch bug
    const isManagerValid = () => {
      const selectedBranch = formData.branch.branchId;
      const selectedManager = managersData.filter(
        (item) => item.branch._id === selectedBranch
      );

      if (selectedManager.length > 0) {
        return true;
      } else {
        return false;
      }
    };

    if (!isManagerValid() && formData.role !== "MANAGER") {
      return toast.error("Please enter the valid manager!");
    }

    // Creating form for submission
    const data = new FormData();

    data.append("name", formData.name);
    data.append("username", formData.username);
    data.append("password", formData.password);
    data.append("email", formData.email);
    data.append("branch", formData.branch.branchId);
    data.append("manager", formData.manager.id);
    data.append("role", formData.role);
    data.append("designation", formData.designation);

    // optional fields
    if (formData.email) data.append("email", formData.email);
    if (formData.salary !== null) {
      data.append("salary", formData.salary.toString());
    }
    if (formData.image) data.append("image", formData.image);
    if (formData.manager.id) data.append("managerId", formData.manager.id);

    const uploadForm = async () => {
      try {
        await dispatch(createUser(data));
      } catch (error) {
        console.error("Erro while uploading form!", error);
      }
    };

    uploadForm();
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

      <WarningMessage message="* is for required fields" />
      
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        onSubmit={handleSubmit}>
        <div className="order-1 md:order-2">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">User Profile Picture</legend>
            <ImageCropper aspect={1 / 1} onImageCropped={handleCroppedImage} />
          </fieldset>
        </div>

        <div className="flex flex-col gap-2 order-2 md:order-1">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Name*</legend>
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
            <legend className="fieldset-legend">Username*</legend>
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
            <legend className="fieldset-legend">Password*</legend>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input focus:outline-none w-full"
              placeholder="password@123"
            />
          </fieldset>

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Designation*</legend>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className="input focus:outline-none w-full"
              placeholder="Artist"
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

          <div className="grid grid-cols-2 gap-4">
            {/* Drop down component */}
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Branch*</legend>

              <DropDown
                values={branchesName}
                onItemSelected={(selectedBranch) => {
                  setFormData((prev) => ({
                    ...prev,
                    branch: {
                      branchId: selectedBranch.id,
                      name: selectedBranch.name,
                    },
                  }));
                }}
                placeholder="Select a branch"
              />
            </fieldset>

            <fieldset className="fieldset w-full focus:outline-none">
              <legend className="fieldset-legend">Role*</legend>
              <DropDown
                values={[
                  { name: "MANAGER", id: "MANAGER" },
                  { name: "STAFF", id: "STAFF" },
                ]}
                onItemSelected={(selectedBranch) => {
                  setFormData((prev) => ({
                    ...prev,
                    role: selectedBranch.name as "MANAGER" | "STAFF",
                  }));
                }}
                placeholder="Select a role"
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Manager</legend>
              <div
                className={
                  !formData.branch.branchId ||
                  !formData.role ||
                  formData.role === "MANAGER"
                    ? "opacity-80 pointer-events-none"
                    : ""
                }>
                <DropDown
                  values={
                    !formData.branch.branchId ||
                    !formData.role ||
                    formData.role === "MANAGER"
                      ? []
                      : managerName
                  }
                  onItemSelected={(selectedManager) => {
                    setFormData((prev) => ({
                      ...prev,
                      manager: {
                        id: selectedManager.id,
                        name: selectedManager.name,
                      },
                    }));
                  }}
                  placeholder={
                    formData.role === "MANAGER"
                      ? "Not applicable"
                      : !formData.branch.branchId
                      ? "Select a branch first"
                      : "Select a manager"
                  }
                />
              </div>
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Salary</legend>
              <input
                type="number"
                name="salary"
                value={formData.salary ?? ""}
                onChange={handleInputChange}
                className="input focus:outline-none w-full"
                placeholder={
                  !formData.role
                    ? "Select a role"
                    : formData.role === "MANAGER"
                    ? "Not Applicable"
                    : "Enter salary"
                }
                disabled={!formData.role || formData.role === "MANAGER"}
              />
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
