import type { NavItem } from '../../state/schema';
import './PreviewNavbar.css';

interface Props {
  title: string;
  nav: NavItem[];
}

export default function PreviewNavbar({ title, nav }: Props) {
  return (
    <header className="pv-navbar">
      <div className="container pv-navbar-inner">
        <a className="pv-navbar-logo">{title}</a>
        <nav>
          <ul className="pv-navbar-links">
            {nav.map(({ href, label }) => (
              <li key={href}>
                <span className="pv-navbar-link">{label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
