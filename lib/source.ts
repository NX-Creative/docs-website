import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';

/*
 * fumadocs-mdx 11.x returns `source.files` as a lazy function, while
 * fumadocs-core 15.x expects `source.files` to be an array. Bridge the
 * two by invoking the function once at module load and re-wrapping the
 * result so it still matches the Source<...> type contract.
 */
const mdxSource = docs.toFumadocsSource();
const filesArray =
  typeof (mdxSource as unknown as { files: unknown }).files === 'function'
    ? ((mdxSource as unknown as { files: () => unknown[] }).files)()
    : ((mdxSource as unknown as { files: unknown[] }).files);

const normalizedSource = {
  ...mdxSource,
  files: filesArray,
} as unknown as typeof mdxSource;

export const source = loader({
  baseUrl: '/docs',
  source: normalizedSource,
});
