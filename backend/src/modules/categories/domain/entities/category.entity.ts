import { InvalidCategoryError } from "../errors/category.errors";

export interface CategoryProps {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export class Category {
    private constructor(private props: CategoryProps) {}

    static create(props: CategoryProps): Category {
        if (!props.id) {
            throw new InvalidCategoryError('El ID de la categoría es obligatorio.');
        }

        if (!props.name || props.name.trim() === '') {
            throw new InvalidCategoryError('El nombre de la categoría no puede estar vacío.');
        }

        const slug = Category.generateSlug(props.name);

        return new Category({
            id: props.id,
            name: props.name,
            slug,
            iconUrl: props.iconUrl ?? "",
            displayOrder: props.displayOrder ?? 0,
            isActive: props.isActive ?? true,
        });
    }

    static rehydrate(props: CategoryProps): Category {
        return new Category({ ...props });
    }

    private static generateSlug(name: string): string {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }

    get id(): string {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get slug(): string {
        return this.props.slug;
    }

    get iconUrl(): string {
        return this.props.iconUrl!;
    }

    get displayOrder(): number {
        return this.props.displayOrder!;
    }

    get isActive(): boolean {
        return this.props.isActive!;
    }

    changeName(name: string): void {
        if (!name || name.trim() === '') {
            throw new InvalidCategoryError('El nombre de la categoría no puede estar vacío.');
        }

        this.props.name = name;
        this.props.slug = Category.generateSlug(name);
    }

    changeIconUrl(iconUrl: string): void {
        this.props.iconUrl = iconUrl;
    }

    changeDisplayOrder(displayOrder: number): void {
        if (displayOrder < 0) {
            throw new InvalidCategoryError('El orden de visualización no puede ser negativo.');
        }

        this.props.displayOrder = displayOrder;
    }

    changeIsActive(isActive: boolean): void {
        this.props.isActive = isActive;
    }
}