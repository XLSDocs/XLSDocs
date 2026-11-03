import { ConditionalFormatBuilder } from '@/components/tools/conditional-format-builder';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditional Format Formula Builder',
  description:
    'Build the formula for an Excel "use a formula" conditional formatting rule — duplicates, overdue dates, top values, whole-row highlighting. Runs entirely in your browser.',
  alternates: {
    canonical: '/tools/conditional-format-builder',
  },
};

export default function ConditionalFormatBuilderPage() {
  return <ConditionalFormatBuilder />;
}
