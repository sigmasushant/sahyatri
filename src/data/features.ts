import type { Feature } from '@/components/ui/FeatureGrid';
import type { TechnologyMode } from '@/components/three/lib/layouts';
import type { IconName } from '@/components/ui/Icon';

/* Content shared by the homepage and the product pages, so claims stay consistent everywhere. */

export const safetyFeatures: Feature[] = [
  { icon: 'scan-face', title: 'Identity verification', description: 'Government ID and a live selfie for everyone who travels.' },
  { icon: 'car', title: 'Vehicle verification', description: 'Registration checked; make, colour and plate shown before you book.' },
  { icon: 'key', title: 'Trip PIN', description: 'A one-time PIN at pickup confirms the right person and the right car.' },
  { icon: 'share', title: 'Live trip sharing', description: 'Trusted contacts follow your trip in real time, until you arrive.' },
  { icon: 'siren', title: 'SOS', description: 'One tap alerts your contacts and our incident team with your location.' },
  { icon: 'radar', title: 'Route monitoring', description: 'Unexpected stops or detours prompt a check-in with you.' },
  { icon: 'users', title: 'Trusted contacts', description: 'Choose who is kept in the loop for every trip automatically.' },
  { icon: 'headset', title: 'Incident support', description: 'A dedicated team to help during and after a trip if something goes wrong.' },
];

export const driverSteps: Feature[] = [
  { icon: 'route', title: 'Publish your route', description: 'Add a trip you are already making, one-off or recurring, in under a minute.' },
  { icon: 'armchair', title: 'Choose your seats', description: 'Decide how many seats to offer and whether to approve each request.' },
  { icon: 'user-check', title: 'Meet verified travellers', description: 'Every passenger is verified, with ratings and reliability you can see.' },
  { icon: 'wallet', title: 'Share costs', description: 'Fuel and tolls are split fairly and paid in the app. No cash, no haggling.' },
  { icon: 'star', title: 'Build your reputation', description: 'Reliable trips and good reviews help the right people choose your car.' },
];

export const passengerSteps: Feature[] = [
  { icon: 'search', title: 'Search', description: 'Enter where and when. See drivers already heading your way.' },
  { icon: 'sparkles', title: 'Match', description: 'Rides are ranked by how well they fit, with the reasons shown.' },
  { icon: 'calendar', title: 'Book', description: 'Instant booking or a quick request, depending on the driver.' },
  { icon: 'credit-card', title: 'Pay', description: 'Your share is paid securely in the app when you book.' },
  { icon: 'route', title: 'Travel', description: 'Trip PIN at pickup, live sharing on the way, a rating at the end.' },
];

export const commuteFeatures: Feature[] = [
  { icon: 'repeat', title: 'Recurring rides', description: 'Set your weekly route once and skip days when plans change.' },
  { icon: 'sparkles', title: 'Automatic matching', description: 'New matches are suggested as people join your route.' },
  { icon: 'clock', title: 'Predictable commuting', description: 'The same pickup, the same time, the same trusted people.' },
  { icon: 'users', title: 'Trusted communities', description: 'Commute with colleagues or neighbours from verified networks.' },
];

export const businessFeatures: Feature[] = [
  { icon: 'badge-check', title: 'Employee verification', description: 'Members join with a verified work email, so everyone is a colleague.' },
  { icon: 'lock', title: 'Private mobility communities', description: 'Rides visible only to your people, by site or team.' },
  { icon: 'repeat', title: 'Recurring routes', description: 'Commute matching around shifts, offices and campuses.' },
  { icon: 'wallet', title: 'Subsidised rides', description: 'Contribute to employee trips with rules you set.' },
  { icon: 'receipt', title: 'Corporate billing', description: 'One consolidated invoice instead of expense claims.' },
  { icon: 'chart', title: 'Analytics', description: 'Aggregated usage and shared-trip reporting, without tracking individuals.' },
];

export const universityFeatures: Feature[] = [
  { icon: 'graduation-cap', title: 'Student verification', description: 'Access limited to verified students and staff.' },
  { icon: 'map-pin', title: 'Campus pickup points', description: 'Shared, well-lit pickup points agreed with your campus.' },
  { icon: 'users', title: 'Student communities', description: 'Private groups for hostels, departments and clubs.' },
  { icon: 'repeat', title: 'Recurring commuting', description: 'Daily rides between campus, home and city centres.' },
  { icon: 'shield-check', title: 'Safety controls', description: 'Women-only ride options, trusted contacts and live trip sharing by default.' },
];

export const securityFeatures: Feature[] = [
  { icon: 'fingerprint', title: 'Secure authentication', description: 'Phone verification and device checks protect every account.' },
  { icon: 'lock-keyhole', title: 'Encrypted communication', description: 'Data is encrypted in transit, and sensitive data at rest.' },
  { icon: 'credit-card', title: 'Protected payments', description: 'Payments run through a regulated partner; we never store full card details.' },
  { icon: 'map-pinned', title: 'Privacy-conscious location', description: 'Location is used for matching and live trips, and shared only with your co-travellers.' },
  { icon: 'shield-alert', title: 'Fraud detection', description: 'Automated signals and human review flag suspicious accounts and payments.' },
  { icon: 'user-cog', title: 'Audited administrative access', description: 'Staff access is limited by role and every sensitive action is logged.' },
];

export interface Technology {
  mode: TechnologyMode;
  icon: IconName;
  title: string;
  description: string;
}

export const technologies: Technology[] = [
  {
    mode: 'matching',
    icon: 'sparkles',
    title: 'AI Matching',
    description: 'Scores every possible ride on route overlap, timing, pickup convenience and preferences, then explains the match.',
  },
  {
    mode: 'verification',
    icon: 'badge-check',
    title: 'Trust & Verification',
    description: 'Layered checks for people and vehicles, and a reputation that builds with every completed trip.',
  },
  {
    mode: 'safety',
    icon: 'shield-check',
    title: 'Safety Intelligence',
    description: 'Watches live trips for unusual stops or detours and brings help closer when it is needed.',
  },
  {
    mode: 'realtime',
    icon: 'activity',
    title: 'Real-Time Mobility',
    description: 'Live location, ETAs and trip status, shared instantly with the people who need them.',
  },
  {
    mode: 'fraud',
    icon: 'shield-alert',
    title: 'Fraud Protection',
    description: 'Spots fake accounts, payment abuse and unusual patterns early, and isolates them from the network.',
  },
];
