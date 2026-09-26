'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import styles from './Accordion.module.css';

export interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  headingLevel?: 'h3' | 'h4';
  className?: string;
}

/** Accessible disclosure list (WAI-ARIA accordion pattern via Radix): arrow keys, Home/End, Enter/Space. */
export function Accordion({ items, headingLevel = 'h3', className }: AccordionProps) {
  const Heading = headingLevel;
  return (
    <AccordionPrimitive.Root type="single" collapsible className={cn(styles.root, className)}>
      {items.map((item, index) => (
        <AccordionPrimitive.Item key={item.question} value={`item-${index}`} className={styles.item}>
          <AccordionPrimitive.Header asChild>
            <Heading className={styles.header}>
              <AccordionPrimitive.Trigger className={styles.trigger}>
                <span>{item.question}</span>
                <span className={styles.icon} aria-hidden="true">
                  <Plus size={18} />
                </span>
              </AccordionPrimitive.Trigger>
            </Heading>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className={styles.content}>
            <p className={styles.answer}>{item.answer}</p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
