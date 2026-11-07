export abstract class CategoryLookup {
  abstract findIdBySlug(slug: string): Promise<string | null>;
}

export const CATEGORY_LOOKUP = Symbol('CATEGORY_LOOKUP');