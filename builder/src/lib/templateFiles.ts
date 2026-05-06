export const TEMPLATE_FILES = import.meta.glob(
  '../../template/src/**/*.{astro,ts,mjs,json}',
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

export const TEMPLATE_ROOT_FILES = import.meta.glob(
  '../../template/*.{mjs,json,md}',
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;
