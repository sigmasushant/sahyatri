import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Links that open in a new tab must not leak window.opener.
      'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // The WebGL layer is imperative by design: three.js objects, buffers and uniforms are
    // created once and mutated every frame inside useFrame, outside React rendering (the
    // pattern react-three-fiber recommends). The React Compiler purity rules do not apply here.
    files: ['src/components/three/**/*.{ts,tsx}'],
    rules: {
      'react/no-unknown-property': 'off',
      'react-hooks/immutability': 'off',
    },
  },
  {
    // Command-line tooling reports progress on stdout.
    files: ['scripts/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**']),
]);
