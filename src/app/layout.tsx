import type { Metadata } from "next";
import "@/public/css/bootstrap.css";
import "@/public/css/normalizer.css";
import Navbar from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "Inventory TES",
  description: "Inventory TES",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
