import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  /** Trailing arrow that nudges forward on hover. */
  arrow?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsLink = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, keyof BaseProps | 'href'>;
type ButtonAsButton = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps>;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', arrow = false, icon, fullWidth, className, children, ...rest } = props;
  const classes = cn(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className);

  const content = (
    <>
      {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
      {arrow ? <ArrowRight className={styles.arrow} size={18} strokeWidth={2} aria-hidden="true" /> : null}
    </>
  );

  if (typeof rest.href === 'string') {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    if (isExternal(href)) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...anchorProps}>
          {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null}
          <span>{children}</span>
          <ArrowUpRight className={styles.arrow} size={18} strokeWidth={2} aria-hidden="true" />
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const { type = 'button', ...buttonProps } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
