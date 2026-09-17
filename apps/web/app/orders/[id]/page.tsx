"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api, money } from "../../../lib/api";
function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const [o, setO] = useState<any>();
  const success = useSearchParams().get("success") === "1";
  useEffect(() => {
    params.then((p) => api.get(`/orders/${p.id}`).then((r) => setO(r.data)));
  }, [params]);
  if (!o) return <p>Loading order…</p>;
  return (
    <div className="card mx-auto max-w-2xl">
      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-5 text-green-900">
          <p className="text-2xl font-bold">✓ Order successfully placed!</p>
          <p className="mt-1">
            Your books will be prepared for cash-on-delivery dispatch.
          </p>
        </div>
      )}
      <h1 className="text-3xl font-bold">Order {o.id.slice(-6)}</h1>
      <p className="my-2">
        Status: <b>{o.status}</b>
      </p>
      {o.items.map((i: any) => (
        <div className="my-3 flex justify-between" key={i.id}>
          <span>
            {i.book.title} × {i.quantity}
          </span>
          <span>{money(i.price)}</span>
        </div>
      ))}
      <hr />
      <p className="mt-3 text-xl font-bold">Total: {money(o.totalAmount)}</p>
      <div className="mt-5 rounded bg-stone-50 p-4 text-sm">
        <b>Cash on Delivery</b>
        <p className="mt-2">
          {o.recipientName} · {o.phone}
        </p>
        <p>{o.shippingAddress}</p>
        {o.landmark && <p>Landmark: {o.landmark}</p>}
      </div>
      <Link className="mt-5 inline-block text-clay" href="/orders">
        View all your orders →
      </Link>
    </div>
  );
}
export default function Order({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p>Loading order…</p>}>
      <OrderDetail params={params} />
    </Suspense>
  );
}
