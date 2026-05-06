import './PreviewContact.css';

interface Props {
  intro: string;
}

export default function PreviewContact({ intro }: Props) {
  return (
    <section className="pv-contact section">
      <div className="container">
        <h2 className="section-title">Contact</h2>
        <p className="pv-contact-intro">{intro}</p>
        <button type="button" className="pv-contact-btn">Send Message</button>
      </div>
    </section>
  );
}
