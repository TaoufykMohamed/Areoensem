export function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accents décomposés par normalize("NFD")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Trouve un slug disponible pour `Model` en partant de `baseSlug`, en
 * ajoutant "-2", "-3", ... en cas de collision. `baseSlug` peut déjà
 * contenir un suffixe (ex. l'année pour un événement) : la fonction ne
 * fait que résoudre les collisions résiduelles.
 */
export async function ensureUniqueSlug(Model, baseSlug, { excludeId } = {}) {
  let candidate = baseSlug;
  let counter = 2;

  // eslint-disable-next-line no-await-in-loop
  while (await Model.exists({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
}
