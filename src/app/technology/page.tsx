import type { Metadata } from 'next';
import { SecuritySection } from '@/components/sections/home/SecuritySection';
import { TechnologySection } from '@/components/sections/home/TechnologySection';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { FeatureSection } from '@/components/sections/shared/FeatureSection';
import { PageHero } from '@/components/sections/shared/PageHero';
import { SceneFrame } from '@/components/sections/shared/SceneFrame';
import { SceneImage } from '@/components/three/SceneImage';
import type { Feature } from '@/components/ui/FeatureGrid';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Technology',
  description:
    'AI matching, trust and verification, safety intelligence, real-time mobility and fraud protection: the technology behind every Sahyatri journey.',
  path: '/technology',
});

const principles: Feature[] = [
  { icon: 'eye', title: 'Explainable', description: 'Every match comes with the reasons it fits, in plain language.' },
  { icon: 'handshake', title: 'Fair', description: 'Matching is designed never to use protected characteristics such as religion, caste or ethnicity.' },
  { icon: 'lock', title: 'Private', description: 'Models use only the data a match needs, and location is minimised outside active trips.' },
  { icon: 'user-cog', title: 'Human oversight', description: 'Decisions that affect someone’s safety or account are reviewed by people.' },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology"
        title="The intelligence behind every journey."
        lead="Five systems work together so that every shared ride fits, feels safe and stays trustworthy — from the first search to the final rating."
        path="/technology"
        layout="wide"
        visual={
          <SceneFrame
            scene="matching"
            sceneProps={{}}
            size="tall"
            fallback={<SceneImage name="matching" priority />}
            label="Illustration: a passenger's route merges into a driver's route at a pickup point after other routes are evaluated."
          />
        }
      />
      <TechnologySection />
      <FeatureSection
        id="principles"
        eyebrow="Responsible AI"
        title="Intelligence people can trust."
        lead="Matching affects who people travel with. We hold it to clear principles."
        features={principles}
        columns={4}
      />
      <SecuritySection />
      <CtaBand title="See it working on your route." />
    </>
  );
}
