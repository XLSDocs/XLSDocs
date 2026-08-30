import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { FlaskConical } from 'lucide-react';
import { TryIt } from './try-it';
import { ExcelCode } from './excel-code';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { FunctionNav } from './function-nav';
import { ExampleCard } from './example-card';
import { Compatibility } from './compatibility';
import { Faq } from './faq';
import { QuickAnswer } from './quick-answer';
import { ParametersTable } from './parameters-table';
import { CodeWrapToggle } from './code-wrap-toggle';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    pre: (props: ComponentProps<'pre'>) => (
      <CodeWrapToggle>
        <defaultMdxComponents.pre {...props} />
      </CodeWrapToggle>
    ),
    // The "## Try it" heading stays literal markdown (not a custom
    // component) on purpose — fumadocs' remark-heading plugin builds the
    // right-side "On this page" TOC by scanning the raw MDX source for
    // real heading AST nodes, which a JSX component call never produces.
    // A custom TryItHeading component looked identical on the page but
    // silently vanished from the TOC. Overriding h2 here instead adds the
    // icon only when its id is "try-it", while every other heading (and
    // the TOC) passes through fumadocs' own renderer unchanged.
    h2: (props: ComponentProps<'h2'>) =>
      props.id === 'try-it' ? (
        <defaultMdxComponents.h2 {...props}>
          <span className="inline-flex items-center gap-1.5">
            <FlaskConical className="size-[0.85em] text-fd-primary" />
            {props.children}
          </span>
        </defaultMdxComponents.h2>
      ) : (
        <defaultMdxComponents.h2 {...props} />
      ),
    TryIt,
    ExcelCode,
    Tabs,
    Tab,
    Accordion,
    Accordions,
    FunctionNav,
    ExampleCard,
    Compatibility,
    Faq,
    QuickAnswer,
    ParametersTable,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
