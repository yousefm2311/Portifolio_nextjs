export const themes = [
  {
    id: 'neon',
    label: { en: 'Neon', ar: 'نيون' },
    swatch: 'linear-gradient(135deg, #2bc5ff, #5291ff)'
  },
  {
    id: 'ember',
    label: { en: 'Ember', ar: 'جمر' },
    swatch: 'linear-gradient(135deg, #ff9430, #ffd278)'
  },
  {
    id: 'verdant',
    label: { en: 'Verdant', ar: 'زمردي' },
    swatch: 'linear-gradient(135deg, #44dca0, #6effc8)'
  },
  {
    id: 'lumen',
    label: { en: 'Lumen', ar: 'فاتح' },
    swatch: 'linear-gradient(135deg, #e8f1ff, #cfe0ff)'
  }
] as const;

export type Theme = (typeof themes)[number]['id'];
