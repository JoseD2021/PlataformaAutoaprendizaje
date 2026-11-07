import { Category } from './category.entity';
import { InvalidCategoryError } from '../errors/category.errors';

const categoryProps = {
  id: 'category-1',
  name: 'Documentos',
  slug: 'slug-ignorado',
  iconName: 'book-open',
  description: 'Material de estudio',
  isFeatured: false,
};

describe('Category', () => {
  describe('create', () => {
    it('crea una categoría con un slug generado a partir del nombre', () => {
      const category = Category.create(categoryProps);

      expect(category.id).toBe('category-1');
      expect(category.name).toBe('Documentos');
      expect(category.slug).toBe('documentos');
      expect(category.iconName).toBe('book-open');
      expect(category.description).toBe('Material de estudio');
      expect(category.isFeatured).toBe(false);
    });

    it('aplica valores predeterminados para los datos opcionales', () => {
      const category = Category.create({
        ...categoryProps,
        iconName: undefined,
        description: undefined,
        isFeatured: undefined,
      });

      expect(category.iconName).toBe('');
      expect(category.description).toBe('');
      expect(category.isFeatured).toBe(false);
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
      expect(category.iconName).toBe(categoryProps.iconName);
      expect(category.description).toBe(categoryProps.description);
      expect(category.isFeatured).toBe(categoryProps.isFeatured);
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

  describe('changeIconName', () => {
    it('actualiza el nombre del ícono', () => {
      const category = Category.create(categoryProps);

      category.changeIconName('file-text');

      expect(category.iconName).toBe('file-text');
    });
  });

  describe('changeDescription', () => {
    it('actualiza la descripción', () => {
      const category = Category.create(categoryProps);

      category.changeDescription('Nueva descripción');

      expect(category.description).toBe('Nueva descripción');
    });
  });

  describe('changeIsFeatured', () => {
    it('actualiza el estado destacado', () => {
      const category = Category.create(categoryProps);

      category.changeIsFeatured(true);

      expect(category.isFeatured).toBe(true);
    });
  });
});
