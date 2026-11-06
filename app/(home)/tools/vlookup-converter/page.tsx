import { VlookupConverter } from '@/components/tools/vlookup-converter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VLOOKUP to XLOOKUP Converter',
  description:
    'Paste an existing VLOOKUP formula and get the exact XLOOKUP and INDEX/MATCH equivalent, including the easy-to-miss default match-type behavior. Runs entirely in your browser.',
  alternates: {
    canonical: '/tools/vlookup-converter',
  },
};

export default function VlookupConverterPage() {
  return <VlookupConverter />;
}
