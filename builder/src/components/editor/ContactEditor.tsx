import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePortfolioStore } from '../../state/store';
import { ContactSchema, type Contact } from '../../state/schema';
import '../shared/DragHandle.css';
import './ContactEditor.css';

export default function ContactEditor() {
  const { contact, updateContact } = usePortfolioStore();
  const { register, watch } = useForm<Contact>({
    resolver: zodResolver(ContactSchema),
    defaultValues: contact,
  });

  useEffect(() => {
    const sub = watch((values) => updateContact(values as Contact));
    return () => sub.unsubscribe();
  }, [watch, updateContact]);

  return (
    <form>
      <p className="editor-hint">Text and links displayed in the Contact section.</p>
      <div className="field-group">
        <label className="field-label" htmlFor="contact-intro">Intro text</label>
        <textarea
          id="contact-intro"
          className="field-input"
          rows={3}
          {...register('intro')}
        />
      </div>
      <div className="field-group">
        <label className="field-label" htmlFor="contact-formspree">Formspree ID</label>
        <input
          id="contact-formspree"
          type="text"
          className="field-input"
          {...register('formspreeId')}
        />
        <p className="field-hint">Sign up at formspree.io to get a form ID.</p>
      </div>
    </form>
  );
}
