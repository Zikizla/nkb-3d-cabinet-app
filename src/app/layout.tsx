import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NKB 3D Cabinet App",
  description: "3D cabinet model viewer and editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}