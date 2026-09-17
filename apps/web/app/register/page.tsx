"use client";
import { useForm } from "react-hook-form";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
export default function Register() {
  const r = useRouter(),
    { register, handleSubmit } = useForm();
  const submit = async (d: any) => {
    try {
      const x = await api.post("/auth/register", d);
      localStorage.setItem("token", x.data.accessToken);
      localStorage.setItem("user", JSON.stringify(x.data.user));
      r.push("/");
    } catch (e: any) {
      alert(e.response?.data?.message || "Registration failed");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="card mx-auto max-w-md space-y-4"
    >
      <h1 className="text-2xl font-bold">Join BookNest</h1>
      <input placeholder="Name" {...register("name", { required: true })} />
      <input
        placeholder="Email"
        type="email"
        {...register("email", { required: true })}
      />
      <input
        placeholder="Password (8+ characters)"
        type="password"
        {...register("password", { required: true, minLength: 8 })}
      />
      <button className="btn w-full">Create account</button>
    </form>
  );
}
