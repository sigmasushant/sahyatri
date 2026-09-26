'use client';

import { useEffect } from 'react';
import { StatusScreen } from '@/components/layout/StatusScreen';
import { Button } from '@/components/ui/Button';
import { createTokenStylesheet } from '@/design-system/css-variables';
import '@/styles/globals.css';

/** Last-resort error boundary: replaces the root layout, so it brings its own document and tokens. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-IN">
      <head>
        <title>Something went wrong | Sahyatri</title>
        <style dangerouslySetInnerHTML={{ __html: createTokenStylesheet() }} />
      </head>
      <body data-tone="dark">
        <main>
          <StatusScreen
            code="500"
            title="We hit a bump in the road."
            text="Something went wrong on our side. Please try again in a moment."
            illustration="roadworks"
            actions={
              <>
                <Button size="lg" arrow onClick={reset}>
                  Try again
                </Button>
                <Button href="/" size="lg" variant="secondary">
                  Return home
                </Button>
              </>
            }
          />
        </main>
      </body>
    </html>
  );
}
