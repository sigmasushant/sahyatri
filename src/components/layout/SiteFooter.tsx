import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { siteConfig } from '@/config/site';
import { footerNav } from '@/data/navigation';
import { Container } from './Container';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const year = new Date().getFullYear();
  const columns = siteConfig.social.length
    ? [...footerNav, { title: 'Social', links: siteConfig.social.map((s) => ({ label: s.label, href: s.href })) }]
    : footerNav;

  return (
    <footer data-tone="dark" className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" aria-label="Sahyatri home" className={styles.logoLink}>
              <Logo />
            </Link>
            <p className={styles.statement}>Trusted rides and shared seats, matched intelligently.</p>
          </div>
          <nav aria-label="Footer" className={styles.columns}>
            {columns.map((column) => (
              <div key={column.title} className={styles.column}>
                <h2 className={styles.columnTitle}>{column.title}</h2>
                <ul role="list" className={styles.links}>
                  {column.links.map((link) => {
                    const external = link.href.startsWith('http');
                    return (
                      <li key={link.href + link.label}>
                        {external ? (
                          <a href={link.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                            {link.label}
                            <span className="visually-hidden"> (opens in a new tab)</span>
                          </a>
                        ) : (
                          <Link href={link.href} className={styles.link}>
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className={styles.bottom}>
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>In an emergency, always call {siteConfig.emergencyNumber} first.</p>
        </div>
      </Container>
    </footer>
  );
}
