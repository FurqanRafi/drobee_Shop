import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer/Footer";
import HeaderController from "@/components/header/HeaderController";
import { AuthContextProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/context/ReduxProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Drobee",
  description: "E-commerse Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <AuthContextProvider>
            <HeaderController />
            {children}
            <Footer />
            <Toaster position="top-right" reverseOrder={false} />
          </AuthContextProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
