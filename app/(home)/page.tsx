import { Hero } from '@/components/home/hero';
import { FormulaTicker } from '@/components/home/formula-ticker';
import { CodeWriterSection } from '@/components/home/code-writer';
import { getFunctionCatalog } from '@/lib/source';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'xlsdocs.com — The Excel Reference Built for the AI Era' },
  description:
    'Every Excel function documented, with an AI formula builder built in. Search the full reference, or describe what you need in plain English.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  const categories = getFunctionCatalog();
  const functionCount = categories.reduce((sum, cat) => sum + cat.functions.length, 0);

  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <FormulaTicker functionCount={functionCount} categoryCount={categories.length} />
      <CodeWriterSection />
    </div>
  );
}
