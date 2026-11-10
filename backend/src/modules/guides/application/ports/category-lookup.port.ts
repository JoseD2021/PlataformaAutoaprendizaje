export abstract class CategoryLookup {
  abstract findIdBySlug(slug: string): Promise<string | null>;
  abstract existsById(id: string): Promise<boolean>;
}

export const CATEGORY_LOOKUP = Symbol('CATEGORY_LOOKUP');