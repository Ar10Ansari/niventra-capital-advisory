import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Project for Funding Consideration | Niventra Capital Advisory",
  description:
    "Institutional real estate project funding submission portal. Submit residential, commercial, or plotted development proposals for preliminary structured finance review.",
  alternates: {
    canonical: "/project-funding/",
  },
  openGraph: {
    title: "Project Funding Consideration — Niventra Capital Advisory",
    description: "Submit project information for institutional due diligence and structured finance evaluation.",
    url: "https://niventracapitaladvisory.com/project-funding/",
    siteName: "Niventra Capital Advisory",
    type: "website",
  },
};

export default function ProjectFundingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
