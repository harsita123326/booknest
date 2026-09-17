"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
export default function Profile() {
  const [u, setU] = useState<any>();
  useEffect(() => {
    api
      .get("/auth/profile")
      .then((r) => setU(r.data))
      .catch(() => {});
  }, []);
  return (
    <div className="card max-w-lg">
      <h1 className="text-3xl font-bold">Your profile</h1>
      {u ? (
        <dl className="mt-5 space-y-2">
          <div>
            <dt className="text-sm text-gray-500">Name</dt>
            <dd>{u.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd>{u.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Role</dt>
            <dd>{u.role}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-3">Please log in to see your profile.</p>
      )}
    </div>
  );
}
