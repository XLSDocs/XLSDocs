import { Suspense } from 'react';
import { QuickFix } from '@/components/tools/quick-fix';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Fix — Fix a Broken Excel Formula',
  description:
    'Paste a broken Excel formula and what it\'s doing wrong. Get back a corrected version with an explanation of what was actually broken.',
  alternates: {
    canonical: '/tools/quick-fix',
  },
};

export default function QuickFixPage() {
  return (
    <Suspense fallback={null}>
      <QuickFix />
    </Suspense>
  );
}
