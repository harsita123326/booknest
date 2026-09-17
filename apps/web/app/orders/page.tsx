"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, money } from "../../lib/api";
export default function Orders() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    api
      .get("/orders")
      .then((r) => setItems(r.data))
      .catch(() => {});
  }, []);
  return (
    <>
      <h1 className="mb-5 text-3xl font-bold">Order history</h1>
      {items.length ? (
        items.map((o) => (
          <Link className="card mb-3 block" href={`/orders/${o.id}`} key={o.id}>
            <div className="flex justify-between">
              <b>Order {o.id.slice(-6)}</b>
              <b>{money(o.totalAmount)}</b>
            </div>
            <p className="text-sm text-gray-500">
              {o.status} · {new Date(o.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))
      ) : (
        <p className="card">No orders yet.</p>
      )}
    </>
  );
}
