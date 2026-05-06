import { useState } from 'react';
import './ImagesEditor.css';

interface ImageEntry {
  url: string;
  name: string;
}

export default function ImagesEditor() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, { url: reader.result as string, name: f.name }]);
      };
      reader.readAsDataURL(f);
    });
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="images-editor">
      <p className="images-hint">
        Upload images to get a URL you can paste into project card image fields.
        Click a thumbnail to copy its URL.
      </p>
      <label className="images-dropzone">
        <input type="file" multiple accept="image/*" onChange={handleFiles} className="images-file-input" />
        <span>Click or drag images here</span>
      </label>
      {images.length > 0 && (
        <div className="images-grid">
          {images.map((img) => (
            <button
              key={img.url}
              type="button"
              className={`image-thumb${copied === img.url ? ' image-thumb--copied' : ''}`}
              onClick={() => copyUrl(img.url)}
              title={copied === img.url ? 'Copied!' : `Click to copy URL — ${img.name}`}
              aria-label={`Copy URL for ${img.name}`}
            >
              <img src={img.url} alt={img.name} />
              {copied === img.url && <span className="thumb-copied-badge">Copied!</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
