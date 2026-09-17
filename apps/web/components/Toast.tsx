"use client";
import { useEffect, useState } from "react";
export function notify(message: string) {
  window.dispatchEvent(new CustomEvent("booknest:toast", { detail: message }));
}
export default function Toast() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const show = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(""), 3000);
    };
    window.addEventListener("booknest:toast", show);
    return () => {
      window.removeEventListener("booknest:toast", show);
      clearTimeout(timer);
    };
  }, []);
  return message ? (
    <div
      role="status"
      className="fixed bottom-5 right-5 z-50 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white shadow-xl"
    >
      ✓ {message}
    </div>
  ) : null;
}
