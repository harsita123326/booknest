"use client";
import { useEffect, useState } from "react";
import { api, money } from "../../lib/api";
export default function Admin() {
  const [d, setD] = useState<any>();
  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((r) => setD(r.data))
      .catch(() => {});
  }, []);
  if (!d)
    return (
      <p className="card">Admin access is required to view this dashboard.</p>
    );
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Users", d.users],
          ["Books", d.books],
          ["Orders", d.orders],
          ["Revenue", money(d.revenue)],
        ].map(([k, v]) => (
          <div key={String(k)} className="card">
            <p className="text-gray-500">{k}</p>
            <p className="text-3xl font-bold">{v}</p>
          </div>
        ))}
      </div>
    </>
  );
}
