import type { Metadata } from 'next';
import { EarlyAccessForm } from '@/components/forms/EarlyAccessForm';
import { Container } from '@/components/layout/Container';
import { Section, SectionIntro } from '@/components/layout/Section';
import { PageHero } from '@/components/sections/shared/PageHero';
import { appIsLive } from '@/config/site';
import { pageMetadata } from '@/lib/seo';
import styles from './login.module.css';

export const metadata: Metadata = pageMetadata({
  title: 'Log in',
  description: 'Sahyatri accounts live in the app. Get early access to be among the first to sign in.',
  path: '/login',
  noIndex: true,
});

export default function LoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Log in"
        title="Your account lives in the app."
        lead={
          appIsLive
            ? 'Open the Sahyatri app on your phone to sign in with your mobile number.'
            : 'Sahyatri accounts are created and used in the mobile app, which is launching soon. Join early access and we’ll tell you when you can sign in.'
        }
        path="/login"
        layout="text"
      />
      {!appIsLive ? (
        <Section tone="light" aria-labelledby="login-early-title">
          <Container size="narrow">
            <SectionIntro eyebrow="Early access" title="Be first on the road." titleId="login-early-title" />
            <div className={styles.card}>
              <EarlyAccessForm submitLabel="Get early access" />
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
