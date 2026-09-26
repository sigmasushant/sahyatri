import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Container.module.css';

interface ContainerProps {
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'article';
  size?: 'default' | 'narrow';
  className?: string;
  children: ReactNode;
}

export function Container({ as: Tag = 'div', size = 'default', className, children }: ContainerProps) {
  return <Tag className={cn(styles.container, size === 'narrow' && styles.narrow, className)}>{children}</Tag>;
}
