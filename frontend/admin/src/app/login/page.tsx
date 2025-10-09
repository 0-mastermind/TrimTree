"use client";
import {
  useLayoutEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react";
import { login } from "@/utils/api/auth";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    if (!auth.isLoggedIn) {
      setIsLoading(false);
      return;
    }

    // router.push("/dashboard");
  }, [auth.isLoggedIn, router, setIsLoading]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setisSubmitting(true);
    try {
      const res: boolean = await dispatch(
        login(formData.username, formData.password)
      );

      if (res) {
        router.push("/dashboard/admin");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setisSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const isFormValid = formData.username.trim() && formData.password;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-8 bg-gradient-to-br from-base-200 via-base-100 to-primary/10">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-70"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-70"></div>
          </div>

          <div className="relative w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-2xl">T</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">
                Welcome Back
              </h1>
              <p className="text-base-content/70 text-lg">
                Log in to your account to continue
              </p>
            </div>

            {/* Login Form */}
            <div className="card bg-base-100 shadow-2xl border border-base-300/50 backdrop-blur-sm">
              <div className="card-body p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-base-content">Username</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`input w-full pl-12 pr-4 bg-gray-50 border-2 focus:outline-none focus:ring-0 ${
                          errors.username
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-primary focus:bg-white"
                        }`}
                        placeholder="Enter your username"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.username && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-2">
                          <span className="w-1 h-1 bg-error rounded-full"></span>
                          {errors.username}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-base-content">Password</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`input w-full pl-12 pr-12 bg-gray-50 border-2 focus:outline-none focus:ring-0 ${
                          errors.password
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-primary focus:bg-white"
                        }`}
                        placeholder="Enter your password"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-primary z-10"
                        disabled={isSubmitting}>
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500 hover:text-primary" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500 hover:text-primary" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-2">
                          <span className="w-1 h-1 bg-error rounded-full"></span>
                          {errors.password}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`btn w-full py-3 text-lg font-semibold transition-all duration-300 transform rounded-md ${
                      !isFormValid || isSubmitting
                        ? "btn-disabled"
                        : "btn-primary hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                    }`}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                        <span>Logging in</span>
                      </>
                    ) : (
                      <span>Log In</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;