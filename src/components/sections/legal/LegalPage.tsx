import { FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';
import { PageHero } from '@/components/sections/shared/PageHero';
import styles from './LegalPage.module.css';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  lead: string;
  path: string;
  sections: LegalSection[];
}

/**
 * Long-form legal document with a table of contents. Every legal page carries a visible
 * draft notice until counsel has approved the text and set an effective date.
 */
export function LegalPage({ eyebrow, title, lead, path, sections }: LegalPageProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} path={path} layout="text" />
      <section data-tone="light" className={styles.wrap} aria-label={title}>
        <Container className={styles.layout}>
          <nav className={styles.toc} aria-label="On this page">
            <p className={styles.tocTitle}>On this page</p>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <article className={styles.article}>
            <div className={styles.notice} role="note">
              <FileText size={20} aria-hidden="true" />
              <p>
                <strong>Draft for review.</strong> This document is a pre-launch draft and is not yet in effect. It will be
                finalised with legal counsel, and dated, before Sahyatri launches.
              </p>
            </div>
            {sections.map((section) => (
              <section key={section.id} id={section.id} className={styles.section} aria-labelledby={`${section.id}-title`}>
                <h2 id={`${section.id}-title`} className="text-h3">
                  {section.title}
                </h2>
                <div className={styles.body}>{section.body}</div>
              </section>
            ))}
          </article>
        </Container>
      </section>
    </>
  );
}
