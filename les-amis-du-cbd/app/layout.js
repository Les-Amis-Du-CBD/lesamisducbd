import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Les Amis Du CBD",
  description: "Boutique en ligne premium de CBD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
