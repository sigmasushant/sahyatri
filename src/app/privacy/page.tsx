import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, type LegalSection } from '@/components/sections/legal/LegalPage';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy',
  description: 'How Sahyatri collects, uses, shares and protects personal data, including location data and cookies.',
  path: '/privacy',
});

const sections: LegalSection[] = [
  {
    id: 'summary',
    title: 'Summary',
    body: (
      <>
        <p>
          We collect the information needed to match you with trusted rides, keep trips safe and process payments. We
          do not sell personal data, and we do not use it for third-party advertising.
        </p>
        <p>
          This policy is written to meet applicable data protection law, including India’s Digital Personal Data
          Protection Act, 2023.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    body: (
      <ul>
        <li>
          <strong>Account details:</strong> name, phone number, email address and profile photo.
        </li>
        <li>
          <strong>Verification:</strong> government ID and selfie checks, and for drivers their licence and vehicle
          registration. Verification may be performed with a specialist provider.
        </li>
        <li>
          <strong>Trips:</strong> routes, times, bookings, ratings and messages with co-travellers.
        </li>
        <li>
          <strong>Location:</strong> used to find matches and during active trips.
        </li>
        <li>
          <strong>Payments:</strong> handled by a regulated payment partner. We never store full card details.
        </li>
      </ul>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How we use it',
    body: (
      <ul>
        <li>To match passengers and drivers and to operate bookings and payments.</li>
        <li>To verify identities and vehicles, and to prevent fraud and misuse.</li>
        <li>To provide safety features such as trip sharing, route monitoring, SOS and incident support.</li>
        <li>To improve matching and the service, using data minimised to what each purpose needs.</li>
      </ul>
    ),
  },
  {
    id: 'location',
    title: 'Location data',
    body: (
      <p>
        Precise location is used for matching and during active trips. Exact pickup points are shared only with the
        people you are travelling with, and trip-sharing links expire when the trip ends. You can review location
        permissions in your device settings at any time.
      </p>
    ),
  },
  {
    id: 'sharing',
    title: 'Who we share it with',
    body: (
      <ul>
        <li>Your co-travellers see the profile and trip details needed to travel together.</li>
        <li>Trusted contacts you choose see trips you share with them.</li>
        <li>Service providers (for example payments, verification and hosting) process data on our instructions.</li>
        <li>Authorities, where the law requires it or where someone’s safety is at risk.</li>
      </ul>
    ),
  },
  {
    id: 'retention',
    title: 'Retention and security',
    body: (
      <p>
        We keep personal data only as long as needed for the purposes above and legal obligations. Data is encrypted in
        transit, sensitive data is encrypted at rest, and staff access is limited by role and logged.
      </p>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <p>
        You can access, correct and delete your personal data, withdraw consent, and raise a grievance. To make a
        request, <Link href="/contact?topic=support">contact us</Link>.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and local storage',
    body: (
      <>
        <p>
          This website uses only what it needs to work: essential storage for things like remembering a form you have
          started. We do not use advertising or cross-site tracking cookies.
        </p>
        <p>If we introduce analytics, we will update this section and ask for consent where required.</p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        Questions about privacy? <Link href="/contact?topic=support">Send us a message</Link> and choose “Help with a trip
        or account”.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy policy"
      lead="How we collect, use and protect your information — written to be read, not skimmed past."
      path="/privacy"
      sections={sections}
    />
  );
}
