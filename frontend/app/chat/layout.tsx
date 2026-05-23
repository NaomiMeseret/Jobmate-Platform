import type React from "react";

export const metadata = {
  title: "JobMate Chat",
  description: "AI career chat workspaces for JobMate",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
