import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { PortfolioState } from '../state/schema';
import { generateSitePages, generateStaticCss, FAVICON_SVG } from './htmlGenerator';
import { exportStateJson } from '../state/persist';

interface ImageFile {
  path: string;
  base64: string;
}

function extractDataUrl(dataUrl: string, filename: string): { zipPath: string; htmlPath: string; base64: string } | null {
  const match = dataUrl.match(/^data:image\/([^;]+);base64,(.+)$/);
  if (!match) return null;
  const [, rawExt, base64] = match;
  const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
  return {
    zipPath: `assets/images/${filename}.${ext}`,
    htmlPath: `/assets/images/${filename}.${ext}`,
    base64,
  };
}

function collectImages(state: PortfolioState): { remapped: PortfolioState; imageFiles: ImageFile[] } {
  const imageFiles: ImageFile[] = [];

  function remap(dataUrl: string | undefined, filename: string): string | undefined {
    if (!dataUrl?.startsWith('data:image/')) return dataUrl;
    const extracted = extractDataUrl(dataUrl, filename);
    if (!extracted) return dataUrl;
    imageFiles.push({ path: extracted.zipPath, base64: extracted.base64 });
    return extracted.htmlPath;
  }

  const remapped: PortfolioState = {
    ...state,
    hero: {
      ...state.hero,
      portrait: remap(state.hero.portrait, 'portrait') ?? '',
    },
    projects: state.projects.map((p) => ({
      ...p,
      image: remap(p.image, `project-${p.id}`),
    })),
  };

  return { remapped, imageFiles };
}

export async function exportPortfolio(state: PortfolioState): Promise<void> {
  const zip = new JSZip();

  const { remapped, imageFiles } = collectImages(state);

  const pages = generateSitePages(remapped);
  for (const [path, html] of Object.entries(pages)) {
    zip.file(path, html);
  }

  zip.file('assets/style.css', generateStaticCss(remapped));
  zip.file('favicon.svg', FAVICON_SVG);

  for (const { path, base64 } of imageFiles) {
    zip.file(path, base64, { base64: true });
  }

  // Keep original data URLs in the JSON so re-importing restores images
  zip.file('portfolio-data.json', exportStateJson(state));

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'portfolio-site.zip');
}
