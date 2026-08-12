import { FormulaBuilder } from '@/components/tools/formula-builder';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Formula Builder',
  description:
    'Describe what you need in plain English and get back a working Excel formula, with a breakdown of every part.',
};

export default function FormulaBuilderPage() {
  return <FormulaBuilder />;
}
