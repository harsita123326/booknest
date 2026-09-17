"use client";
import { useEffect, useState } from "react";
import { api, money } from "../../../lib/api";
import { notify } from "../../../components/Toast";
export default function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [b, setB] = useState<any>();
  useEffect(() => {
    params.then((p) => api.get(`/books/${p.id}`).then((r) => setB(r.data)));
  }, [params]);
  if (!b) return <p>Loading book…</p>;
  return (
    <article className="grid gap-8 md:grid-cols-2">
      <img src={b.imageUrl} className="w-full rounded-xl object-cover" alt="" />
      <div>
        <p className="text-clay">{b.category.name}</p>
        <h1 className="my-2 text-4xl font-bold">{b.title}</h1>
        <p className="text-xl text-gray-500">by {b.author}</p>
        <p className="my-6 leading-7">{b.description}</p>
        <p className="text-2xl font-bold">{money(b.price)}</p>
        <p className="my-2 text-sm">
          ★ {b.rating.toFixed(1)} · {b.stock} in stock
        </p>
        <button
          className="btn"
          onClick={() =>
            api
              .post("/cart/items", { bookId: b.id, quantity: 1 })
              .then(() => notify("Item successfully added to your cart"))
              .catch((e) =>
                notify(e.response?.data?.message || "Please log in first"),
              )
          }
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
