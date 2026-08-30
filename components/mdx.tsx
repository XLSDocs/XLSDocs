import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { TryIt } from './try-it';
import { TryItHeading } from './try-it-heading';
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
    TryIt,
    TryItHeading,
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
