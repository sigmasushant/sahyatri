import type { Metadata } from 'next';
import { ContactSection } from '@/components/sections/shared/ContactSection';
import { FeatureSection } from '@/components/sections/shared/FeatureSection';
import { FeatureSplit } from '@/components/sections/shared/FeatureSplit';
import { PageHero } from '@/components/sections/shared/PageHero';
import type { Feature } from '@/components/ui/FeatureGrid';
import { CommuteWeek, OrgFlow } from '@/components/visuals/CommunityPreviews';
import { businessFeatures } from '@/data/features';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Corporate mobility',
  description:
    'A private, verified carpooling network for your employees, with commute matching, subsidised rides, corporate billing and privacy-aware reporting.',
  path: '/business',
});

const rollout: Feature[] = [
  { icon: 'messages', title: 'Talk to us', description: 'We learn about your sites, shifts and commuting patterns.' },
  { icon: 'building', title: 'Set up your community', description: 'A private network for your company, with the rules and subsidies you choose.' },
  { icon: 'users', title: 'Invite your people', description: 'Employees join with their verified work email in a few minutes.' },
  { icon: 'chart', title: 'Launch and learn', description: 'Aggregated reporting shows adoption and shared trips over time.' },
];

const principles: Feature[] = [
  { icon: 'eye', title: 'No individual tracking', description: 'Employers see aggregated usage, never an individual employee’s trips or location.' },
  { icon: 'lock', title: 'Employee-owned accounts', description: 'People control their own profile and can leave a company community at any time.' },
  { icon: 'shield-check', title: 'Same safety for everyone', description: 'Every company trip has the full safety toolkit: trip PIN, live sharing, SOS.' },
];

export default function BusinessPage() {
  return (
    <>
      <PageHero
        eyebrow="For Business"
        title="Mobility for teams that move."
        lead="Give employees a private, verified way to share their commute — with the controls, billing and reporting a company needs."
        path="/business"
        primary={{ label: 'Talk to our team', href: '#contact' }}
        secondary={{ label: 'How it works', href: '/how-it-works' }}
        visual={<OrgFlow />}
      />
      <FeatureSection id="features" eyebrow="The platform" title="Built for company commuting." features={businessFeatures} variant="card" />
      <FeatureSplit
        id="rollout"
        eyebrow="Getting started"
        title="Up and running in four steps."
        lead="We work with your facilities, HR and security teams to set up a network that fits how your people actually travel."
        steps={rollout}
        visual={<CommuteWeek />}
        surface="subtle"
        reverse
      />
      <FeatureSection id="privacy" eyebrow="Privacy by design" title="Useful to employers. Respectful of employees." features={principles} />
      <ContactSection
        title="Explore business mobility."
        lead="Tell us about your organisation and we will get back to you to discuss a pilot."
        topic="business"
      />
    </>
  );
}
