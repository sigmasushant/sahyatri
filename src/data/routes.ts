/** Every public page. Used by the sitemap and the end-to-end smoke tests. */
export const publicRoutes = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/how-it-works', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/safety', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/drivers', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/passengers', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/business', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/universities', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/technology', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/help', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
] as const;

/** Reachable but deliberately not indexed. */
export const unlistedRoutes = ['/login'] as const;
