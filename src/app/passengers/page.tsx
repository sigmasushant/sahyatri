import type { Metadata } from 'next';
import { FaqSection } from '@/components/sections/home/FaqSection';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { FeatureSection } from '@/components/sections/shared/FeatureSection';
import { FeatureSplit } from '@/components/sections/shared/FeatureSplit';
import { PageHero } from '@/components/sections/shared/PageHero';
import type { Feature } from '@/components/ui/FeatureGrid';
import { CommuteWeek } from '@/components/visuals/CommunityPreviews';
import { MatchListPreview, SearchPreview } from '@/components/visuals/RidePreviews';
import { faq } from '@/data/faq';
import { commuteFeatures, passengerSteps } from '@/data/features';
import { ctaLinks } from '@/data/navigation';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Find a ride',
  description:
    'Find trusted rides with verified drivers already heading your way. Search, match, book, pay and travel together with Sahyatri.',
  path: '/passengers',
});

const beforeYouBook: Feature[] = [
  { icon: 'user-check', title: 'Who is driving', description: 'Verification status, ratings, reliability and how long they have been travelling with us.' },
  { icon: 'car', title: 'The car', description: 'Make, colour and number plate, so you can recognise it at pickup.' },
  { icon: 'map-pin', title: 'Where to meet', description: 'The pickup point and walking distance from where you searched.' },
  { icon: 'sparkles', title: 'Why it fits', description: 'The reasons behind every match, not just a score.' },
  { icon: 'receipt', title: 'Your cost share', description: 'What your seat costs, shown before you confirm anything.' },
  { icon: 'users', title: 'Who else is travelling', description: 'Other verified passengers already booked on the trip.' },
];

export default function PassengersPage() {
  const questions = faq.filter((item) =>
    ['How does carpooling work?', 'How does payment work?', 'What happens if a driver cancels?', 'How does trip sharing work?', 'How is my location protected?'].includes(item.question),
  );
  return (
    <>
      <PageHero
        eyebrow="For passengers"
        title="Your destination. A smarter way to get there."
        lead="Ride with verified drivers who are already heading your way — comfortable, affordable, and safer by design."
        path="/passengers"
        primary={ctaLinks.earlyAccess}
        secondary={ctaLinks.howItWorks}
        visual={<MatchListPreview />}
      />
      <FeatureSplit
        id="journey"
        eyebrow="Five steps"
        title="Search. Match. Book. Pay. Travel."
        lead="Tell us where and when. We find the rides that fit; you choose the one you like."
        steps={passengerSteps}
        visual={<SearchPreview />}
      />
      <FeatureSection
        id="before-you-book"
        eyebrow="Before you book"
        title="Everything you need to decide."
        features={beforeYouBook}
        surface="subtle"
      />
      <FeatureSplit
        id="commute"
        eyebrow="Recurring rides"
        title="Make your daily commute work harder."
        lead="Set your regular route once. Sahyatri finds people making the same trip and keeps your week organised."
        features={commuteFeatures}
        visual={<CommuteWeek />}
        reverse
      />
      <FaqSection items={questions} title="Passenger questions." />
      <CtaBand title="Your next ride is already on its way." />
    </>
  );
}
