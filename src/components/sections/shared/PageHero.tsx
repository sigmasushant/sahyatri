import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/Button';
import { breadcrumbJsonLd } from '@/lib/seo';
import { cn } from '@/lib/cn';
import styles from './PageHero.module.css';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead: string;
  /** Canonical path of the page, for breadcrumb structured data. */
  path: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  visual?: ReactNode;
  /** `wide` gives the visual more room (3D scenes). */
  layout?: 'split' | 'wide' | 'text';
}

/** Dark, cinematic opening for every product page; the site header sits transparently over it. */
export function PageHero({ eyebrow, title, lead, path, primary, secondary, visual, layout = 'split' }: PageHeroProps) {
  return (
    <section data-tone="dark" className={cn(styles.hero, styles[layout])} aria-labelledby="page-title">
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <p className={cn('text-eyebrow', styles.eyebrow)}>{eyebrow}</p>
          <h1 id="page-title" className={cn('text-h1', styles.title)}>
            {title}
          </h1>
          <p className={cn('text-body-large', styles.lead)}>{lead}</p>
          {primary || secondary ? (
            <div className={styles.actions}>
              {primary ? (
                <Button href={primary.href} size="lg" arrow>
                  {primary.label}
                </Button>
              ) : null}
              {secondary ? (
                <Button href={secondary.href} size="lg" variant="secondary">
                  {secondary.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
        {visual ? <div className={styles.visual}>{visual}</div> : null}
      </Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: eyebrow, path },
        ])}
      />
    </section>
  );
}
