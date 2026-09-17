"use client";
import { useEffect, useState } from "react";
import BookGrid from "../../components/BookGrid";
import { api } from "../../lib/api";
export default function Books() {
  const [data, setData] = useState<any[]>([]),
    [cats, setCats] = useState<any[]>([]),
    [q, setQ] = useState(""),
    [categoryId, setCat] = useState(""),
    [sort, setSort] = useState("newest");
  const load = () =>
    api
      .get("/books", { params: { search: q, categoryId, sort } })
      .then((r) => setData(r.data.data))
      .catch(() => setData([]));
  useEffect(() => {
    api.get("/categories").then((r) => setCats(r.data));
    load();
  }, []);
  return (
    <>
      <h1 className="mb-5 text-3xl font-bold">Browse books</h1>
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <input
          placeholder="Search title or author"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={categoryId} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
        <button className="btn" onClick={load}>
          Apply filters
        </button>
      </div>
      {data.length ? (
        <BookGrid books={data} />
      ) : (
        <p className="card">No books matched your search.</p>
      )}
    </>
  );
}
