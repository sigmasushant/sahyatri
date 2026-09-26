'use client';

import { Search, X } from 'lucide-react';
import { useDeferredValue, useId, useMemo, useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import type { FaqItem } from '@/data/faq';
import { cn } from '@/lib/cn';
import styles from './HelpCenter.module.css';

const topics: { value: FaqItem['topic'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All topics' },
  { value: 'basics', label: 'Getting started' },
  { value: 'safety', label: 'Safety' },
  { value: 'payments', label: 'Payments' },
  { value: 'trips', label: 'Trips & cancellations' },
  { value: 'privacy', label: 'Privacy' },
  { value: 'organisations', label: 'Companies & campuses' },
];

const normalise = (text: string) => text.toLowerCase().normalize('NFKD');

export function HelpCenter({ items }: { items: FaqItem[] }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<(typeof topics)[number]['value']>('all');
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const terms = normalise(deferredQuery).split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      if (topic !== 'all' && item.topic !== topic) return false;
      const haystack = normalise(`${item.question} ${item.answer}`);
      return terms.every((term) => haystack.includes(term));
    });
  }, [items, deferredQuery, topic]);

  return (
    <div className={styles.center}>
      <div className={styles.search}>
        <label htmlFor={`${id}-q`} className="visually-hidden">
          Search help articles
        </label>
        <Search size={20} aria-hidden="true" className={styles.searchIcon} />
        <input
          id={`${id}-q`}
          type="search"
          placeholder="Search, e.g. “refund”, “SOS” or “recurring”"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={styles.input}
          aria-describedby={`${id}-count`}
        />
        {query ? (
          <button type="button" className={styles.clear} onClick={() => setQuery('')} aria-label="Clear search">
            <X size={18} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className={styles.topics} role="group" aria-label="Filter by topic">
        {topics.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(styles.topic, topic === option.value && styles.topicActive)}
            aria-pressed={topic === option.value}
            onClick={() => setTopic(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p id={`${id}-count`} className={styles.count} aria-live="polite">
        {results.length === 1 ? '1 answer' : `${results.length} answers`}
      </p>

      {results.length > 0 ? (
        <Accordion items={results} key={`${topic}-${deferredQuery}`} />
      ) : (
        <div className={styles.empty}>
          <p className="text-h4">{query ? <>No answers match “{query}”.</> : 'No answers in this topic yet.'}</p>
          <p className={styles.emptyText}>Try a different word, choose another topic, or contact our support team below.</p>
        </div>
      )}
    </div>
  );
}
