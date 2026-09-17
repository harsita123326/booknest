"use client";
import { useEffect, useState } from "react";
import { api, money } from "../../../lib/api";
const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const load = () =>
    api
      .get("/admin/orders")
      .then((r) => setOrders(r.data))
      .catch(() => alert("Administrator access is required."));
  useEffect(() => {
    void load();
  }, []);
  return (
    <>
      <h1 className="mb-5 text-3xl font-bold">Manage orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div
            className="card flex flex-wrap items-center justify-between gap-3"
            key={o.id}
          >
            <div>
              <b>
                {o.user.name} · {o.id.slice(-6)}
              </b>
              <p className="text-sm text-gray-500">
                {o.items.length} item(s) · {money(o.totalAmount)}
              </p>
            </div>
            <select
              className="w-40"
              value={o.status}
              onChange={(e) =>
                api
                  .patch(`/admin/orders/${o.id}/status`, {
                    status: e.target.value,
                  })
                  .then(load)
              }
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </>
  );
}
