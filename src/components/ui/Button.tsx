import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "primary-outline" | "ghost" | "brass" | "brass-outline";
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
  // All buttons share the same base foundation
  const base =
    "inline-flex items-center justify-center font-body font-semibold rounded transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] focus-visible:ring-offset-2 active:scale-[0.98]";

  const sizes = {
    sm:  "px-4 py-2 text-xs tracking-wide min-h-[36px] gap-1.5",
    md:  "px-5 py-2.5 text-[0.875rem] min-h-[44px] gap-2",
    lg:  "px-7 py-3.5 text-[0.9375rem] min-h-[50px] gap-2.5",
  };

  const variants = {
    /* Solid deep ink — primary authoritative action */
    primary:
      "bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] shadow-sm hover:shadow-md",

    /* Outlined ink — secondary action on light surfaces */
    "primary-outline":
      "bg-transparent text-[#1A1A1A] border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white",

    /* Ghost — tertiary, minimal presence */
    ghost:
      "bg-transparent text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.05)]",

    /* Brass — accent CTA, used sparingly */
    brass:
      "bg-[#9A7B2C] text-white hover:bg-[#B8922F] shadow-sm hover:shadow-md",

    /* Brass outline — accent secondary */
    "brass-outline":
      "bg-transparent text-[#9A7B2C] border border-[#9A7B2C] hover:bg-[#9A7B2C] hover:text-white",
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
};
