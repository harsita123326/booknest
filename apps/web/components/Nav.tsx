"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Nav() {
  const r = useRouter(),
    path = usePathname(),
    [user, setUser] = useState<any>();
  useEffect(() => {
    const saved = localStorage.getItem("user");
    setUser(saved ? JSON.parse(saved) : null);
  }, [path]);
  const logout = () => {
    localStorage.clear();
    setUser(null);
    r.push("/");
  };
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-4">
        <Link href="/" className="text-2xl font-bold text-clay">
          BookNest
        </Link>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            {user.role === "ADMIN" ? (
              <>
                <Link href="/admin">Dashboard</Link>
                <Link href="/admin/books">Books</Link>
                <Link href="/admin/orders">Orders</Link>
                <Link href="/admin/users">Users</Link>
              </>
            ) : (
              <>
                <Link href="/books">Browse</Link>
                <Link href="/cart">Cart</Link>
                <Link href="/orders">Orders</Link>
                <Link href="/profile">Profile</Link>
              </>
            )}
            <span className="hidden text-gray-500 md:inline">{user.name}</span>
            <button className="font-semibold" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3 text-sm">
            <Link href="/login?role=CUSTOMER">Customer sign in</Link>
            <Link className="font-semibold text-clay" href="/login?role=ADMIN">
              Admin sign in
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
