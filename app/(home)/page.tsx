import { Hero } from '@/components/home/hero';
import { FormulaTicker } from '@/components/home/formula-ticker';
import { CodeWriterSection } from '@/components/home/code-writer';
import { Categories } from '@/components/home/categories';
import { AskClaudeShowcase } from '@/components/home/ask-claude-showcase';
import { getFunctionCatalog } from '@/lib/source';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'xlsdocs.com — The Excel Reference Built for the AI Era' },
  description:
    'Every Excel formula, VBA function, and custom LAMBDA documented, with an AI formula builder and a Claude-powered assistant on every page.',
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
      <Categories categories={categories} />
      <CodeWriterSection />
      <AskClaudeShowcase />
    </div>
  );
}
