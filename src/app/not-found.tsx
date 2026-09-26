import type { Metadata } from 'next';
import { StatusScreen } from '@/components/layout/StatusScreen';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="Looks like you took a wrong turn."
      text="Let’s get you back on the road. The page you were looking for has moved, or never existed."
      actions={
        <>
          <Button href="/" size="lg" arrow>
            Return home
          </Button>
          <Button href="/help" size="lg" variant="secondary">
            Visit the help centre
          </Button>
        </>
      }
    />
  );
}
