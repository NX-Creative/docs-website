import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const withMDX = createMDX();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Pin the file-tracing root to this project so Next.js doesn't climb up
  // the filesystem looking for another lockfile.
  outputFileTracingRoot: __dirname,
  // Cloudflare Pages serves the `out/` directory as static HTML.
  // Nothing below should introduce a server runtime.
};

export default withMDX(config);
