"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, money } from "../../lib/api";

export default function Cart() {
  const [cart, setCart] = useState<any>();
  const load = () =>
    api
      .get("/cart")
      .then((response) => setCart(response.data))
      .catch(() => setCart({ items: [] }));

  useEffect(() => {
    let mounted = true;
    async function loadCart() {
      try {
        const response = await api.get("/cart");
        if (mounted) setCart(response.data);
      } catch {
        if (mounted) setCart({ items: [] });
      }
    }
    void loadCart();
    return () => {
      mounted = false;
    };
  }, []);

  if (!cart) return <p>Loading cart…</p>;
  const total = cart.items.reduce(
    (sum: number, item: any) => sum + Number(item.book.price) * item.quantity,
    0,
  );
  return (
    <>
      <h1 className="mb-5 text-3xl font-bold">Your cart</h1>
      {cart.items.length === 0 ? (
        <p className="card">
          Your cart is empty. <Link href="/books">Browse books</Link>
        </p>
      ) : (
        <div className="space-y-3">
          {cart.items.map((item: any) => (
            <div className="card flex items-center gap-4" key={item.id}>
              <img
                src={item.book.imageUrl}
                className="h-16 w-12 rounded object-cover"
                alt=""
              />
              <div className="flex-1">
                <b>{item.book.title}</b>
                <p>{money(item.book.price)}</p>
              </div>
              <input
                className="w-20"
                type="number"
                min="1"
                value={item.quantity}
                onChange={(event) =>
                  api
                    .patch(`/cart/items/${item.bookId}`, {
                      quantity: +event.target.value,
                    })
                    .then(load)
                }
              />
              <button
                onClick={() =>
                  api.delete(`/cart/items/${item.bookId}`).then(load)
                }
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
          <Link className="btn" href="/checkout">
            Checkout
          </Link>
        </div>
      )}
    </>
  );
}
