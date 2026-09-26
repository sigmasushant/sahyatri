import type { Metadata } from 'next';
import { FaqSection } from '@/components/sections/home/FaqSection';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { FeatureSection } from '@/components/sections/shared/FeatureSection';
import { FeatureSplit } from '@/components/sections/shared/FeatureSplit';
import { PageHero } from '@/components/sections/shared/PageHero';
import { SceneFrame } from '@/components/sections/shared/SceneFrame';
import { SceneImage } from '@/components/three/SceneImage';
import { MatchListPreview, SearchPreview } from '@/components/visuals/RidePreviews';
import type { Feature } from '@/components/ui/FeatureGrid';
import { faq } from '@/data/faq';
import { driverSteps, passengerSteps } from '@/data/features';
import { ctaLinks } from '@/data/navigation';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'How it works',
  description:
    'Search your route, choose a verified match and travel together. How Sahyatri matching, booking, payment and safety work for passengers and drivers.',
  path: '/how-it-works',
});

const matchFactors: Feature[] = [
  { icon: 'route', title: 'Route overlap', description: 'How much of your journey is already on the driver’s route, and how small the detour is.' },
  { icon: 'clock', title: 'Departure timing', description: 'How closely the driver’s departure fits the window you asked for.' },
  { icon: 'map-pin', title: 'Pickup convenience', description: 'Walking distance and how easy the pickup point is to reach and find.' },
  { icon: 'sparkles', title: 'Preferences', description: 'Quiet rides, music, luggage, pets, women-only options and more.' },
  { icon: 'star', title: 'Reliability', description: 'Completed trips, cancellations and ratings from previous travellers.' },
  { icon: 'eye', title: 'Explained, not hidden', description: 'Every suggestion comes with the reasons it fits, so you decide with context.' },
];

const payments: Feature[] = [
  { icon: 'receipt', title: 'Costs shown up front', description: 'The cost share for your seat is clear before you book. No surge, no haggling.' },
  { icon: 'credit-card', title: 'Pay in the app', description: 'Your share is paid securely through a regulated payment partner when you book.' },
  { icon: 'wallet', title: 'Drivers paid after the trip', description: 'The driver receives their share once the trip is completed.' },
  { icon: 'file', title: 'Clear cancellation rules', description: 'What is refunded, and when, is shown before you confirm a booking.' },
];

export default function HowItWorksPage() {
  const questions = faq.filter((item) => item.topic === 'basics' || item.topic === 'payments' || item.topic === 'trips');
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="From search to shared journey."
        lead="Sahyatri matches people who are already going the same way. Here is how a trip comes together — for passengers and for drivers."
        path="/how-it-works"
        primary={ctaLinks.findRide}
        secondary={ctaLinks.offerSeat}
        visual={<MatchListPreview />}
      />
      <FeatureSplit
        id="passengers"
        eyebrow="For passengers"
        title="Find a ride that fits your journey."
        lead="Search where and when you are going. We show drivers already heading your way, ranked by how well each ride fits."
        steps={passengerSteps}
        cta={{ label: 'More for passengers', href: '/passengers' }}
        visual={<SearchPreview />}
      />
      <FeatureSplit
        id="drivers"
        eyebrow="For drivers"
        title="Share the seats you are not using."
        lead="Publish a trip you are already making. Verified travellers going the same way request a seat, and the costs are shared."
        steps={driverSteps}
        cta={{ label: 'More for drivers', href: '/drivers' }}
        visual={
          <SceneFrame
            scene="seats"
            sceneProps={{}}
            minTier="high"
            fallback={<SceneImage name="seats" />}
            label="Illustration: a car on its published route with empty seats filled by matched travellers."
          />
        }
        reverse
        surface="subtle"
      />
      <FeatureSection
        id="matching-factors"
        eyebrow="Matching"
        title="How a match is decided."
        lead="Distance alone makes poor matches. Sahyatri weighs what actually makes a shared ride work."
        features={matchFactors}
      />
      <FeatureSection
        id="payments"
        eyebrow="Payments"
        title="Shared costs, handled simply."
        features={payments}
        columns={4}
        surface="subtle"
      />
      <FaqSection items={questions} title="Common questions." />
      <CtaBand />
    </>
  );
}
