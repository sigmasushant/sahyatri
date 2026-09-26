import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { FaqSection } from '@/components/sections/home/FaqSection';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { FeatureSection } from '@/components/sections/shared/FeatureSection';
import { FeatureSplit } from '@/components/sections/shared/FeatureSplit';
import { PageHero } from '@/components/sections/shared/PageHero';
import { SceneFrame } from '@/components/sections/shared/SceneFrame';
import { SceneImage } from '@/components/three/SceneImage';
import type { Feature } from '@/components/ui/FeatureGrid';
import { LiveTripCard } from '@/components/visuals/LiveTripCard';
import { siteConfig } from '@/config/site';
import { faq } from '@/data/faq';
import { safetyFeatures } from '@/data/features';
import { pageMetadata } from '@/lib/seo';
import styles from './safety.module.css';

export const metadata: Metadata = pageMetadata({
  title: 'Safety',
  description:
    'Verified people and vehicles, trip PIN, live trip sharing, route monitoring, SOS and incident support. How Sahyatri keeps every shared journey safer.',
  path: '/safety',
});

const phases = [
  {
    title: 'Before you travel',
    items: [
      'Identity checked with a government ID and live selfie',
      'Vehicle registration verified before a car is listed',
      'Profiles show verification, ratings and reliability',
      'Women-only ride options where you want them',
    ],
  },
  {
    title: 'During the trip',
    items: [
      'A one-time trip PIN confirms the right person and car',
      'Live trip sharing with the contacts you choose',
      'Route monitoring checks in on unexpected stops or detours',
      'SOS is always one tap away',
    ],
  },
  {
    title: 'After you arrive',
    items: [
      'Two-way ratings keep the community accountable',
      'Report a concern about any trip, at any time',
      'Our incident team follows up on every safety report',
      'Accounts that break community rules are restricted',
    ],
  },
];

const sosSteps: Feature[] = [
  { icon: 'siren', title: 'Tap SOS', description: 'The button is on every active trip screen. No menus, no confirmation maze.' },
  { icon: 'users', title: 'Your contacts are alerted', description: 'Trusted contacts receive your live location and trip details.' },
  { icon: 'headset', title: 'Our team connects with you', description: 'Incident support reaches out and stays with you until you are safe.' },
  { icon: 'phone', title: `Call ${siteConfig.emergencyNumber} in an emergency`, description: 'Sahyatri helps you get help, but it does not replace emergency services.' },
];

export default function SafetyPage() {
  const questions = faq.filter((item) => item.topic === 'safety' || item.topic === 'privacy');
  return (
    <>
      <PageHero
        eyebrow="Safety"
        title="Safety is part of the journey."
        lead="Protection is designed into every step of a shared trip — calm, visible and always within reach, for passengers and drivers alike."
        path="/safety"
        layout="wide"
        visual={
          <SceneFrame
            scene="safety"
            sceneProps={{}}
            minTier="high"
            size="tall"
            fallback={<SceneImage name="safety" priority />}
            label="Illustration: a car travels a route through a city inside a soft protective field, with its trip shared live."
          />
        }
      />
      <Section tone="light" id="every-step" aria-labelledby="every-step-title">
        <Container>
          <SectionIntro eyebrow="Every step" title="Before, during and after every trip." titleId="every-step-title" />
          <ol className={styles.phases}>
            {phases.map((phase, index) => (
              <li key={phase.title} className={styles.phase}>
                <span className={styles.phaseIndex}>{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-h3">{phase.title}</h3>
                <ul className={styles.items}>
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <FeatureSection
        id="toolkit"
        eyebrow="Safety toolkit"
        title="Eight layers of protection."
        features={safetyFeatures}
        columns={4}
        variant="card"
        surface="subtle"
      />
      <FeatureSplit
        id="sos"
        eyebrow="SOS"
        title="Help, one tap away."
        lead="If something feels wrong during a trip, SOS brings the people who can help closer — immediately."
        steps={sosSteps}
        visual={<LiveTripCard />}
      />
      <FaqSection items={questions} title="Safety questions." />
      <CtaBand title="Travel with people you can trust." />
    </>
  );
}
