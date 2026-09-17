"use client";
import Link from "next/link";
import { api, money } from "../lib/api";
import { notify } from "./Toast";
export default function BookGrid({ books }: { books: any[] }) {
  const add = async (id: string) => {
    try {
      await api.post("/cart/items", { bookId: id, quantity: 1 });
      notify("Item successfully added to your cart");
    } catch (e: any) {
      notify(e.response?.data?.message || "Please log in first");
    }
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {books.map((b) => (
        <article className="card" key={b.id}>
          <img
            className="h-52 w-full rounded object-cover"
            src={b.imageUrl}
            alt=""
          />
          <p className="mt-3 text-xs text-clay">{b.category?.name}</p>
          <Link href={`/books/${b.id}`} className="font-bold">
            {b.title}
          </Link>
          <p className="text-sm text-gray-500">{b.author}</p>
          <div className="mt-3 flex items-center justify-between">
            <b>{money(b.price)}</b>
            <button className="btn text-sm" onClick={() => add(b.id)}>
              Add
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
