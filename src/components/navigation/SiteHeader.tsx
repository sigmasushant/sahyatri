'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ctaLinks, primaryNav } from '@/data/navigation';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/cn';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import styles from './SiteHeader.module.css';

const sectionIds = primaryNav.flatMap((item) => (item.sectionId ? [item.sectionId] : []));

/**
 * Sticky header. Transparent over the hero; once scrolled it becomes a translucent bar
 * that takes the tone (light or dark) of whatever section is passing beneath it.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [tone, setTone] = useState<'light' | 'dark'>('dark');
  const activeSection = useActiveSection(sectionIds, pathname === '/');

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
      const header = document.querySelector<HTMLElement>('[data-site-header]');
      const probeY = (header?.offsetHeight ?? 64) + 1;
      const below = document.elementFromPoint(4, probeY)?.closest('[data-tone]');
      setTone(below?.getAttribute('data-tone') === 'light' ? 'light' : 'dark');
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  return (
    <header data-site-header data-tone={tone} className={cn(styles.header, scrolled && styles.scrolled)}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Sahyatri home">
          <Logo />
        </Link>
        <DesktopNav pathname={pathname} activeSection={activeSection} />
        <div className={styles.actions}>
          <Link href={ctaLinks.login.href} className={styles.login}>
            {ctaLinks.login.label}
          </Link>
          <Button href={ctaLinks.getApp.href} size="sm" className={styles.cta}>
            {ctaLinks.getApp.label}
          </Button>
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
