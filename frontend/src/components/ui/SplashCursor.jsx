import { useEffect, useRef } from "react";

// Palette de la marque — voir tailwind.config.js (brand.cyan / brand.amber)
// + deux teintes plus claires pour varier les éclaboussures.
const COLORS = ["#22D3EE", "#F5B544", "#67E8F9", "#FCD34D"];
const PARTICLE_LIFETIME = 700; // ms
const MAX_PARTICLES = 200;

/**
 * Traînée d'éclaboussures colorées qui suit le curseur, sur tout le site.
 * Réimplémentée en Canvas 2D (particules + dégradés radiaux, fondu additif)
 * plutôt qu'avec une vraie simulation fluide WebGL comme le composant
 * react-bits d'origine — bien plus simple à écrire/vérifier à la main et
 * largement suffisant visuellement, sans dépendance ni shader GLSL (voir
 * la mésaventure shadcn/Tailwind v4 plus haut dans ce projet).
 * Désactivée si l'utilisateur préfère un mouvement réduit.
 */
export default function SplashCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let raf = null;
    let last = null;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function spawn(x, y) {
      if (particles.length >= MAX_PARTICLES) return;
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: 4 + Math.random() * 10,
        maxRadius: 14 + Math.random() * 22,
        born: performance.now(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    function onPointerMove(e) {
      const x = e.clientX;
      const y = e.clientY;
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.min(6, Math.max(1, Math.floor(dist / 12)));
        for (let i = 0; i < steps; i++) {
          spawn(last.x + dx * (i / steps), last.y + dy * (i / steps));
        }
      } else {
        spawn(x, y);
      }
      last = { x, y };
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    function frame(now) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";
      particles = particles.filter((p) => {
        const age = now - p.born;
        if (age > PARTICLE_LIFETIME) return false;
        const t = age / PARTICLE_LIFETIME;
        const radius = p.radius + (p.maxRadius - p.radius) * t;
        const alphaHex = Math.round((1 - t) * 140)
          .toString(16)
          .padStart(2, "0");
        p.x += p.vx;
        p.y += p.vy;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, `${p.color}${alphaHex}`);
        gradient.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]" />;
}
