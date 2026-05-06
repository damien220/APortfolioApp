import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePortfolioStore } from '../../state/store';
import { AboutSchema, type About } from '../../state/schema';
import SkillsEditor from './SkillsEditor';
import '../shared/DragHandle.css';

export default function AboutEditor() {
  const { about, updateAbout } = usePortfolioStore();
  const { register, watch } = useForm<About>({
    resolver: zodResolver(AboutSchema),
    defaultValues: { bio: about.bio, skills: about.skills },
  });

  useEffect(() => {
    const sub = watch((values) => {
      if (values.bio !== undefined) {
        updateAbout({ bio: values.bio });
      }
    });
    return () => sub.unsubscribe();
  }, [watch, updateAbout]);

  return (
    <form>
      <p className="editor-hint">Your bio and skill categories shown on the About section.</p>
      <div className="field-group">
        <label className="field-label" htmlFor="about-bio">Bio</label>
        <textarea
          id="about-bio"
          className="field-input"
          rows={6}
          {...register('bio')}
        />
      </div>
      <SkillsEditor />
    </form>
  );
}
