import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { ToneName } from '@/design-system/tokens';
import { cn } from '@/lib/cn';
import styles from './Section.module.css';

interface SectionProps extends Omit<ComponentPropsWithoutRef<'section'>, 'children'> {
  tone?: ToneName;
  /** `subtle` uses the tone's quiet background for a band. */
  surface?: 'default' | 'subtle';
  spacing?: 'default' | 'compact' | 'none';
  children: ReactNode;
}

/**
 * A page section. Setting `tone` swaps every semantic colour variable underneath it,
 * so components inside adapt to light or dark without extra props.
 */
export function Section({
  tone = 'light',
  surface = 'default',
  spacing = 'default',
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      data-tone={tone}
      className={cn(styles.section, styles[spacing], surface === 'subtle' && styles.subtle, className)}
      {...rest}
    >
      {children}
    </section>
  );
}

interface SectionIntroProps {
  eyebrow?: string;
  title: ReactNode;
  titleId?: string;
  lead?: ReactNode;
  align?: 'start' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  size?: 'h1' | 'h2' | 'h3';
  className?: string;
  children?: ReactNode;
}

export function SectionIntro({
  eyebrow,
  title,
  titleId,
  lead,
  align = 'start',
  as: Heading = 'h2',
  size = 'h2',
  className,
  children,
}: SectionIntroProps) {
  return (
    <div className={cn(styles.intro, align === 'center' && styles.center, className)}>
      {eyebrow ? <p className={cn('text-eyebrow', styles.eyebrow)}>{eyebrow}</p> : null}
      <Heading id={titleId} className={cn(`text-${size}`, styles.title)}>
        {title}
      </Heading>
      {lead ? <p className={cn('text-body-large', styles.lead)}>{lead}</p> : null}
      {children}
    </div>
  );
}
