import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, type LegalSection } from '@/components/sections/legal/LegalPage';
import { siteConfig } from '@/config/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Terms',
  description: 'The terms that apply when you use Sahyatri to share rides as a passenger or a driver.',
  path: '/terms',
});

const sections: LegalSection[] = [
  {
    id: 'about',
    title: 'About Sahyatri',
    body: (
      <p>
        Sahyatri is a platform that connects people who are making the same journey so they can share a car and its
        costs. Sahyatri does not provide transport services, and drivers are not employees or contractors of Sahyatri.
      </p>
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility and accounts',
    body: (
      <ul>
        <li>You must be at least 18 years old to create an account.</li>
        <li>You must provide accurate information and complete the verification steps we require.</li>
        <li>You are responsible for keeping access to your account secure.</li>
      </ul>
    ),
  },
  {
    id: 'cost-sharing',
    title: 'Cost sharing',
    body: (
      <p>
        Contributions cover the costs of a journey, such as fuel and tolls. Drivers may not use Sahyatri to make a
        profit or to operate a commercial transport service.
      </p>
    ),
  },
  {
    id: 'bookings',
    title: 'Bookings, payments and cancellations',
    body: (
      <ul>
        <li>Passengers pay their contribution in the app when booking, through our payment partner.</li>
        <li>Cancellation and refund rules are shown before you confirm a booking.</li>
        <li>Repeated late cancellations or no-shows may limit your use of the platform.</li>
      </ul>
    ),
  },
  {
    id: 'conduct',
    title: 'Community standards',
    body: (
      <ul>
        <li>Treat co-travellers with respect. Harassment and discrimination are not tolerated.</li>
        <li>Drivers must hold a valid licence, drive a registered and insured vehicle, and follow traffic law.</li>
        <li>Do not use the platform for anything unlawful or unsafe.</li>
      </ul>
    ),
  },
  {
    id: 'safety',
    title: 'Safety',
    body: (
      <p>
        Safety features help you get help, but they do not replace emergency services. In an emergency, always call{' '}
        {siteConfig.emergencyNumber}. Report any safety concern through the app or our{' '}
        <Link href="/contact?topic=safety">contact form</Link>.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Liability',
    body: (
      <p>
        To be completed with legal counsel: the extent of Sahyatri’s liability as a platform, and the limits that apply
        under Indian law.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes and governing law',
    body: (
      <p>
        We will tell you about material changes to these terms before they take effect. These terms will be governed
        by the laws of India.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of use"
      lead="The agreement between you and Sahyatri when you share rides as a passenger or a driver."
      path="/terms"
      sections={sections}
    />
  );
}
