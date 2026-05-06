import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePortfolioStore } from '../../state/store';
import { HeroSchema, type Hero } from '../../state/schema';
import '../shared/DragHandle.css';
import './HeroEditor.css';

export default function HeroEditor() {
  const { hero, updateHero } = usePortfolioStore();
  const { register, watch } = useForm<Hero>({
    resolver: zodResolver(HeroSchema),
    defaultValues: hero,
  });

  useEffect(() => {
    const sub = watch((values) => {
      const { portrait: _skip, ...rest } = values as Hero;
      updateHero(rest as Partial<Hero>);
    });
    return () => sub.unsubscribe();
  }, [watch, updateHero]);

  function handlePortraitChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateHero({ portrait: reader.result as string });
    reader.readAsDataURL(file);
  }

  return (
    <form>
      <p className="editor-hint">Content shown in the hero banner at the top of your portfolio.</p>
      <div className="field-group">
        <label className="field-label" htmlFor="hero-name">Name</label>
        <input id="hero-name" type="text" className="field-input" {...register('name')} />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="hero-tagline">Tagline</label>
        <input id="hero-tagline" type="text" className="field-input" {...register('tagline')} />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="hero-subtitle">Subtitle</label>
        <input id="hero-subtitle" type="text" className="field-input" {...register('subtitle')} />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="hero-portrait">Portrait</label>
        <input
          id="hero-portrait"
          type="file"
          accept="image/*"
          className="field-input"
          onChange={handlePortraitChange}
        />
        {hero.portrait && (
          <div className="portrait-preview">
            <img src={hero.portrait} alt="Portrait preview" />
          </div>
        )}
      </div>
    </form>
  );
}
