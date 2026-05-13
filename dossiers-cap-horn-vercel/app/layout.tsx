import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dossiers Cap Horn",
  description: "Bibliothèque pédagogique de cas radiologiques anonymisés"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
