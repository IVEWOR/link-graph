import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import Animations from "../components/Animations";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevStacks - Your Developer Link-in-Bio Hub",
  description: "Create and share your developer tool stack.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} text-gray-900 dark:text-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Animations />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
