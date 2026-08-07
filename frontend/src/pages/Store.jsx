import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../hooks/useFetch.js";
import { useLocale } from "../hooks/useLocale.js";
import { productsApi, ordersApi } from "../api/products.js";
import PageHero from "../components/layout/PageHero.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Reveal from "../components/ui/Reveal.jsx";

const initialForm = { nom: "", email: "", telephone: "", taille: "", quantite: 1 };

function OrderModal({ product, onClose }) {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await ordersApi.create({ ...form, produit: product._id, quantite: Number(form.quantite) });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-[#0c1524]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl">{loc(product, "nom")}</h2>
          <button onClick={onClose} className="text-[#657a90] dark:text-white/50">
            {t("common.close")}
          </button>
        </div>

        {status === "success" ? (
          <p className="text-brand-cyan">{t("store.orderSuccess")}</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input
              required
              placeholder={t("common.name")}
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            />
            <input
              required
              type="email"
              placeholder={t("common.email")}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            />
            <input
              required
              placeholder={t("common.phone")}
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            />
            {product.tailles?.length > 0 && (
              <select
                required
                value={form.taille}
                onChange={(e) => setForm({ ...form, taille: e.target.value })}
                className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
              >
                <option value="">{t("store.size")}</option>
                {product.tailles.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
            />
            {status === "error" && <p className="text-xs text-red-500">{errorMsg}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-2 rounded-full bg-brand-cyan px-6 py-3 text-sm font-semibold text-[#04101f] hover:bg-brand-amber disabled:opacity-50"
            >
              {t("store.orderCta")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Store() {
  const { t } = useTranslation();
  const { t: loc } = useLocale();
  const { data: products, loading } = useFetch(() => productsApi.list(), []);
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <PageHero eyebrow={t("store.title")} title={t("store.title")} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products
              ?.filter((p) => p.disponible)
              .map((p) => (
                <Reveal key={p._id}>
                  <div className="flex flex-col rounded-2xl border border-black/10 p-5 dark:border-white/10">
                    <div className="mb-4 aspect-square rounded-xl bg-black/5 dark:bg-white/5">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={loc(p, "nom")} className="h-full w-full rounded-xl object-cover" />
                      )}
                    </div>
                    <div className="font-serif text-lg">{loc(p, "nom")}</div>
                    <div className="mt-1 text-brand-cyan">{p.prix} MAD</div>
                    <button
                      onClick={() => setSelected(p)}
                      className="mt-4 rounded-full bg-brand-cyan px-4 py-2 text-sm font-semibold text-[#04101f] hover:bg-brand-amber"
                    >
                      {t("store.orderCta")}
                    </button>
                  </div>
                </Reveal>
              ))}
          </div>
        )}
      </section>

      {selected && <OrderModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
