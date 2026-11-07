import { InvalidCategoryError } from "../errors/category.errors";

export interface CategoryProps {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  description?: string;
  isFeatured?: boolean;
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
            iconName: props.iconName ?? "",
            description: props.description ?? "",
            isFeatured: props.isFeatured ?? false,
        });
    }

    static rehydrate(props: CategoryProps): Category {
        return new Category({ ...props });
    }

    static generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
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

    get iconName(): string {
        return this.props.iconName!;
    }

    get description(): string {
        return this.props.description!;
    }

    get isFeatured(): boolean {
        return this.props.isFeatured!;
    }

    changeName(name: string): void {
        if (!name || name.trim() === '') {
            throw new InvalidCategoryError('El nombre de la categoría no puede estar vacío.');
        }

        this.props.name = name;
        this.props.slug = Category.generateSlug(name);
    }

    changeIconName(iconName: string): void {
        this.props.iconName = iconName;
    }

    changeDescription(description: string): void {
        this.props.description = description;
    }

    changeIsFeatured(isFeatured: boolean): void {
        this.props.isFeatured = isFeatured;
    }
}