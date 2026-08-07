import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Counter({ to, className = "" }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  const run = () => {
    if (started.current) return;
    started.current = true;
    const t0 = performance.now();
    const duration = 1400;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <motion.span onViewportEnter={run} viewport={{ once: true }} className={className}>
      {value}
    </motion.span>
  );
}
