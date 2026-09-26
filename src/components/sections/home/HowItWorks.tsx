import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { MatchListPreview, SearchPreview, TogetherPreview } from '@/components/visuals/RidePreviews';
import { ctaLinks } from '@/data/navigation';
import { StepScroller } from './StepScroller';
import styles from './HowItWorks.module.css';

const steps = [
  {
    title: 'Find your route.',
    text: 'Tell us where you are going and when. Sahyatri looks for drivers already heading your way — not just the ones closest to you.',
  },
  {
    title: 'Choose a trusted match.',
    text: 'Compare verified drivers, pickup points and timing, with a clear reason why each ride fits. Book the one that suits you.',
  },
  {
    title: 'Move together.',
    text: 'Confirm your trip PIN at pickup, share your trip live with people you trust, and split fuel and toll costs automatically.',
  },
];

export function HowItWorks() {
  return (
    <Section tone="light" id="how-it-works" aria-labelledby="how-title">
      <Container>
        <div className={styles.header}>
          <SectionIntro
            eyebrow="How it works"
            title="Three steps from search to shared journey."
            titleId="how-title"
          />
          <Button href={ctaLinks.howItWorks.href} variant="secondary" arrow>
            See the full guide
          </Button>
        </div>
        <StepScroller steps={steps} visuals={[<SearchPreview key="1" />, <MatchListPreview key="2" />, <TogetherPreview key="3" />]} />
      </Container>
    </Section>
  );
}
