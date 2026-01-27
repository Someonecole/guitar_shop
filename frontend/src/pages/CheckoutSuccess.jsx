import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "react-router-dom";

export default function CheckoutSuccess() {
  const { clear } = useCart();
  const [params] = useSearchParams();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="text-lg font-semibold">Успешно плащане</div>
        <div className="mt-2 text-sm text-zinc-300">OrderId: {params.get("orderId")}</div>
        <div className="mt-3 text-sm text-zinc-400">
          Insufficient data to verify автоматично маркиране на поръчка като paid без Stripe webhook.
        </div>
      </div>
    </div>
  );
}
