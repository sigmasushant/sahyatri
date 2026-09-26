import { sceneFallbacks, type SceneFallbackName } from '@/components/three/fallbacks/SceneFallbacks';

/**
 * Static illustrations for every 3D scene, rendered once at build time from the shared scene
 * layouts and design tokens. Served as long-cached SVG files and shown with <img>, so they add
 * nothing to page HTML or JavaScript.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(sceneFallbacks).map((name) => ({ file: `${name}.svg` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = file.replace(/\.svg$/, '') as SceneFallbackName;
  const render = sceneFallbacks[name];
  if (!render || !file.endsWith('.svg')) return new Response('Not found', { status: 404 });

  return new Response(render(), {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
