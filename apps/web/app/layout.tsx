import "./globals.css";
import Nav from "../components/Nav";
import Toast from "../components/Toast";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "BookNest" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto min-h-screen max-w-6xl p-4">{children}</main>
        <Toast />
        <footer className="border-t p-6 text-center text-sm text-gray-500">
          © 2026 BookNest · Your next great read awaits.
        </footer>
      </body>
    </html>
  );
}
