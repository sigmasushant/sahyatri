import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';
import { publicRoutes } from '@/data/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return publicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
