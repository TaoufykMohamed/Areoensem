import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export default function App() {
  const [apiStatus, setApiStatus] = useState("en cours…");

  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => (res.ok ? setApiStatus("connectée") : setApiStatus("erreur")))
      .catch(() => setApiStatus("hors ligne"));
  }, []);

  return (
    <div className="min-h-screen bg-anthracite text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="font-mono text-xs tracking-instrument uppercase text-brand-cyan">
        ALT 10 400 M · HDG 042°
      </span>
      <h1 className="font-serif text-5xl">
        Club Aéro<span className="text-brand-cyan">ENSEM</span>
      </h1>
      <p className="text-white/70 max-w-md">
        Socle du monorepo en place — les pages publiques arrivent à l'étape 6.
      </p>
      <p className="font-mono text-xs uppercase tracking-instrument text-brand-amber">
        API : {apiStatus}
      </p>
    </div>
  );
}
