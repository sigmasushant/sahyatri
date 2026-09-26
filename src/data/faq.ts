export interface FaqItem {
  question: string;
  answer: string;
  topic: 'basics' | 'safety' | 'payments' | 'trips' | 'privacy' | 'organisations';
}

export const faq: FaqItem[] = [
  {
    topic: 'basics',
    question: 'How does carpooling work?',
    answer:
      'Drivers publish a trip they are already making, with the seats they have free and a cost-sharing contribution. Passengers search their route and Sahyatri suggests rides that fit their route and timing. You book a seat, meet at the agreed pickup point, confirm the trip PIN and travel together. Costs are shared between the people in the car — it is not a taxi fare.',
  },
  {
    topic: 'safety',
    question: 'How are drivers verified?',
    answer:
      'Before offering a ride, drivers verify their phone number, a government-issued photo ID with a live selfie, and their driving licence. Verification status is shown on every profile, alongside ratings and reliability from previous trips.',
  },
  {
    topic: 'safety',
    question: 'How are vehicles verified?',
    answer:
      'Drivers register the vehicle they will drive, and its registration details are checked before it can be listed. You see the make, colour and number plate before you book, so you can confirm the car at pickup together with the trip PIN.',
  },
  {
    topic: 'payments',
    question: 'How does payment work?',
    answer:
      'Passengers pay their share in the app when they book, through a regulated payment partner. The driver receives their share after the trip is completed. There is no cash to handle and no price to negotiate on the day.',
  },
  {
    topic: 'safety',
    question: 'How does trip sharing work?',
    answer:
      'From any active trip you can share a live link with trusted contacts. They can follow the route and estimated arrival in real time, without installing the app. The link stops working when the trip ends.',
  },
  {
    topic: 'trips',
    question: 'What happens if a driver cancels?',
    answer:
      'You are notified straight away and refunded in full for that trip. Sahyatri then suggests the next best matches for your route and time. Cancellations are reflected in a driver’s reliability score.',
  },
  {
    topic: 'trips',
    question: 'What happens if a passenger cancels?',
    answer:
      'You can cancel from the trip screen. How much is refunded depends on how close to departure you cancel, and the exact rules are shown before you book. Late cancellations are reflected in a passenger’s reliability score, because the driver kept a seat for you.',
  },
  {
    topic: 'safety',
    question: 'How does SOS work?',
    answer:
      'During a trip, SOS is always one tap away. It alerts your trusted contacts with your live location and connects you with our incident support team. Sahyatri helps you get help, but it does not replace emergency services — in an emergency, always call 112.',
  },
  {
    topic: 'privacy',
    question: 'How is my location protected?',
    answer:
      'Location is used to find matches and during active trips. Exact pickup points are shared only with the people you are travelling with, trip-sharing links expire when the trip ends, and you can review or change location permissions at any time.',
  },
  {
    topic: 'trips',
    question: 'Can I create recurring rides?',
    answer:
      'Yes. Set up a regular route once — for example your weekday commute — and Sahyatri matches you with people making the same trip each week. You can confirm or skip individual days.',
  },
  {
    topic: 'organisations',
    question: 'Can businesses use the platform?',
    answer:
      'Yes. Companies can run a private, verified mobility community for their employees, with commute matching, optional ride subsidies and consolidated billing. Get in touch through the For Business page.',
  },
  {
    topic: 'organisations',
    question: 'Can universities create private communities?',
    answer:
      'Yes. Universities can create communities limited to verified students and staff, with campus pickup points and safety controls suited to campus life. Get in touch through the For Universities page.',
  },
];
