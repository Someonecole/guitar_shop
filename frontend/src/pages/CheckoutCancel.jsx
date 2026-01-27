import React from "react";
import { useSearchParams } from "react-router-dom";

export default function CheckoutCancel() {
  const [params] = useSearchParams();
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="text-lg font-semibold">Плащането е отказано</div>
        <div className="mt-2 text-sm text-zinc-300">OrderId: {params.get("orderId")}</div>
      </div>
    </div>
  );
}
