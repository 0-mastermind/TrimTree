import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = ''
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95 cursor-pointer
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-yellow-300 to-amber-400 text-gray-800
      hover:from-yellow-300 hover:to-amber-400
      focus:ring-yellow-400 shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-gray-900 text-white
      hover:bg-gray-800
      focus:ring-gray-500 shadow-md hover:shadow-lg
    `,
    outline: `
      border-2 border-gray-300 text-gray-700 bg-transparent
      hover:border-gray-400 hover:bg-gray-50
      focus:ring-gray-300
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-500 text-white
      hover:from-green-600 hover:to-emerald-600
      focus:ring-green-500 shadow-lg hover:shadow-xl
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-pink-500 text-white
      hover:from-red-600 hover:to-pink-600
      focus:ring-red-500 shadow-lg hover:shadow-xl
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;