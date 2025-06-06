// app/layout.js
import "./globals.css";

export const metadata = {
  title: "LinkGraph",
  description: "The Ultimate Creator Hub",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
