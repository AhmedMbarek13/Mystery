import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luna's Mansion | A Birthday Mystery",
  description: "Every house keeps its secrets. This one keeps its dead.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
