'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { primaryNav, type NavItem } from '@/data/navigation';
import { cn } from '@/lib/cn';
import styles from './DesktopNav.module.css';

interface DesktopNavProps {
  pathname: string;
  activeSection: string | null;
}

function isItemActive(item: NavItem, pathname: string, activeSection: string | null): boolean {
  if (pathname === '/') return Boolean(item.sectionId && item.sectionId === activeSection);
  if (item.href) return pathname.startsWith(item.href);
  return item.children?.some((child) => pathname.startsWith(child.href)) ?? false;
}

export function DesktopNav({ pathname, activeSection }: DesktopNavProps) {
  return (
    <NavigationMenu.Root className={styles.root} aria-label="Main">
      <NavigationMenu.List className={styles.list}>
        {primaryNav.map((item) => {
          const active = isItemActive(item, pathname, activeSection);
          if (item.children) {
            return (
              <NavigationMenu.Item key={item.label} className={styles.item}>
                <NavigationMenu.Trigger className={cn(styles.link, active && styles.active)}>
                  {item.label}
                  <ChevronDown size={14} aria-hidden="true" className={styles.chevron} />
                  <span className={styles.indicator} aria-hidden="true" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className={styles.content}>
                  <ul className={styles.panel}>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavigationMenu.Link asChild active={pathname === child.href}>
                          <Link href={child.href} className={styles.panelLink}>
                            <span className={styles.panelTitle}>{child.label}</span>
                            {child.description ? (
                              <span className={styles.panelDescription}>{child.description}</span>
                            ) : null}
                          </Link>
                        </NavigationMenu.Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          }
          return (
            <NavigationMenu.Item key={item.label} className={styles.item}>
              <NavigationMenu.Link asChild active={pathname === item.href}>
                <Link
                  href={item.href ?? '/'}
                  className={cn(styles.link, active && styles.active)}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.label}
                  <span className={styles.indicator} aria-hidden="true" />
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
