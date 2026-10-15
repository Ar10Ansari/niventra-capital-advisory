import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "navy" | "slate" | "outline" | "subtle";
  size?: "sm" | "md";
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gold",
  size = "md",
  className = "",
  icon,
}) => {
  const baseStyles =
    "inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide uppercase transition-colors";

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[10px]",
    md: "px-3.5 py-1 text-xs",
  };

  const variantStyles = {
    gold: "bg-[#D4AF37]/15 text-[#997300] border border-[#D4AF37]/30 dark:text-[#E5C358]",
    navy: "bg-[#0B192C] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm",
    slate: "bg-[#1E3E62]/10 text-[#1E3E62] border border-[#1E3E62]/20",
    outline: "bg-transparent text-gray-700 border border-gray-300",
    subtle: "bg-white/80 backdrop-blur-sm text-[#0B192C] border border-black/10",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
