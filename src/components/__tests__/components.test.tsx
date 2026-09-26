import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EarlyAccessForm } from '@/components/forms/EarlyAccessForm';
import { Testimonials } from '@/components/sections/home/Testimonials';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { testimonials } from '@/data/testimonials';

describe('Accordion', () => {
  const items = [
    { question: 'How does SOS work?', answer: 'It alerts your trusted contacts.' },
    { question: 'Can I create recurring rides?', answer: 'Yes, set your route once.' },
  ];

  it('is a set of labelled disclosure buttons, closed by default', () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByRole('button', { name: 'How does SOS work?' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('opens with the keyboard and moves focus with arrow keys', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.tab();
    const first = screen.getByRole('button', { name: 'How does SOS work?' });
    expect(first).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('It alerts your trusted contacts.')).toBeVisible();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Can I create recurring rides?' })).toHaveFocus();
  });
});

describe('Testimonials', () => {
  it('ships with no fabricated testimonials', () => {
    expect(testimonials).toEqual([]);
  });

  it('shows an honest empty state instead of placeholder quotes', () => {
    render(<Testimonials />);
    expect(screen.getByTestId('stories-empty')).toHaveTextContent(/only ever publish real experiences/i);
    expect(screen.queryByRole('blockquote')).not.toBeInTheDocument();
  });

  it('renders real testimonials when they are added', () => {
    render(<Testimonials items={[{ quote: 'Great ride.', name: 'A. Person', context: 'Commuter', role: 'passenger' }]} />);
    expect(screen.getByText('Great ride.')).toBeInTheDocument();
    expect(screen.queryByTestId('stories-empty')).not.toBeInTheDocument();
  });
});

describe('Button', () => {
  it('renders internal links, external links and buttons with the right semantics', () => {
    render(
      <>
        <Button href="/safety">Safety</Button>
        <Button href="https://example.com">Partner</Button>
        <Button onClick={() => {}}>Replay</Button>
      </>,
    );
    expect(screen.getByRole('link', { name: 'Safety' })).toHaveAttribute('href', '/safety');
    const external = screen.getByRole('link', { name: /Partner/ });
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
    expect(external).toHaveAccessibleName(/opens in a new tab/);
    expect(screen.getByRole('button', { name: 'Replay' })).toHaveAttribute('type', 'button');
  });
});

describe('EarlyAccessForm', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows inline errors and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    render(<EarlyAccessForm />);
    await user.click(screen.getByRole('button', { name: /join the network/i }));
    const email = await screen.findByLabelText('Email address');
    await waitFor(() => expect(email).toHaveFocus());
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter your email address.')).toBeInTheDocument();
    expect(screen.getByText('Choose how you plan to use Sahyatri.')).toBeInTheDocument();
  });

  it('submits valid details and confirms', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    render(<EarlyAccessForm />);
    await user.type(screen.getByLabelText('Email address'), 'asha@example.com');
    await user.click(screen.getByRole('radio', { name: 'Offer rides' }));
    await user.click(screen.getByRole('button', { name: /join the network/i }));
    expect(await screen.findByRole('status')).toHaveTextContent(/you’re on the list/i);
    expect(JSON.parse(fetchMock.mock.calls[0]![1].body)).toMatchObject({ email: 'asha@example.com', role: 'driver' });
  });

  it('explains network failures without losing what was typed', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    render(<EarlyAccessForm />);
    await user.type(screen.getByLabelText('Email address'), 'asha@example.com');
    await user.click(screen.getByRole('radio', { name: 'Both' }));
    await user.click(screen.getByRole('button', { name: /join the network/i }));
    expect(await screen.findByText(/couldn’t reach our servers/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toHaveValue('asha@example.com');
  });
});
