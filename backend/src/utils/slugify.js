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
