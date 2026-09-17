"use client";
import { useEffect, useState } from "react";
import { api, money } from "../../../lib/api";
export default function AdminBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const load = () =>
    api
      .get("/books", { params: { limit: 50 } })
      .then((r) => setBooks(r.data.data))
      .catch(() => {});
  useEffect(() => {
    void load();
  }, []);
  return (
    <>
      <h1 className="mb-5 text-3xl font-bold">Inventory</h1>
      <div className="space-y-3">
        {books.map((b) => (
          <div className="card flex items-center gap-4" key={b.id}>
            <img
              className="h-14 w-10 rounded object-cover"
              src={b.imageUrl}
              alt=""
            />
            <div className="flex-1">
              <b>{b.title}</b>
              <p className="text-sm text-gray-500">
                {money(b.price)} · {b.stock} in stock
              </p>
            </div>
            <button
              className="text-sm text-red-700"
              onClick={() => {
                if (confirm(`Delete ${b.title}?`))
                  api
                    .delete(`/books/${b.id}`)
                    .then(load)
                    .catch((e) => alert(e.response?.data?.message));
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
