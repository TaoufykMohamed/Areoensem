import { Link, useLocation } from "react-router-dom";
import { motion, LayoutGroup } from "framer-motion";

/**
 * Nav en pilule avec indicateur qui glisse en continu d'un onglet à
 * l'autre (LayoutGroup + layoutId partagé, technique Framer Motion).
 * Adapté depuis le composant "continuous-tabs" du registre shadcn
 * watermelon-ui : converti en JS (le projet n'a pas de TypeScript), et
 * piloté par la route React Router active plutôt qu'un état local, pour
 * que ce soit une vraie navigation et pas un switch de panneaux.
 */
export default function ContinuousTabs({ tabs }) {
  const { pathname } = useLocation();

  const isActive = (tab) => (tab.end ? pathname === tab.to : pathname.startsWith(tab.to));

  return (
    <LayoutGroup>
      <nav className="relative flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1">
        {tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="relative rounded-full px-4 py-2 text-sm font-medium outline-none"
            >
              {active && (
                <motion.span
                  layoutId="nav-active-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.9 }}
                  className="absolute inset-0 rounded-full bg-brand-cyan"
                />
              )}
              <motion.span
                layout="position"
                className={`relative z-10 transition-colors duration-200 ${
                  active ? "text-[#04101f]" : "text-white/60 hover:text-white"
                }`}
              >
                {tab.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>
    </LayoutGroup>
  );
}
