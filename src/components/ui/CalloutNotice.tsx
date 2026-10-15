import React from "react";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface CalloutNoticeProps {
  title?: string;
  variant?: "brass" | "neutral" | "warning" | "success";
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const CalloutNotice: React.FC<CalloutNoticeProps> = ({
  title,
  variant = "brass",
  children,
  icon,
  className = "",
}) => {
  const styles = {
    brass: {
      box: "bg-[#F9F7F1] border-[rgba(154,123,44,0.3)] text-[#5C5C5C]",
      borderLeft: "border-l-4 border-l-[#9A7B2C]",
      title: "text-[#1A1A1A]",
      icon: <Info className="w-4 h-4 text-[#9A7B2C] shrink-0 mt-0.5" aria-hidden="true" />,
    },
    neutral: {
      box: "bg-[#F4F3EF] border-[rgba(26,26,26,0.1)] text-[#5C5C5C]",
      borderLeft: "border-l-4 border-l-[#5C5C5C]",
      title: "text-[#1A1A1A]",
      icon: <Info className="w-4 h-4 text-[#5C5C5C] shrink-0 mt-0.5" aria-hidden="true" />,
    },
    warning: {
      box: "bg-[#FFF9F2] border-[#F2C99D] text-[#6E4822]",
      borderLeft: "border-l-4 border-l-[#D97706]",
      title: "text-[#9A3412]",
      icon: <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" aria-hidden="true" />,
    },
    success: {
      box: "bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]",
      borderLeft: "border-l-4 border-l-[#16A34A]",
      title: "text-[#14532D]",
      icon: <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" aria-hidden="true" />,
    },
  };

  const selected = styles[variant];

  return (
    <div
      className={`rounded-r-lg p-5 border text-sm leading-relaxed ${selected.box} ${selected.borderLeft} ${className}`}
      role={variant === "warning" ? "alert" : "note"}
    >
      <div className="flex items-start gap-3">
        {icon !== undefined ? icon : selected.icon}
        <div className="flex-1 space-y-1">
          {title && (
            <h4 className={`font-semibold font-body text-sm ${selected.title}`}>
              {title}
            </h4>
          )}
          <div className="text-[0.875rem]">{children}</div>
        </div>
      </div>
    </div>
  );
};
