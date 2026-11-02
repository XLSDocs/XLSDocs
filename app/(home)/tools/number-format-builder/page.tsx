import { NumberFormatBuilder } from '@/components/tools/number-format-builder';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Number Format Code Builder',
  description:
    'Build an Excel custom number format code with a form — currency, percentages, accounting columns, colored negatives, hidden zeros. Runs entirely in your browser.',
  alternates: {
    canonical: '/tools/number-format-builder',
  },
};

export default function NumberFormatBuilderPage() {
  return <NumberFormatBuilder />;
}
