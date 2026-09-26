'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { ctaLinks, primaryNav } from '@/data/navigation';
import { cn } from '@/lib/cn';
import styles from './MobileMenu.module.css';

export function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  const links = primaryNav.flatMap((item) => (item.children ? item.children : [{ label: item.label, href: item.href ?? '/' }]));

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={styles.trigger} aria-label="Open menu">
        <Menu size={22} aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content data-tone="dark" className={styles.content} aria-describedby={undefined}>
          <div className={styles.top}>
            <Logo />
            <Dialog.Close className={styles.close} aria-label="Close menu">
              <X size={22} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Title className="visually-hidden">Menu</Dialog.Title>
          <nav aria-label="Main" className={styles.nav}>
            <ul role="list" className={styles.list}>
              {links.map((link, index) => (
                <li key={link.href} style={{ animationDelay: `${index * 40}ms` }} className={styles.itemRow}>
                  <Link
                    href={link.href}
                    className={cn(styles.link, pathname === link.href && styles.current)}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.footer}>
            <Button href={ctaLinks.getApp.href} size="lg" fullWidth arrow onClick={() => setOpen(false)}>
              {ctaLinks.getApp.label}
            </Button>
            <Button href={ctaLinks.login.href} variant="secondary" size="lg" fullWidth onClick={() => setOpen(false)}>
              {ctaLinks.login.label}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
