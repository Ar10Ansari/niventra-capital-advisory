import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "outline-dark" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  isExternal = false,
  children,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3.5 py-2 text-xs min-h-[38px] gap-1.5",
    md: "px-5 py-2.5 text-sm min-h-[44px] gap-2",
    lg: "px-7 py-3.5 text-base min-h-[50px] gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#D4AF37] text-[#0B192C] font-bold hover:bg-[#E5C358] shadow-sm hover:shadow-md hover:-translate-y-0.5",
    secondary:
      "bg-[#1E3E62] text-white hover:bg-[#2B527E] shadow-sm hover:shadow-md hover:-translate-y-0.5",
    outline:
      "bg-transparent text-[#D4AF37] border border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:-translate-y-0.5",
    "outline-dark":
      "bg-transparent text-[#0B192C] border border-[#0B192C] hover:bg-[#0B192C] hover:text-white hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-gray-700 hover:text-[#0B192C] hover:bg-black/5",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {children}
          {icon && <span className="inline-flex">{icon}</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
        {icon && <span className="inline-flex">{icon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
      {icon && <span className="inline-flex">{icon}</span>}
    </button>
  );
};
