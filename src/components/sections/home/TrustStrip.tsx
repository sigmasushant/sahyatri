import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import styles from './TrustStrip.module.css';

const items: { icon: IconName; title: string; text: string }[] = [
  { icon: 'user-check', title: 'Verified people', text: 'ID, phone and live-selfie checks before anyone shares a ride.' },
  { icon: 'car', title: 'Verified vehicles', text: 'Registration details confirmed before a car can be listed.' },
  { icon: 'lock-keyhole', title: 'Secure payments', text: 'Pay in the app through a regulated payment partner. No cash.' },
  { icon: 'radar', title: 'Real-time safety', text: 'Live trip sharing, trip PIN and SOS on every journey.' },
];

export function TrustStrip() {
  return (
    <Section tone="light" spacing="compact">
      <Container>
        <h2 className="visually-hidden">Why people trust Sahyatri</h2>
        <ul role="list" className={styles.list}>
          {items.map((item, index) => (
            <Reveal as="li" key={item.title} index={index} className={styles.item}>
              <Icon name={item.icon} size={24} className={styles.icon} />
              <div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.text}>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
