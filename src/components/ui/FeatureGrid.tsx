import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from './Icon';
import { Reveal } from './Reveal';
import styles from './FeatureGrid.module.css';

export interface Feature {
  icon?: IconName;
  title: string;
  description: string;
}

interface FeatureGridProps {
  items: Feature[];
  columns?: 2 | 3 | 4;
  /** `plain` is an open typographic grid; `card` puts each item on a bordered surface. */
  variant?: 'plain' | 'card';
  headingLevel?: 'h3' | 'h4';
  className?: string;
}

export function FeatureGrid({ items, columns = 3, variant = 'plain', headingLevel = 'h3', className }: FeatureGridProps) {
  const Heading = headingLevel;
  return (
    <ul role="list" className={cn(styles.grid, styles[`cols${columns}`], styles[variant], className)}>
      {items.map((item, index) => (
        <Reveal as="li" key={item.title} index={index % columns} className={styles.item}>
          {item.icon ? (
            <span className={styles.iconTile}>
              <Icon name={item.icon} size={22} />
            </span>
          ) : null}
          <Heading className={cn('text-h4', styles.title)}>{item.title}</Heading>
          <p className={cn('text-small', styles.description)}>{item.description}</p>
        </Reveal>
      ))}
    </ul>
  );
}

interface LinkCardProps {
  href: string;
  icon?: IconName;
  eyebrow?: string;
  title: string;
  description: string;
  cta: string;
  className?: string;
}

/** An interactive card: the whole surface is one link, with lift, shadow and border highlight on hover. */
export function LinkCard({ href, icon, eyebrow, title, description, cta, className }: LinkCardProps) {
  return (
    <Link href={href} className={cn(styles.linkCard, className)}>
      {icon ? (
        <span className={styles.iconTile}>
          <Icon name={icon} size={22} />
        </span>
      ) : null}
      {eyebrow ? <span className={cn('text-eyebrow', styles.eyebrow)}>{eyebrow}</span> : null}
      <span className={cn('text-h4', styles.title)}>{title}</span>
      <span className={cn('text-small', styles.description)}>{description}</span>
      <span className={styles.cta}>
        {cta}
        <ArrowRight size={16} aria-hidden="true" className={styles.ctaArrow} />
      </span>
    </Link>
  );
}
