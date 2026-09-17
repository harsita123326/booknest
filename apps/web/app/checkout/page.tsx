"use client";
import { useForm } from "react-hook-form";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
type Delivery = {
  recipientName: string;
  phone: string;
  shippingAddress: string;
  landmark?: string;
};
export default function Checkout() {
  const r = useRouter(),
    {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<Delivery>();
  const submit = async (data: Delivery) => {
    try {
      const order = await api.post("/orders", data);
      r.push(`/orders/${order.data.id}?success=1`);
    } catch (e: any) {
      alert(e.response?.data?.message || "Checkout failed");
    }
  };
  return (
    <form
      className="card mx-auto max-w-xl space-y-4"
      onSubmit={handleSubmit(submit)}
    >
      <div>
        <p className="text-sm font-semibold text-clay">CASH ON DELIVERY</p>
        <h1 className="text-3xl font-bold">Delivery details</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pay when your books arrive. No online payment is collected.
        </p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Full name</label>
        <input
          placeholder="Your full name"
          {...register("recipientName", {
            required: "Name is required",
            minLength: 2,
          })}
        />
        {errors.recipientName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.recipientName.message}
          </p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Phone number</label>
        <input
          placeholder="Phone number"
          {...register("phone", {
            required: "Phone number is required",
            minLength: { value: 8, message: "Enter a valid phone number" },
          })}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Complete address
        </label>
        <textarea
          rows={4}
          placeholder="House / street / city / postal code"
          {...register("shippingAddress", {
            required: "Address is required",
            minLength: {
              value: 10,
              message: "Please enter a complete address",
            },
          })}
        />
        {errors.shippingAddress && (
          <p className="mt-1 text-sm text-red-600">
            {errors.shippingAddress.message}
          </p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Landmark <span className="text-gray-400">optional</span>
        </label>
        <input placeholder="Nearby landmark" {...register("landmark")} />
      </div>
      <div className="rounded-lg border border-clay/30 bg-orange-50 p-4">
        <b>Payment method: Cash on Delivery</b>
        <p className="mt-1 text-sm text-gray-600">
          Please keep the required cash ready at delivery.
        </p>
      </div>
      <button disabled={isSubmitting} className="btn w-full">
        {isSubmitting ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
