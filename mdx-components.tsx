import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  DependencyList,
  ConfigOption,
  ExportSignature,
  FrameworkTabs,
  FrameworkTab,
  CommandReference,
  SupportChannels,
} from '@/components/fivem';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    DependencyList,
    ConfigOption,
    ExportSignature,
    FrameworkTabs,
    FrameworkTab,
    CommandReference,
    SupportChannels,
    ...components,
  };
}

// Next.js MDX convention.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
