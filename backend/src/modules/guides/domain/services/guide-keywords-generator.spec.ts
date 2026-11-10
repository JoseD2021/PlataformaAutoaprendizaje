import { generateGuideKeywords } from './guide-keywords-generator';

describe('generateGuideKeywords', () => {
  it('expande sinónimos a partir del título y la categoría', () => {
    const words = generateGuideKeywords({
      title: 'Enviar archivos por correo'
    }).split(' ');

    expect(words).toEqual(expect.arrayContaining(['mandar', 'foto', 'imagen', 'email', 'gmail']));
  });

  it('conserva los keywords manuales y no repite palabras', () => {
    const words = generateGuideKeywords({
      title: 'Cómo imprimir un documento',
      manualKeywords: 'Hoja papel hoja',
    }).split(' ');

    expect(words).toContain('hoja');
    expect(words).toContain('papel');
    expect(words.filter((w) => w === 'hoja')).toHaveLength(1);
  });
});