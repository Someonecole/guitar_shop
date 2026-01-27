import React from "react";

export default function Placeholder({ title }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="text-lg font-semibold">{title}</div>
        <div className="mt-2 text-sm text-zinc-400">Placeholder</div>
      </div>
    </div>
  );
}
