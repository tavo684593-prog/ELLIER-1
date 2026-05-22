import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ELLIÉR | Minimal Luxury Essentials",
  description:
    "E-commerce premium minimalista para ELLIÉR: ropa, termos, regalos y accesorios con estética unisex de lujo."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
