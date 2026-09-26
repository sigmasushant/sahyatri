export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  /** Homepage section that corresponds to this item, for the active-section indicator. */
  sectionId?: string;
  children?: NavLink[];
}

export const primaryNav: NavItem[] = [
  {
    label: 'Product',
    sectionId: 'product',
    children: [
      { label: 'For passengers', href: '/passengers', description: 'Find trusted rides that fit your journey.' },
      { label: 'For drivers', href: '/drivers', description: 'Share empty seats and split the costs.' },
      { label: 'Technology', href: '/technology', description: 'The intelligence behind every match.' },
    ],
  },
  { label: 'How it works', href: '/how-it-works', sectionId: 'how-it-works' },
  { label: 'Safety', href: '/safety', sectionId: 'safety' },
  { label: 'For Business', href: '/business', sectionId: 'business' },
  { label: 'For Universities', href: '/universities', sectionId: 'universities' },
  { label: 'About', href: '/about' },
];

export const ctaLinks = {
  getApp: { label: 'Get the app', href: '/#get-the-app' },
  earlyAccess: { label: 'Get early access', href: '/#get-the-app' },
  findRide: { label: 'Find a ride', href: '/passengers' },
  offerSeat: { label: 'Offer a seat', href: '/drivers' },
  offerRide: { label: 'Offer a ride', href: '/drivers' },
  joinNetwork: { label: 'Join the network', href: '/#get-the-app' },
  howItWorks: { label: 'Explore how it works', href: '/how-it-works' },
  login: { label: 'Log in', href: '/login' },
} satisfies Record<string, NavLink>;

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Safety', href: '/safety' },
      { label: 'Technology', href: '/technology' },
      { label: 'For drivers', href: '/drivers' },
      { label: 'For passengers', href: '/passengers' },
    ],
  },
  {
    title: 'Business',
    links: [
      { label: 'Corporate mobility', href: '/business' },
      { label: 'Universities', href: '/universities' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/about#press' },
      { label: 'Contact', href: '/contact' },
      { label: 'Help centre', href: '/help' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/privacy#cookies' },
    ],
  },
];
