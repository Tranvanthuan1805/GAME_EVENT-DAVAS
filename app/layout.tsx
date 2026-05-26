import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DUO GAME – DAVAS 2026",
  description: "Mini quiz game for DAVAS 2026 event by Duo Tech",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐬</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
