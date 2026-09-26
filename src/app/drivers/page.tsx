import type { Metadata } from 'next';
import { FaqSection } from '@/components/sections/home/FaqSection';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { FeatureSection } from '@/components/sections/shared/FeatureSection';
import { FeatureSplit } from '@/components/sections/shared/FeatureSplit';
import { PageHero } from '@/components/sections/shared/PageHero';
import { SceneFrame } from '@/components/sections/shared/SceneFrame';
import { SceneImage } from '@/components/three/SceneImage';
import type { Feature } from '@/components/ui/FeatureGrid';
import { CommuteWeek } from '@/components/visuals/CommunityPreviews';
import { faq } from '@/data/faq';
import { driverSteps } from '@/data/features';
import { ctaLinks } from '@/data/navigation';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Offer a ride',
  description:
    'Turn empty seats into shared journeys. Publish a trip you are already making, meet verified travellers and share fuel and toll costs with Sahyatri.',
  path: '/drivers',
});

const control: Feature[] = [
  { icon: 'user-check', title: 'Approve or instant-book', description: 'Review each request, or let verified travellers book instantly.' },
  { icon: 'sparkles', title: 'Set your preferences', description: 'Quiet or chatty, music, luggage, pets — say how you like to travel.' },
  { icon: 'shield-check', title: 'Women-only rides', description: 'Offer seats only to women travellers when you choose to.' },
  { icon: 'repeat', title: 'Recurring routes', description: 'Publish your weekday commute once and it repeats automatically.' },
  { icon: 'lock', title: 'Private details stay private', description: 'Your number stays hidden; exact pickup is shared only with booked travellers.' },
  { icon: 'star', title: 'Two-way ratings', description: 'You rate passengers too, so the whole community stays accountable.' },
];

const requirements: Feature[] = [
  { icon: 'fingerprint', title: 'A verified identity', description: 'Government ID and a live selfie, checked once.' },
  { icon: 'badge-check', title: 'A valid driving licence', description: 'Verified before your first published trip.' },
  { icon: 'car', title: 'A registered, insured vehicle', description: 'The car you will actually drive, with its registration confirmed.' },
];

export default function DriversPage() {
  const questions = faq.filter((item) =>
    ['How are drivers verified?', 'How are vehicles verified?', 'How does payment work?', 'What happens if a passenger cancels?', 'Can I create recurring rides?'].includes(item.question),
  );
  return (
    <>
      <PageHero
        eyebrow="For drivers"
        title="Turn empty seats into shared journeys."
        lead="You are making the trip anyway. Offer the seats you are not using to verified people going your way, and share what the journey costs."
        path="/drivers"
        primary={ctaLinks.earlyAccess}
        secondary={ctaLinks.howItWorks}
        layout="wide"
        visual={
          <SceneFrame
            scene="seats"
            sceneProps={{}}
            minTier="high"
            size="tall"
            fallback={<SceneImage name="seats" priority />}
            label="Illustration: a car on its published route with three empty seats, filled one by one by nearby matched travellers."
          />
        }
      />
      <FeatureSplit
        id="how-it-works-drivers"
        eyebrow="Five steps"
        title="From published route to shared trip."
        lead="Publishing a trip takes about a minute. Sahyatri does the matching; you decide who travels with you."
        steps={driverSteps}
        visual={<CommuteWeek />}
      />
      <FeatureSection id="control" eyebrow="You stay in control" title="Your car, your rules." features={control} surface="subtle" />
      <FeatureSection
        id="cost-sharing"
        eyebrow="Cost sharing"
        title="Share costs, not a fare."
        lead="Suggested contributions are based on distance, fuel and tolls, so seats cover the cost of the journey rather than turning it into a taxi service. Passengers pay in the app; you receive your share after the trip."
      />
      <FeatureSection id="requirements" eyebrow="Before your first trip" title="What you need to drive." features={requirements} surface="subtle" />
      <FaqSection items={questions} title="Driver questions." />
      <CtaBand
        title="Your next trip could be shared."
        primary={ctaLinks.earlyAccess}
        secondary={{ label: 'Read about safety', href: '/safety' }}
      />
    </>
  );
}
