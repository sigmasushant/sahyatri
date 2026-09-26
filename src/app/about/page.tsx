import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { FeatureSection } from '@/components/sections/shared/FeatureSection';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Button } from '@/components/ui/Button';
import type { Feature } from '@/components/ui/FeatureGrid';
import { SceneImage } from '@/components/three/SceneImage';
import { pageMetadata } from '@/lib/seo';
import styles from './about.module.css';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    'Sahyatri means co-traveller. We are building a trusted, intelligent shared mobility network so every empty seat can connect two journeys.',
  path: '/about',
});

const beliefs: Feature[] = [
  { icon: 'users', title: 'People first', description: 'Technology should make it easier to trust the person next to you, not replace them.' },
  { icon: 'shield-check', title: 'Safety is not a feature', description: 'It is designed into every decision, and never traded for growth.' },
  { icon: 'eye', title: 'Honest by default', description: 'Clear prices, clear rules and no claims we cannot stand behind.' },
  { icon: 'leaf', title: 'Fuller cars, lighter roads', description: 'Every shared seat is one less car making the same trip.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Every empty seat can connect two journeys."
        lead="Sahyatri means co-traveller. We are building a shared mobility network where finding someone going your way is simple, affordable and safe."
        path="/about"
        visual={
          <div className={styles.visual} aria-hidden="true">
            <SceneImage name="ambient" priority />
          </div>
        }
      />
      <Section tone="light" id="mission" aria-labelledby="mission-title">
        <Container size="narrow" className={styles.prose}>
          <SectionIntro eyebrow="Why we exist" title="Millions of seats travel empty every day." titleId="mission-title" />
          <p>
            Every day, cars leave home with one person in them, heading in the same direction as someone waiting at a
            bus stop or booking a cab. The road is shared; the journey is not.
          </p>
          <p>
            Carpooling has always made sense. What has held it back is trust and fit: not knowing who you will travel
            with, and not finding a ride that goes where and when you need. Sahyatri is designed around both — verified
            people and vehicles, and matching that understands real journeys.
          </p>
          <p>
            We are starting with the trips people make most — daily commutes and journeys between nearby cities — and
            building the network one community at a time.
          </p>
        </Container>
      </Section>
      <FeatureSection id="beliefs" eyebrow="What we believe" title="Principles we build by." features={beliefs} columns={4} surface="subtle" />
      <Section tone="light" id="status" aria-labelledby="status-title">
        <Container className={styles.split}>
          <SectionIntro
            eyebrow="Where we are"
            title="Building towards launch."
            titleId="status-title"
            lead="Sahyatri is preparing to launch. We are working with early-access members, companies and campuses to shape the first communities."
          />
          <div id="press" className={styles.press}>
            <h3 className="text-h4">Press</h3>
            <p className={styles.pressText}>
              For interviews, information or brand assets, contact us and choose “Press” as the topic.
            </p>
            <Button href="/contact?topic=press" variant="secondary" arrow>
              Contact us
            </Button>
          </div>
        </Container>
      </Section>
      <CtaBand title="Join us on the road." secondary={{ label: 'Careers', href: '/careers' }} />
    </>
  );
}
