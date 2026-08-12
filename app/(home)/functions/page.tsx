import { getFunctionCatalog } from '@/lib/source';
import { FunctionsExplorer } from '@/components/functions/functions-explorer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Excel Function Reference',
  description:
    'Search every Excel function by name or category — syntax, parameters, common errors, and worked examples for each one.',
  alternates: {
    canonical: '/functions',
  },
};

export default function FunctionsPage() {
  const categories = getFunctionCatalog();

  return <FunctionsExplorer categories={categories} />;
}
