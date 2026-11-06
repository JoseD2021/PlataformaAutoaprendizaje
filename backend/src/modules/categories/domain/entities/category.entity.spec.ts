import { Category } from './category.entity';
import { InvalidCategoryError } from '../errors/category.errors';

const categoryProps = {
  id: 'category-1',
  name: 'Documentos',
  slug: 'slug-ignorado',
  iconUrl: 'https://example.com/icons/docs.svg',
  displayOrder: 2,
  isActive: false,
};

describe('Category', () => {
  describe('create', () => {
    it('crea una categoría con un slug generado a partir del nombre', () => {
      const category = Category.create(categoryProps);

      expect(category.id).toBe('category-1');
      expect(category.name).toBe('Documentos');
      expect(category.slug).toBe('documentos');
      expect(category.iconUrl).toBe('https://example.com/icons/docs.svg');
      expect(category.displayOrder).toBe(2);
      expect(category.isActive).toBe(false);
    });

    it('aplica valores predeterminados para los datos opcionales', () => {
      const category = Category.create({
        ...categoryProps,
        iconUrl: undefined,
        displayOrder: undefined,
        isActive: undefined,
      });

      expect(category.iconUrl).toBe('');
      expect(category.displayOrder).toBe(0);
      expect(category.isActive).toBe(true);
    });

    it('rechaza una categoría sin ID', () => {
      expect(() => Category.create({ ...categoryProps, id: '' })).toThrow(
        InvalidCategoryError,
      );
    });
  });

  describe('rehydrate', () => {
    it('restaura todas las propiedades persistidas', () => {
      const category = Category.rehydrate(categoryProps);

      expect(category.id).toBe(categoryProps.id);
      expect(category.name).toBe(categoryProps.name);
      expect(category.slug).toBe(categoryProps.slug);
      expect(category.iconUrl).toBe(categoryProps.iconUrl);
      expect(category.displayOrder).toBe(categoryProps.displayOrder);
      expect(category.isActive).toBe(categoryProps.isActive);
    });
  });

  describe('changeName', () => {
    it('actualiza el nombre y regenera el slug', () => {
      const category = Category.create(categoryProps);

      category.changeName('Arte y Música');

      expect(category.name).toBe('Arte y Música');
      expect(category.slug).toBe('arte-y-msica');
    });

    it('rechaza un nombre vacío', () => {
      const category = Category.create(categoryProps);

      expect(() => category.changeName('   ')).toThrow(InvalidCategoryError);
    });
  });

  describe('changeIconUrl', () => {
    it('actualiza la URL del ícono', () => {
      const category = Category.create(categoryProps);

      category.changeIconUrl('https://example.com/new-icon.svg');

      expect(category.iconUrl).toBe('https://example.com/new-icon.svg');
    });
  });

  describe('changeDisplayOrder', () => {
    it('actualiza el orden de visualización', () => {
      const category = Category.create(categoryProps);

      category.changeDisplayOrder(5);

      expect(category.displayOrder).toBe(5);
    });

    it('rechaza un orden negativo', () => {
      const category = Category.create(categoryProps);

      expect(() => category.changeDisplayOrder(-1)).toThrow(
        InvalidCategoryError,
      );
    });
  });

  describe('changeIsActive', () => {
    it('actualiza el estado activo', () => {
      const category = Category.create(categoryProps);

      category.changeIsActive(true);

      expect(category.isActive).toBe(true);
    });
  });
});
