"use client";
import Link from "next/link";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../lib/api";
import { useRouter, useSearchParams } from "next/navigation";
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
function LoginForm() {
  const r = useRouter(),
    params = useSearchParams(),
    role = params.get("role") === "ADMIN" ? "ADMIN" : "CUSTOMER";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const submit = async (d: any) => {
    try {
      const x = await api.post("/auth/login", d);
      if (x.data.user.role !== role) {
        alert(
          `This account is not authorized as a ${role === "ADMIN" ? "administrator" : "customer"}.`,
        );
        return;
      }
      localStorage.setItem("token", x.data.accessToken);
      localStorage.setItem("user", JSON.stringify(x.data.user));
      r.push(role === "ADMIN" ? "/admin" : "/books");
    } catch (e: any) {
      alert(e.response?.data?.message || "Login failed");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="card mx-auto max-w-md space-y-4"
    >
      <p className="text-sm font-semibold text-clay">
        {role === "ADMIN" ? "ADMINISTRATOR ACCESS" : "CUSTOMER ACCESS"}
      </p>
      <h1 className="text-2xl font-bold">
        {role === "ADMIN"
          ? "Sign in to manage BookNest"
          : "Welcome back, reader"}
      </h1>
      {role === "ADMIN" && (
        <p className="rounded bg-amber-50 p-3 text-sm text-amber-800">
          Only accounts assigned the ADMIN role can continue.
        </p>
      )}
      <input placeholder="Email" {...register("email")} />
      {errors.email && <p className="text-red-600">Valid email required</p>}
      <input type="password" placeholder="Password" {...register("password")} />
      {errors.password && (
        <p className="text-red-600">Password must be 8 characters</p>
      )}
      <button className="btn w-full">Sign in</button>
      {role === "CUSTOMER" ? (
        <p>
          New here?{" "}
          <Link className="text-clay" href="/register">
            Create a customer account
          </Link>
        </p>
      ) : (
        <p className="text-sm">
          Need a customer account?{" "}
          <Link className="text-clay" href="/login?role=CUSTOMER">
            Customer sign in
          </Link>
        </p>
      )}
    </form>
  );
}
export default function Login() {
  return (
    <Suspense fallback={<p>Loading sign in…</p>}>
      <LoginForm />
    </Suspense>
  );
}
