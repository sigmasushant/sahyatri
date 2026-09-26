import type { Metadata } from 'next';
import { ContactSection } from '@/components/sections/shared/ContactSection';
import { FeatureSection } from '@/components/sections/shared/FeatureSection';
import { FeatureSplit } from '@/components/sections/shared/FeatureSplit';
import { PageHero } from '@/components/sections/shared/PageHero';
import type { Feature } from '@/components/ui/FeatureGrid';
import { CampusMap, CommuteWeek } from '@/components/visuals/CommunityPreviews';
import { universityFeatures } from '@/data/features';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Universities',
  description:
    'Safe, affordable shared rides for verified students and staff, with campus pickup points, private communities and safety controls.',
  path: '/universities',
});

const rollout: Feature[] = [
  { icon: 'messages', title: 'Start a conversation', description: 'We meet your student services and security teams.' },
  { icon: 'map-pin', title: 'Agree pickup points', description: 'Shared, well-lit points at gates, libraries and hostels.' },
  { icon: 'graduation-cap', title: 'Verify your community', description: 'Students and staff join with their institutional email.' },
  { icon: 'repeat', title: 'Launch before term', description: 'Recurring routes for daily commutes and weekend trips home.' },
];

const reasons: Feature[] = [
  { icon: 'wallet', title: 'Affordable for students', description: 'Shared costs make daily travel and trips home cheaper.' },
  { icon: 'shield-check', title: 'Safer late journeys', description: 'Verified peers, trip sharing and SOS on every ride.' },
  { icon: 'leaf', title: 'Fewer cars on campus', description: 'Full seats mean fewer single-occupancy vehicles and less parking pressure.' },
];

export default function UniversitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="For Universities"
        title="Better mobility for campus communities."
        lead="Safe, affordable rides between campus, home and the city — shared only with verified students and staff."
        path="/universities"
        primary={{ label: 'Talk to our team', href: '#contact' }}
        secondary={{ label: 'Safety', href: '/safety' }}
        visual={<CampusMap />}
      />
      <FeatureSection id="features" eyebrow="For your campus" title="A private network for your community." features={universityFeatures} variant="card" />
      <FeatureSection id="why" eyebrow="Why it matters" title="Good for students. Good for campus." features={reasons} surface="subtle" />
      <FeatureSplit
        id="rollout"
        eyebrow="Getting started"
        title="Ready for the start of term."
        lead="We set up your campus community with you, so it feels like part of student life from day one."
        steps={rollout}
        visual={<CommuteWeek />}
      />
      <ContactSection
        title="Bring Sahyatri to your campus."
        lead="Tell us about your university and we will get in touch to plan a pilot."
        topic="universities"
      />
    </>
  );
}
