import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { FeatureSection } from '@/components/sections/shared/FeatureSection';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Button } from '@/components/ui/Button';
import type { Feature } from '@/components/ui/FeatureGrid';
import { pageMetadata } from '@/lib/seo';
import styles from './careers.module.css';

export const metadata: Metadata = pageMetadata({
  title: 'Careers',
  description: 'Help build how people share the road. How we work at Sahyatri, and how to get in touch about future roles.',
  path: '/careers',
});

const values: Feature[] = [
  { icon: 'users', title: 'Build for real journeys', description: 'We ride with the people we build for, and let their trips shape the product.' },
  { icon: 'shield-check', title: 'Safety over speed', description: 'We ship quickly, but never at the cost of someone’s safety or privacy.' },
  { icon: 'handshake', title: 'Own it together', description: 'Small teams, clear ownership, and honest reviews of what worked and what did not.' },
  { icon: 'sparkles', title: 'Craft matters', description: 'From matching models to microcopy, details are how trust is earned.' },
];

/** Open roles appear here once published. Empty until then — never placeholder listings. */
const roles: { title: string; team: string; location: string; href: string }[] = [];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Help people move together."
        lead="We are a small team building trusted, intelligent shared mobility. If that sounds like your kind of problem, we would like to hear from you."
        path="/careers"
        layout="text"
      />
      <FeatureSection id="how-we-work" eyebrow="How we work" title="What we value." features={values} columns={4} />
      <Section tone="light" surface="subtle" id="roles" aria-labelledby="roles-title">
        <Container>
          <SectionIntro eyebrow="Open roles" title="Current openings." titleId="roles-title" />
          {roles.length > 0 ? (
            <ul role="list" className={styles.roles}>
              {roles.map((role) => (
                <li key={role.href}>
                  <a href={role.href} className={styles.role} target="_blank" rel="noopener noreferrer">
                    <span className={styles.roleTitle}>{role.title}</span>
                    <span className={styles.roleMeta}>
                      {role.team} · {role.location}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <p className="text-h4">There are no open roles listed right now.</p>
              <p className={styles.emptyText}>
                We will post roles here as the team grows. If you would like to be considered for future openings,
                introduce yourself and tell us what you would like to work on.
              </p>
              <Button href="/contact?topic=careers" variant="secondary" arrow>
                Introduce yourself
              </Button>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
