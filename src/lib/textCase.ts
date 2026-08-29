/**
 * Text Casing Display Transformer
 * 
 * CRITICAL DATA-SAFETY RULE:
 * This transformer operates strictly at the presentation / display layer.
 * Stored database/CMS strings are never mutated or rewritten.
 */

// Preserved brand names, short codes, acronyms & special words
const PRESERVED_WORDS = new Set([
  "AAREN",
  "INTPRO",
  "FIMA",
  "IWW",
  "WOW",
  "JB",
  "WPC",
  "CAD",
  "PDF",
  "3D",
  "FF&E",
  "K+W",
  "D+W",
  "USA",
  "LED",
  "CCTV",
  "CNC",
  "HVAC",
  "B2B",
  "B2C",
]);

// Minor words that stay lowercase in Title Case unless they are the first word
const MINOR_WORDS = new Set([
  "and",
  "or",
  "nor",
  "but",
  "a",
  "an",
  "the",
  "as",
  "at",
  "by",
  "for",
  "in",
  "of",
  "on",
  "per",
  "to",
  "via",
  "with",
]);

/**
 * Converts a string to Title Case (Proper Case for headings/card titles),
 * e.g. "Bathroom Fittings", "Waltz by JB Glass", "Decking, Cladding & Facade Screens"
 */
export function toProperTitleCase(input: string): string {
  if (!input || typeof input !== "string") return input || "";

  // Split by whitespace while preserving punctuation
  const tokens = input.split(/(\s+)/);
  let contentWordCount = 0;

  return tokens
    .map((token) => {
      // If it's just whitespace or separators, leave as is
      if (/^\s+$/.test(token) || token === "·" || token === "&" || token === "+" || token === "/") {
        return token;
      }

      // Check if token contains alphanumeric characters
      const cleanWord = token.replace(/^[^\w]+|[^\w]+$/g, "");
      if (!cleanWord) {
        return token;
      }

      const isFirstContentWord = (contentWordCount === 0);
      contentWordCount++;

      const cleanUpper = cleanWord.toUpperCase();

      if (PRESERVED_WORDS.has(cleanUpper)) {
        return token.replace(cleanWord, cleanUpper);
      }

      // Check if it's a short category code like "BF", "LM", "WRD", "01", "13"
      if (/^[A-Z]{2,4}$/.test(cleanWord) && cleanWord.length <= 4 && token === token.toUpperCase()) {
        return token;
      }

      const cleanLower = cleanWord.toLowerCase();

      // Minor words check (stay lowercase unless it is the first content word)
      if (!isFirstContentWord && MINOR_WORDS.has(cleanLower)) {
        return token.replace(cleanWord, cleanLower);
      }

      // Capitalize first letter, lowercase the rest
      const capitalized =
        cleanLower.charAt(0).toUpperCase() + cleanLower.slice(1);

      return token.replace(cleanWord, capitalized);
    })
    .join("");
}

/**
 * Converts a string to Sentence Case (Proper Case for subtitles & descriptions),
 * e.g. "Falper and FIMA tapware and vanities", "Keep up with the latest for all things AAREN."
 */
export function toProperSentenceCase(input: string): string {
  if (!input || typeof input !== "string") return input || "";

  // Split into sentences (by period, exclamation, question mark)
  return input
    .split(/([.!?]\s+)/)
    .map((part) => {
      if (/^[.!?]\s+$/.test(part)) return part;

      const tokens = part.split(/(\s+)/);
      let isFirstContentWord = true;

      return tokens
        .map((token) => {
          if (/^\s+$/.test(token) || token === "·" || token === "&" || token === "+" || token === "/") {
            return token;
          }

          const cleanWord = token.replace(/^[^\w]+|[^\w]+$/g, "");
          if (!cleanWord) {
            return token;
          }

          const isCurrentFirst = isFirstContentWord;
          isFirstContentWord = false;

          const cleanUpper = cleanWord.toUpperCase();

          // Preserve specific brand acronyms (AAREN, FIMA, IWW, etc.)
          if (PRESERVED_WORDS.has(cleanUpper)) {
            return token.replace(cleanWord, cleanUpper);
          }

          // Preserve short codes like "BF 13"
          if (/^[A-Z]{2,4}$/.test(cleanWord) && cleanWord.length <= 4 && token === token.toUpperCase()) {
            return token;
          }

          const cleanLower = cleanWord.toLowerCase();

          if (isCurrentFirst) {
            const capitalized = cleanLower.charAt(0).toUpperCase() + cleanLower.slice(1);
            return token.replace(cleanWord, capitalized);
          }

          // For brand names inside subtitles (like "Falper", "FIMA", "Waltz", "Slashform")
          if (["falper", "fima", "waltz", "slashform", "newtechwood", "inkiostro", "bianco", "mafi", "mirage", "freedom", "peelply", "inclass", "loco", "formica"].includes(cleanLower)) {
            const capBrand = cleanLower.charAt(0).toUpperCase() + cleanLower.slice(1);
            return token.replace(cleanWord, capBrand);
          }

          return token.replace(cleanWord, cleanLower);
        })
        .join("");
    })
    .join("");
}

/**
 * Apply text casing according to the site's active display setting
 */
export function applyTextCase(
  text: string,
  mode: "proper" | "uppercase" | "lowercase" = "proper",
  type: "title" | "sentence" | "raw" = "title"
): string {
  if (!text || typeof text !== "string") return text || "";

  if (mode === "uppercase") {
    return text.toUpperCase();
  }

  if (mode === "lowercase") {
    return text.toLowerCase();
  }

  // mode === "proper" (Default)
  if (type === "title") {
    return toProperTitleCase(text);
  }

  if (type === "sentence") {
    return toProperSentenceCase(text);
  }

  return text;
}
