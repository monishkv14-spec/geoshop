/**
 * Search Quality & Ranking Engine for GeoShop
 * Tokenization, Typo Tolerance, Synonym Expansion, and Scoring
 */

export const SYNONYMS_MAP: Record<string, string[]> = {
  phone: ['mobile', 'smartphone', 'cell phone'],
  mobile: ['phone', 'smartphone', 'cell phone'],
  smartphone: ['phone', 'mobile'],
  iphone: ['apple phone', 'ios phone', 'mobile'],
  laptop: ['notebook', 'macbook', 'ultrabook', 'computer'],
  notebook: ['laptop', 'macbook', 'computer', 'ruled notebook', 'journal'],
  charger: ['adapter', 'fast charger', 'power adapter', 'wall charger'],
  adapter: ['charger', 'converter', 'hub', 'power adapter'],
  cable: ['wire', 'cord', 'lead'],
  wire: ['cable', 'cord'],
  cord: ['cable', 'wire'],
  earbuds: ['earphones', 'headphones', 'airpods', 'tws', 'in-ear'],
  earphones: ['earbuds', 'headphones', 'tws', 'in-ear'],
  headphones: ['headset', 'earphones', 'over-ear'],
  headset: ['headphones', 'gaming headset', 'mic'],
  bottle: ['flask', 'water bottle', 'tumbler', 'thermos'],
  flask: ['bottle', 'water bottle', 'thermos', 'vacuum flask'],
  'water bottle': ['bottle', 'flask', 'tumbler', 'thermos'],
  'pen drive': ['pendrive', 'usb flash drive', 'flash drive', 'thumb drive', 'usb drive'],
  pendrive: ['pen drive', 'usb flash drive', 'flash drive', 'thumb drive'],
  'usb drive': ['pen drive', 'flash drive', 'thumb drive'],
  bag: ['backpack', 'rucksack', 'laptop bag', 'daypack'],
  backpack: ['bag', 'rucksack', 'laptop bag', 'daypack'],
  shoes: ['running shoes', 'sneakers', 'trainers', 'footwear'],
  sneakers: ['running shoes', 'shoes', 'trainers'],
  'running shoes': ['shoes', 'sneakers', 'trainers', 'jogging shoes'],
  case: ['phone case', 'cover', 'protective case', 'sleeve'],
  cover: ['case', 'phone case', 'screen protector'],
  watch: ['smartwatch', 'smart watch', 'fitness band'],
  smartwatch: ['watch', 'smart watch', 'fitness tracker'],
  screen: ['display', 'monitor', 'screen protector'],
  display: ['screen', 'monitor'],
  monitor: ['screen', 'display', 'computer screen'],
  pc: ['desktop', 'computer', 'gaming pc'],
  desktop: ['pc', 'computer', 'tower'],
  mouse: ['optical mouse', 'wireless mouse', 'gaming mouse'],
  keyboard: ['mechanical keyboard', 'wireless keyboard', 'keypad'],
  powerbank: ['power bank', 'portable charger', 'battery pack'],
  'power bank': ['powerbank', 'portable charger', 'external battery'],
};

// Known common typos & normalization mappings
export const TYPO_DICT: Record<string, string> = {
  iphone17: 'iphone 17',
  iphone18: 'iphone 18',
  iphone16: 'iphone 16',
  samsng: 'samsung',
  waterbottle: 'water bottle',
  pendrive: 'pen drive',
  earfones: 'earphones',
  hedphones: 'headphones',
  airfryer: 'air fryer',
  powerbank: 'power bank',
  macbookair: 'macbook air',
  macbookpro: 'macbook pro',
  airpods: 'airpods',
  screenguard: 'screen protector',
  temperedglass: 'screen protector',
  typec: 'type c',
  usbc: 'usb c',
  chager: 'charger',
  cabel: 'cable',
  lapot: 'laptop',
  mous: 'mouse',
  keybord: 'keyboard',
  calcultor: 'calculator',
};

/** Normalize string: lowercase, replace punctuation with spaces, trim multiple spaces */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()"+?[\]\\<>@]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Levenshtein distance between two strings */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
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
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/** Check if two tokens are fuzzy matches (allowing 1-2 edits depending on length) */
export function isFuzzyMatch(tokenA: string, tokenB: string): boolean {
  if (tokenA === tokenB) return true;
  if (tokenA.length <= 3 || tokenB.length <= 3) return false;
  const maxDistance = Math.min(tokenA.length, tokenB.length) >= 6 ? 2 : 1;
  return levenshteinDistance(tokenA, tokenB) <= maxDistance;
}

/**
 * Expand query into normalized tokens, typo-corrected tokens, and synonym tokens.
 */
export function expandQuery(query: string): {
  originalQuery: string;
  normalizedQuery: string;
  tokens: string[];
  expandedTerms: string[];
} {
  const normalized = normalizeText(query);
  let correctedQuery = normalized;

  // 1. Direct typo dictionary check
  for (const [typo, replacement] of Object.entries(TYPO_DICT)) {
    if (correctedQuery.includes(typo)) {
      correctedQuery = correctedQuery.replace(new RegExp(`\\b${typo}\\b|${typo}`, 'g'), replacement);
    }
  }

  // 2. Tokenize
  const rawTokens = correctedQuery.split(' ').filter(Boolean);
  const tokenSet = new Set<string>(rawTokens);
  const expandedSet = new Set<string>([correctedQuery, normalized]);

  // 3. Synonym expansion
  for (const [key, synList] of Object.entries(SYNONYMS_MAP)) {
    const keyTokens = key.split(' ');
    // Check if query contains full phrase key or single token key
    const phraseMatch = correctedQuery.includes(key);
    const tokenMatch = keyTokens.length === 1 && tokenSet.has(key);

    if (phraseMatch || tokenMatch) {
      for (const syn of synList) {
        expandedSet.add(syn);
        syn.split(' ').forEach((t) => tokenSet.add(t));
      }
    }
  }

  return {
    originalQuery: query,
    normalizedQuery: correctedQuery,
    tokens: Array.from(tokenSet),
    expandedTerms: Array.from(expandedSet),
  };
}

/**
 * Calculate relevance score of a product against query tokens and synonyms
 */
export function scoreProductMatch(
  product: {
    name: string;
    brand: string;
    category: string;
    subcategory?: string | null;
    tags?: string | null;
    aliases?: string | null;
    description: string;
  },
  expanded: {
    normalizedQuery: string;
    tokens: string[];
    expandedTerms: string[];
  }
): number {
  const normName = normalizeText(product.name);
  const normBrand = normalizeText(product.brand);
  const normCategory = normalizeText(product.category);
  const normSubcat = normalizeText(product.subcategory || '');
  const normTags = normalizeText(product.tags || '');
  const normAliases = normalizeText(product.aliases || '');
  const normDesc = normalizeText(product.description || '');

  let score = 0;
  const q = expanded.normalizedQuery;

  // 1. Exact full query phrase match
  if (normName === q) {
    score += 150;
  } else if (normName.startsWith(q)) {
    score += 100;
  } else if (normName.includes(q)) {
    score += 80;
  }

  // 2. Exact match in brand
  if (normBrand === q || normBrand.includes(q)) {
    score += 60;
  }

  // 3. Exact match in category or subcategory
  if (normCategory === q || normSubcat === q) {
    score += 50;
  } else if (normCategory.includes(q) || normSubcat.includes(q)) {
    score += 35;
  }

  // 4. Match in tags and aliases
  if (normTags.includes(q) || normAliases.includes(q)) {
    score += 45;
  }

  // 5. Token-level matching
  let matchedTokens = 0;
  for (const token of expanded.tokens) {
    let tokenMatched = false;

    if (normName.includes(token)) {
      score += 25;
      tokenMatched = true;
    } else if (normBrand.includes(token)) {
      score += 20;
      tokenMatched = true;
    } else if (normTags.includes(token) || normAliases.includes(token)) {
      score += 15;
      tokenMatched = true;
    } else if (normSubcat.includes(token) || normCategory.includes(token)) {
      score += 10;
      tokenMatched = true;
    } else if (normDesc.includes(token)) {
      score += 5;
      tokenMatched = true;
    } else {
      // Fuzzy token check against words in product name
      const nameWords = normName.split(' ');
      for (const w of nameWords) {
        if (isFuzzyMatch(token, w)) {
          score += 12;
          tokenMatched = true;
          break;
        }
      }
    }

    if (tokenMatched) matchedTokens++;
  }

  // Token coverage boost: if all tokens matched, add heavy bonus
  if (expanded.tokens.length > 0 && matchedTokens === expanded.tokens.length) {
    score += 40;
  }

  // 6. Expanded synonym terms
  for (const syn of expanded.expandedTerms) {
    if (syn !== q && normName.includes(syn)) {
      score += 20;
    }
  }

  return score;
}
