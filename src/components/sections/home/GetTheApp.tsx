import { Smartphone } from 'lucide-react';
import { EarlyAccessForm } from '@/components/forms/EarlyAccessForm';
import { Container } from '@/components/layout/Container';
import { SceneImage } from '@/components/three/SceneImage';
import { SceneCanvas } from '@/components/three/SceneCanvas';
import { Button } from '@/components/ui/Button';
import { appIsLive, siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';
import styles from './GetTheApp.module.css';

/** Closing call to action. Store buttons appear only once real listings exist in site config. */
export function GetTheApp() {
  return (
    <section data-tone="dark" id="get-the-app" className={styles.section} aria-labelledby="get-app-title">
      <SceneCanvas
        scene="mobility"
        sceneProps={{ variant: 'ambient' }}
        minTier="high"
        fallback={<SceneImage name="ambient" />}
        label="Ambient illustration of the Sahyatri mobility network."
        className={styles.visual}
      />
      <div className={styles.scrim} aria-hidden="true" />
      <Container className={styles.content}>
        <p className={cn('text-eyebrow', styles.eyebrow)}>{appIsLive ? 'Get the app' : 'Early access'}</p>
        <h2 id="get-app-title" className={cn('text-display', styles.title)}>
          Move better. Together.
        </h2>
        <p className={cn('text-body-large', styles.lead)}>
          Build the future of shared mobility with us.{' '}
          {appIsLive
            ? 'Download Sahyatri and take your first shared trip.'
            : 'The app is launching soon on iOS and Android. Join the network and we’ll let you know when it opens near you.'}
        </p>

        <div className={styles.stores}>
          {siteConfig.appStores.ios ? (
            <Button href={siteConfig.appStores.ios} variant="secondary" icon={<Smartphone size={18} />}>
              Get the app for iOS
            </Button>
          ) : null}
          {siteConfig.appStores.android ? (
            <Button href={siteConfig.appStores.android} variant="secondary" icon={<Smartphone size={18} />}>
              Get the app for Android
            </Button>
          ) : null}
          {!appIsLive ? (
            <p className={styles.soon}>
              <Smartphone size={16} aria-hidden="true" /> Get the app: iOS and Android, coming soon
            </p>
          ) : null}
        </div>

        <div className={styles.formCard}>
          <EarlyAccessForm submitLabel="Join the network" />
        </div>
      </Container>
    </section>
  );
}
