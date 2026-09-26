'use client';

import { useEffect } from 'react';
import { StatusScreen } from '@/components/layout/StatusScreen';
import { Button } from '@/components/ui/Button';

/** Runtime error inside a route segment (the "500" state). The header and footer stay usable. */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      code="Something went wrong"
      title="We hit a bump in the road."
      text="Something went wrong on our side while loading this page. Please try again — if it keeps happening, let us know."
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
  );
}
