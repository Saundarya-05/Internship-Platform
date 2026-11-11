import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Is This Internship Real?", description: "Explore and evaluate internship opportunities." };

export default function RootLayout({ children }) {
  return <html lang="en"><body><Navbar /><main className="mx-auto min-h-screen max-w-6xl px-5 py-8">{children}</main></body></html>;
}
