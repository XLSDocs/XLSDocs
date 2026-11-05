import { DataValidationBuilder } from '@/components/tools/data-validation-builder';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Validation Rule Builder',
  description:
    'Build the exact Data Validation settings for a dropdown list, dependent dropdown, number/date range, or duplicate-prevention rule. Runs entirely in your browser.',
  alternates: {
    canonical: '/tools/data-validation-builder',
  },
};

export default function DataValidationBuilderPage() {
  return <DataValidationBuilder />;
}
