import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ctaLinks } from '@/data/navigation';
import { cn } from '@/lib/cn';
import styles from './CtaBand.module.css';

interface CtaBandProps {
  title?: string;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

/** The closing invitation on every product page. */
export function CtaBand({
  title = 'Move better. Together.',
  text = 'Join the network and be among the first to share the road when Sahyatri opens near you.',
  primary = ctaLinks.earlyAccess,
  secondary = ctaLinks.howItWorks,
}: CtaBandProps) {
  return (
    <section data-tone="dark" className={styles.band} aria-labelledby="cta-title">
      <Container className={styles.inner}>
        <div>
          <h2 id="cta-title" className={cn('text-h1', styles.title)}>
            {title}
          </h2>
          <p className={cn('text-body-large', styles.text)}>{text}</p>
        </div>
        <div className={styles.actions}>
          <Button href={primary.href} size="lg" arrow>
            {primary.label}
          </Button>
          <Button href={secondary.href} size="lg" variant="secondary">
            {secondary.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
