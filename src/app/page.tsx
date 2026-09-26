import type { Metadata } from 'next';
import { FeatureSplit } from '@/components/sections/shared/FeatureSplit';
import { AudienceSplit } from '@/components/sections/home/AudienceSplit';
import { FaqSection } from '@/components/sections/home/FaqSection';
import { GetTheApp } from '@/components/sections/home/GetTheApp';
import { Hero } from '@/components/sections/home/Hero';
import { HowItWorks } from '@/components/sections/home/HowItWorks';
import { LiveTripSection } from '@/components/sections/home/LiveTripSection';
import { MatchingSection } from '@/components/sections/home/MatchingSection';
import { NetworkSection } from '@/components/sections/home/NetworkSection';
import { ProductIntro } from '@/components/sections/home/ProductIntro';
import { SafetySection } from '@/components/sections/home/SafetySection';
import { SecuritySection } from '@/components/sections/home/SecuritySection';
import { TechnologySection } from '@/components/sections/home/TechnologySection';
import { Testimonials } from '@/components/sections/home/Testimonials';
import { TrustStrip } from '@/components/sections/home/TrustStrip';
import { CampusMap, CommuteWeek, OrgFlow } from '@/components/visuals/CommunityPreviews';
import { siteConfig } from '@/config/site';
import { businessFeatures, commuteFeatures, universityFeatures } from '@/data/features';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: `${siteConfig.title} | ${siteConfig.name}`,
  absoluteTitle: true,
  description: siteConfig.description,
  path: '/',
});

/**
 * The homepage narrative: arrive → understand → explore → trust → see the technology →
 * imagine yourself using it → convert.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProductIntro />
      <MatchingSection />
      <HowItWorks />
      <SafetySection />
      <LiveTripSection />
      <AudienceSplit />
      <FeatureSplit
        id="commute"
        eyebrow="Recurring rides"
        title="Make your daily commute work harder."
        lead="Set your regular route once. Sahyatri finds people making the same trip and keeps your week organised."
        features={commuteFeatures}
        visual={<CommuteWeek />}
        surface="subtle"
      />
      <FeatureSplit
        id="business"
        eyebrow="For Business"
        title="Mobility for teams that move."
        lead="Give employees a private, verified way to share their commute — with the controls, billing and reporting a company needs."
        features={businessFeatures}
        cta={{ label: 'Explore business mobility', href: '/business' }}
        visual={<OrgFlow />}
        reverse
      />
      <FeatureSplit
        id="universities"
        eyebrow="For Universities"
        title="Better mobility for campus communities."
        lead="Safe, affordable rides between campus, home and the city, shared only with verified students and staff."
        features={universityFeatures}
        cta={{ label: 'For universities', href: '/universities' }}
        visual={<CampusMap />}
        surface="subtle"
      />
      <NetworkSection />
      <TechnologySection />
      <SecuritySection />
      <Testimonials />
      <FaqSection />
      <GetTheApp />
    </>
  );
}
