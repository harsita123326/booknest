"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Welcome() {
  const [user, setUser] = useState<any>();
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);
  if (user)
    return (
      <section className="my-12 rounded-2xl bg-ink px-8 py-16 text-white">
        <p className="text-clay">WELCOME BACK, {user.name?.toUpperCase()}</p>
        <h1 className="mt-3 text-5xl font-bold">
          Ready for your next chapter?
        </h1>
        <p className="my-5 text-gray-300">Your BookNest account is ready.</p>
        <Link
          className="btn bg-clay"
          href={user.role === "ADMIN" ? "/admin" : "/books"}
        >
          Continue to {user.role === "ADMIN" ? "admin dashboard" : "bookstore"}
        </Link>
      </section>
    );
  return (
    <section className="my-12 overflow-hidden rounded-2xl bg-ink p-8 text-white md:p-16">
      <p className="text-sm font-semibold tracking-[.2em] text-clay">
        WELCOME TO BOOKNEST
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl font-bold md:text-6xl">
        A thoughtful home for every reader.
      </h1>
      <p className="my-6 max-w-xl text-lg text-gray-300">
        Choose how you&apos;d like to enter. Customers browse and order books;
        administrators manage the store.
      </p>
      <div className="grid max-w-2xl gap-4 md:grid-cols-2">
        <Link
          className="rounded-xl bg-white p-6 text-ink hover:bg-stone-100"
          href="/login?role=CUSTOMER"
        >
          <span className="text-3xl">📚</span>
          <h2 className="mt-3 text-xl font-bold">I&apos;m a customer</h2>
          <p className="mt-1 text-sm text-gray-600">
            Browse, add books to a cart, and place orders.
          </p>
          <span className="mt-5 inline-block font-semibold text-clay">
            Sign in or register →
          </span>
        </Link>
        <Link
          className="rounded-xl border border-white/30 p-6 hover:bg-white/10"
          href="/login?role=ADMIN"
        >
          <span className="text-3xl">⚙️</span>
          <h2 className="mt-3 text-xl font-bold">I&apos;m an administrator</h2>
          <p className="mt-1 text-sm text-gray-300">
            Manage inventory, users, orders, and metrics.
          </p>
          <span className="mt-5 inline-block font-semibold text-clay">
            Administrator sign in →
          </span>
        </Link>
      </div>
    </section>
  );
}
