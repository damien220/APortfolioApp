import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePortfolioStore } from '../../state/store';
import { SiteSchema, type Site } from '../../state/schema';
import '../shared/DragHandle.css';

export default function SiteEditor() {
  const { site, updateSite } = usePortfolioStore();
  const { register, watch } = useForm<Site>({
    resolver: zodResolver(SiteSchema),
    defaultValues: site,
  });

  useEffect(() => {
    const sub = watch((values) => updateSite(values as Site));
    return () => sub.unsubscribe();
  }, [watch, updateSite]);

  return (
    <form>
      <p className="editor-hint">Global metadata used in page titles and SEO tags.</p>
      <div className="field-group">
        <label className="field-label" htmlFor="site-url">Site URL</label>
        <input
          id="site-url"
          type="url"
          className="field-input"
          {...register('url')}
        />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="site-title">Site Title</label>
        <input
          id="site-title"
          type="text"
          className="field-input"
          {...register('title')}
        />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="site-description">Description</label>
        <textarea
          id="site-description"
          className="field-input"
          rows={3}
          {...register('description')}
        />
      </div>
    </form>
  );
}
