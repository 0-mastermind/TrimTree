import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Camera, Save, Eye, EyeOff, User, Mail, Key, AtSign, Edit3 } from 'lucide-react';
import Loader from '@/components/common/Loader';
import CropModal from './crop';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/store/hook';
import { updateProfile } from '@/api/auth';
import Button from '@/components/common/Button';

interface FormData {
  userId: string;
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const cropDefaultSize = { width: 250, height: 250 };

const InitialAvatar: React.FC<{ name: string; size?: number }> = React.memo(({ name, size = 96 }) => {
  const initials = useMemo(() =>
    name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2), [name]
  );
  return (
    <div
      className="bg-emerald-800 flex items-center justify-center text-white font-semibold rounded-full"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
});

const useOriginalFormData = (user: any): FormData => ({
  userId: user?._id || '',
  name: user?.name || '',
  username: user?.username || '',
  email: user?.email || '',
  password: '',
  confirmPassword: ''
});

const UserSettingsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

  if (!user) return <Loader />;

  const [formData, setFormData] = useState<FormData>(useOriginalFormData(user));
  const [originalData, setOriginalData] = useState<FormData>(useOriginalFormData(user));

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const newOriginal = useOriginalFormData(user);
      setOriginalData(newOriginal);
      setFormData(newOriginal);
    }
  }, [user]);

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }, [errors]);

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Helper to get changed fields and construct FormData for submission
  const getChangedFieldsAndFormData = useCallback(async () => {
    const changedFields: Partial<FormData & { image?: boolean }> = {};
    const formDataObj = new window.FormData();
    Object.entries(formData).forEach(([key, value]) => {
      const fieldKey = key as keyof FormData;
      if (fieldKey === 'confirmPassword') return;
      if (fieldKey === 'password') {
        if (value.trim()) {
          changedFields[fieldKey] = value;
          formDataObj.append(fieldKey, value);
        }
      } else if (value !== originalData[fieldKey]) {
        changedFields[fieldKey] = value;
        formDataObj.append(fieldKey, value);
      }
    });
    if (croppedImage) {
      const blob = await fetch(croppedImage).then(res => res.blob());
      formDataObj.append('image', blob, 'profile.jpg');
      changedFields.image = true;
    }
    formDataObj.append('userId', user._id);
    return { changedFields, formDataObj };
  }, [formData, originalData, croppedImage, user?._id]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const { changedFields, formDataObj } = await getChangedFieldsAndFormData();

    if (!Object.keys(changedFields).length) {
      toast.error('No changes to save');
      setIsLoading(false);
      return;
    }

    const res = await dispatch(updateProfile(formDataObj) as any);
    if (res) {
      setOriginalData(({ ...formData, password: '', confirmPassword: '' }));
      setCroppedImage(null);
      setIsEditing(false);
    }
    setIsLoading(false);
  }, [validateForm, getChangedFieldsAndFormData, dispatch, formData]);

  // Detect unsaved changes (memoized)
  const hasChanges = useMemo(() => {
    const hasTextChanges = Object.entries(formData).some(([key, value]) => {
      const fieldKey = key as keyof FormData;
      if (fieldKey === 'confirmPassword') return false;
      if (fieldKey === 'password') return value.trim() !== '';
      return value !== originalData[fieldKey];
    });
    return hasTextChanges || croppedImage !== null;
  }, [formData, originalData, croppedImage]);

  const handleImageError = useCallback(() => setImageError(true), []);

  const renderProfileImage = useCallback(() => {
    const imageUrl = croppedImage || user?.image?.url;
    if (imageUrl && !imageError) {
      return (
        <img
          src={imageUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      );
    }
    return <InitialAvatar name={formData.name || user?.name || 'User'} size={96} />;
  }, [croppedImage, user, imageError, handleImageError, formData.name]);

  // Early Loader if user not loaded
  if (!user) return <Loader />;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-8">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Account Settings
                </h1>
  
              </div>
              {!isEditing ? (
                <Button
                  variant='primary'
                  className='group'
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={18} className="group-hover:rotate-12 transition-transform mr-4" />
                  <span className="font-medium">Edit Profile</span>
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                   variant='outline'
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ ...originalData });
                      setCroppedImage(null);
                      setErrors({});
                      setImageError(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                  variant='success'
                    onClick={handleSubmit}
                    disabled={!hasChanges || isLoading}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform ${
                      hasChanges && !isLoading
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-6 mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-2xl ring-4 ring-white">
                  {renderProfileImage()}
                </div>
                <button
                  type="button"
                  onClick={() => isEditing && fileInputRef.current?.click()}
                  className={`absolute -bottom-2 -right-2 p-3 rounded-full shadow-lg transition-all duration-200 ${
                    isEditing 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-110 cursor-pointer' 
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                  disabled={!isEditing}
                >
                  <Camera size={16} />
                </button>
                {isEditing && (
                  <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Camera size={20} className="text-white" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={!isEditing}
              />
              <p className="text-sm text-gray-500 text-center max-w-xs">
                {isEditing ? 'Click the camera icon to change your profile picture' : 'Profile picture'}
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <User size={16} className="text-blue-600" />
                  </div>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                  } ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your full name"
                  disabled={!isEditing}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                    <AtSign size={16} className="text-purple-600" />
                  </div>
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => handleInputChange('username', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    errors.username ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                  } ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your username"
                  disabled={!isEditing}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="lg:col-span-2 space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                    <Mail size={16} className="text-green-600" />
                  </div>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                  } ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your email address"
                  disabled={!isEditing}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                    <Key size={16} className="text-orange-600" />
                  </div>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                      errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                    } ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="Leave blank to keep current"
                    disabled={!isEditing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={!isEditing}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                    <Key size={16} className="text-red-600" />
                  </div>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                      errors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300'
                    } ${!formData.password || !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="Confirm new password"
                    disabled={!formData.password || !isEditing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(s => !s)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={!formData.password || !isEditing}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Save Changes Info */}
            {isEditing && hasChanges && (
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-800 text-sm flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  You have unsaved changes. Don't forget to save!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && selectedImage && (
        <CropModal
          image={selectedImage}
          cropArea={cropDefaultSize}
          onCancel={() => setShowCropModal(false)}
          onConfirm={(croppedImg) => {
            setCroppedImage(croppedImg);
            setShowCropModal(false);
            setImageError(false);
          }}
        />
      )}
    </div>
  );
};

export default UserSettingsPage;