import { useEffect, useState } from "react";

function computeParts(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    d: Math.floor(diff / 864e5),
    h: Math.floor((diff % 864e5) / 36e5),
    m: Math.floor((diff % 36e5) / 6e4),
    s: Math.floor((diff % 6e4) / 1e3),
  };
}

const pad = (n) => String(n).padStart(2, "0");

export default function Countdown({ target }) {
  const [parts, setParts] = useState(() => computeParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(computeParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const items = [
    ["J", parts.d],
    ["H", pad(parts.h)],
    ["M", pad(parts.m)],
    ["S", pad(parts.s)],
  ];

  return (
    <div className="flex gap-5">
      {items.map(([label, val]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-3xl font-bold text-brand-cyan">{val}</span>
          <span className="text-[10px] uppercase tracking-instrument text-white/50">{label}</span>
        </div>
      ))}
    </div>
  );
}
