import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

export const metadata = {
  title: "Les Amis Du CBD",
  description: "Boutique en ligne premium de CBD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={bricolage.className} suppressHydrationWarning>
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
