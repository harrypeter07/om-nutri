import type { Product } from "./catalog-types";

// Synonym & Common Typo Mapping for Supplement Industry
const TYPO_MAP: Record<string, string> = {
  protin: "protein",
  proten: "protein",
  protean: "protein",
  whey: "protein",
  way: "protein",
  creatin: "creatine",
  creatinne: "creatine",
  createn: "creatine",
  giner: "gainer",
  gainner: "gainer",
  geiner: "gainer",
  preworkout: "pre workout",
  preworkut: "pre workout",
  pre: "pre workout",
  pump: "pre workout",
  c4: "pre workout",
  fatburner: "fat burner",
  burner: "fat burner",
  shred: "fat burner",
  shredder: "fat burner",
  multivitamin: "vitamins",
  vitamin: "vitamins",
  vitamns: "vitamins",
  fishoil: "fish oil",
  omega: "fish oil",
  omega3: "fish oil",
  nitrotech: "nitro tech",
  nitro: "nitro tech",
  optimum: "on",
  muscleblaze: "mb",
  muscletech: "mt",
  bigmuscles: "bm",
};

/**
 * Calculates Levenshtein Distance for fuzzy string matching.
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Normalizes input text into cleaned tokens with typo correction.
 */
function tokenizeAndCorrect(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words.map((word) => TYPO_MAP[word] || word);
}

/**
 * Smart natural language fuzzy search function.
 * Evaluates titles, categories, brands, benefits, and ingredients with typo tolerance.
 */
export function smartSearchProducts(products: Product[], query: string): Product[] {
  const trimmed = query.trim();
  if (!trimmed) return products;

  const queryTokens = tokenizeAndCorrect(trimmed);
  const normalizedQuery = queryTokens.join(" ");

  const scored = products.map((product) => {
    let score = 0;

    const nameLower = product.name.toLowerCase();
    const catNameLower = (product.category?.name || "").toLowerCase();
    const catSlugLower = (product.category?.slug || "").toLowerCase();
    const brandLower = ((product as any).brand || "").toLowerCase();
    const descLower = (product.description || "").toLowerCase();
    const benefitsLower = (product.benefits || []).join(" ").toLowerCase();
    const ingredientsLower = (product.ingredients || "").toLowerCase();

    const fullProductText = `${nameLower} ${catNameLower} ${catSlugLower} ${brandLower} ${descLower} ${benefitsLower} ${ingredientsLower}`;

    // 1. Direct Substring Match in Name or Category (High Score)
    if (nameLower.includes(normalizedQuery)) score += 100;
    if (catNameLower.includes(normalizedQuery) || catSlugLower.includes(normalizedQuery)) score += 80;
    if (brandLower.includes(normalizedQuery)) score += 75;

    // 2. Token Matching
    for (const token of queryTokens) {
      if (token.length < 2) continue;

      if (nameLower.includes(token)) score += 35;
      if (catNameLower.includes(token) || catSlugLower.includes(token)) score += 30;
      if (brandLower.includes(token)) score += 25;
      if (benefitsLower.includes(token)) score += 15;
      if (descLower.includes(token)) score += 10;
      if (ingredientsLower.includes(token)) score += 10;

      // 3. Fuzzy Levenshtein Distance for spell check tolerance (1-2 typo errors)
      const productWords = fullProductText.split(/\s+/);
      for (const pWord of productWords) {
        if (pWord.length >= 3 && Math.abs(pWord.length - token.length) <= 2) {
          const dist = levenshteinDistance(token, pWord);
          if (dist === 1) score += 20; // 1 char typo
          else if (dist === 2 && token.length >= 5) score += 10; // 2 char typo on longer words
        }
      }
    }

    return { product, score };
  });

  // Filter products with a positive match score and sort descending
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);
}
