import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Zone de dépôt de fichier (clic ou glisser-déposer), dans l'esprit du
 * composant "File Upload" d'Aceternity — réimplémenté ici en React/Tailwind
 * simple (pas de dépendance ajoutée, voir la mésaventure shadcn/Tailwind v4
 * plus haut dans ce projet). N'appelle aucune API elle-même : elle reporte
 * juste le fichier choisi via `onFileSelect`, l'appelant gère l'upload.
 */
export default function FileUpload({
  onFileSelect,
  accept = "image/*",
  hint = "PNG ou JPG",
  disabled = false,
  existingUrl = "",
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null); // { name, size, url }
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (!file) return;
      setRemoved(false);
      setPreview((prev) => {
        if (prev?.url) URL.revokeObjectURL(prev.url);
        return { name: file.name, size: file.size, type: file.type, url: URL.createObjectURL(file) };
      });
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const clear = (e) => {
    e.stopPropagation();
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setRemoved(true);
    onFileSelect(null);
  };

  // Priorité au fichier fraîchement choisi ; sinon la photo déjà en base
  // (édition d'un élément existant), tant qu'elle n'a pas été retirée.
  const displayUrl = preview?.url || (!removed && existingUrl) || "";
  // Un PDF (ou tout non-image/non-vidéo) n'a pas de miniature affichable
  // dans un <img> : on sniffe le type via le fichier choisi, ou le préfixe
  // du data URI existant.
  const isImage = preview ? preview.type?.startsWith("image/") : displayUrl.startsWith("data:image");
  const isVideo = preview ? preview.type?.startsWith("video/") : displayUrl.startsWith("data:video");

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`file-upload relative overflow-hidden rounded-xl border border-dashed p-6 transition-colors ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${dragActive ? "border-brand-cyan bg-brand-cyan/5" : "border-white/15 hover:border-white/30"}`}
    >
      <div className="file-upload__grid" aria-hidden="true" />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <AnimatePresence mode="wait">
        {displayUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="relative z-10 flex items-center gap-4"
          >
            {isImage ? (
              <img
                src={displayUrl}
                alt=""
                className="h-16 w-16 rounded-lg border border-white/15 bg-white object-contain p-1"
              />
            ) : isVideo ? (
              <video
                src={displayUrl}
                muted
                loop
                autoPlay
                playsInline
                className="h-16 w-16 rounded-lg border border-white/15 bg-black object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/50">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white/90">
                {preview ? preview.name : isImage ? "Photo actuelle" : isVideo ? "Vidéo actuelle" : "Document actuel"}
              </p>
              {preview && <p className="text-xs text-white/40">{(preview.size / 1024).toFixed(0)} Ko</p>}
            </div>
            <button
              type="button"
              onClick={clear}
              className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 hover:border-red-400 hover:text-red-300"
            >
              Retirer
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center gap-2 text-center"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
              <path d="M12 16V4M12 4L7 9M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-white/70">Cliquez pour importer ou glissez-déposez</p>
            <p className="text-xs text-white/35">{hint}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
