import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SceneImage } from '@/components/three/SceneImage';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { Button } from '@/components/ui/Button';
import { ctaLinks } from '@/data/navigation';
import { cn } from '@/lib/cn';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section data-tone="dark" className={styles.hero} aria-labelledby="hero-title">
      <Container className={styles.content}>
        <p className={cn('text-eyebrow', styles.eyebrow)}>Shared mobility, intelligently matched</p>
        <h1 id="hero-title" className={cn('text-display', styles.title)}>
          Move together.
        </h1>
        <p className={cn('text-h3', styles.subhead)}>Intelligent mobility for real people.</p>
        <p className={cn('text-body-large', styles.body)}>
          Find trusted rides, share empty seats and move through cities on a smarter, verified shared network.
        </p>
        <div className={styles.actions}>
          <Button href={ctaLinks.findRide.href} size="lg" arrow>
            {ctaLinks.findRide.label}
          </Button>
          <Button href={ctaLinks.offerSeat.href} size="lg" variant="secondary">
            {ctaLinks.offerSeat.label}
          </Button>
        </div>
        <Link href="#how-it-works" className={styles.explore}>
          {ctaLinks.howItWorks.label}
          <ArrowDown size={16} aria-hidden="true" />
        </Link>
      </Container>

      <SceneCanvas
        scene="mobility"
        sceneProps={{ variant: 'hero' }}
        fallback={<SceneImage name="mobility" compactName="mobility-compact" priority />}
        label="Illustration of a mobility network: cities connected by routes, with drivers and passengers travelling between them and an example trip from Delhi to Jaipur."
        className={styles.visual}
      />
      <div className={styles.scrim} aria-hidden="true" />

      <Container className={styles.legendWrap}>
        <ul role="list" className={styles.legend} aria-label="Legend">
          <li>
            <span className={cn(styles.swatch, styles.driver)} aria-hidden="true" />
            Drivers with free seats
          </li>
          <li>
            <span className={cn(styles.swatch, styles.passenger)} aria-hidden="true" />
            Passengers
          </li>
          <li>
            <span className={cn(styles.swatch, styles.route)} aria-hidden="true" />
            Example route
          </li>
        </ul>
      </Container>
    </section>
  );
}
