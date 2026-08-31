import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useFetch } from "../hooks/useFetch.js";
import { useLocale } from "../hooks/useLocale.js";
import { productsApi, ordersApi } from "../api/products.js";
import PageHero from "../components/layout/PageHero.jsx";
import Spinner from "../components/ui/Spinner.jsx";

const initialOrderForm = { nom: "", prenom: "", email: "", telephone: "", adresse: "", taille: "", quantite: 1 };
const orderInputClass =
  "rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-cyan focus:outline-none";

/**
 * Carte produit — même traitement visuel que les cellules (ExpandableCells) :
 * hover-dim des cartes voisines via `group`, coins arrondis, ombre, morph
 * partagé (layoutId) vers la modale au clic. Seule différence de contenu :
 * un <video> en autoplay/loop/muted à la place du fond image, pour un
 * aperçu dynamique du produit (rendu 3D, démo...).
 */
function ProductCard({ product, title, onOpen }) {
  return (
    <motion.div
      layoutId={`product-card-${product._id}`}
      role="listitem"
      tabIndex={0}
      aria-label={title}
      onClick={() => onOpen(product._id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(product._id);
        }
      }}
      className="relative block h-80 cursor-pointer overflow-hidden rounded-xl bg-cover bg-center shadow-lg outline-none transition-all duration-500 ease-in-out group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px] hover:!scale-105 hover:!opacity-100 hover:!blur-none focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none focus-visible:!ring-2 focus-visible:!ring-brand-cyan"
    >
      {product.video ? (
        <video
          src={product.video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b2545] to-[#04101f]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <p className="text-sm font-light uppercase tracking-widest opacity-80">{product.prix} MAD</p>
        <h3 className="mt-1 text-2xl font-semibold">{title}</h3>
      </div>
    </motion.div>
  );
}

function OrderForm({ product, t }) {
  const [form, setForm] = useState(initialOrderForm);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await ordersApi.create({ ...form, produit: product._id, quantite: Number(form.quantite) });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  if (status === "success") {
    return <p className="text-center text-sm text-brand-cyan">{t("store.orderSuccess")}</p>;
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <input
        required
        placeholder={t("common.name")}
        value={form.nom}
        onChange={(e) => setForm({ ...form, nom: e.target.value })}
        className={orderInputClass}
      />
      <input
        required
        placeholder={t("store.firstName")}
        value={form.prenom}
        onChange={(e) => setForm({ ...form, prenom: e.target.value })}
        className={orderInputClass}
      />
      <input
        required
        type="email"
        placeholder={t("common.email")}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={orderInputClass}
      />
      <input
        required
        placeholder={t("common.phone")}
        value={form.telephone}
        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
        className={orderInputClass}
      />
      <input
        placeholder={t("store.address")}
        value={form.adresse}
        onChange={(e) => setForm({ ...form, adresse: e.target.value })}
        className={`${orderInputClass} sm:col-span-2`}
      />
      {product.tailles?.length > 0 && (
        <select
          required
          value={form.taille}
          onChange={(e) => setForm({ ...form, taille: e.target.value })}
          className={orderInputClass}
        >
          <option value="">{t("store.size")}</option>
          {product.tailles.map((taille) => (
            <option key={taille} value={taille}>
              {taille}
            </option>
          ))}
        </select>
      )}
      <input
        required
        type="number"
        min={1}
        placeholder={t("store.quantity")}
        value={form.quantite}
        onChange={(e) => setForm({ ...form, quantite: e.target.value })}
        className={orderInputClass}
      />
      {status === "error" && <p className="text-xs text-red-400 sm:col-span-2">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-[#04101f] hover:bg-white disabled:opacity-50 sm:col-span-2"
      >
        {t("store.orderCta")}
      </button>
    </form>
  );
}

/**
 * Modale produit — même charpente que la modale cellule/événement (fond
 * sombre fixe, layoutId, deux colonnes desktop / une colonne mobile via
 * md:grid-cols-[340px_1fr]). La vidéo continue de jouer identiquement à
 * gauche ; la colonne droite bascule entre infos et formulaire de commande
 * au clic sur "Commander", sans fermer la modale.
 */
function ProductModal({ product, title, onClose }) {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`product-card-${product._id}`}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#04101f] text-white"
      >
        <button
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="grid gap-8 p-6 md:grid-cols-[340px_1fr] md:p-10">
          {/* Colonne gauche : vidéo en lecture continue */}
          <div className="overflow-hidden rounded-xl">
            {product.video ? (
              <video
                src={product.video}
                autoPlay
                loop
                muted
                playsInline
                className="aspect-[3/4] w-full object-cover"
              />
            ) : (
              <div className="aspect-[3/4] w-full bg-gradient-to-br from-[#0b2545] to-[#04101f]" />
            )}
          </div>

          {/* Colonne droite : infos, puis formulaire de commande au clic */}
          <div>
            {ordering ? (
              <>
                <button
                  onClick={() => setOrdering(false)}
                  className="mb-4 text-sm text-white/50 hover:text-brand-cyan"
                >
                  ← {t("common.back")}
                </button>
                <h2 className="mb-4 font-serif text-2xl md:text-3xl">{title}</h2>
                <OrderForm product={product} t={t} />
              </>
            ) : (
              <>
                <span className="inline-block rounded-full border border-brand-cyan/30 px-3 py-1 font-mono text-[10px] uppercase tracking-instrument text-brand-cyan">
                  {t("store.category")}
                </span>
                <h2 className="mt-3 font-serif text-3xl md:text-4xl">{title}</h2>
                <p className="mt-2 text-xl text-brand-cyan">{product.prix} MAD</p>
                {loc(product, "description") && (
                  <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-white/70">
                    {loc(product, "description")}
                  </p>
                )}
                <button
                  onClick={() => setOrdering(true)}
                  className="mt-8 rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-[#04101f] hover:bg-white"
                >
                  {t("store.orderCta")}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Store() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: products, loading } = useFetch(() => productsApi.list(), []);
  const [selectedId, setSelectedId] = useState(null);

  const available = products?.filter((p) => p.disponible) || [];
  const selected = available.find((p) => p._id === selectedId);

  return (
    <div>
      <PageHero eyebrow={t("store.title")} title={t("store.title")} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {loading ? (
          <Spinner />
        ) : (
          <div role="list" className="group grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {available.map((p) => (
              <ProductCard key={p._id} product={p} title={loc(p, "nom")} onOpen={setSelectedId} />
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selected && (
          <ProductModal product={selected} title={loc(selected, "nom")} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
