import type { Metadata } from "next";
import "./css/bootstrap.css";
import "./css/normalizer.css";

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
      <body>{children}</body>
    </html>
  );
}
