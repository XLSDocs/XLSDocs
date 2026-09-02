import { Hero } from '@/components/home/hero';
import { FormulaTicker } from '@/components/home/formula-ticker';
import { CodeWriterSection } from '@/components/home/code-writer';
import { Categories } from '@/components/home/categories';
import { AskClaudeShowcase } from '@/components/home/ask-claude-showcase';
import { QuickFixShowcase } from '@/components/home/quick-fix-showcase';
import { TryItShowcase } from '@/components/home/try-it-showcase';
import { LlmsShowcase } from '@/components/home/llms-showcase';
import { AskClaude } from '@/components/ask-claude';
import { getFunctionCatalog } from '@/lib/source';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'xlsdocs.com — The Excel Reference Built for the AI Era' },
  description:
    'Every Excel formula, VBA function, and custom LAMBDA documented, with an AI formula builder and a built-in AI assistant on every page.',
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
      <TryItShowcase />
      <AskClaudeShowcase />
      <QuickFixShowcase />
      <LlmsShowcase />
      {/* AskClaudeShowcase above is a static mockup, not the real chat —
          this hidden-trigger instance is what actually opens when the
          live TryIt widget's own "Ask AI about this" button is clicked. */}
      <AskClaude pageTitle="Excel functions" hideTrigger />
    </div>
  );
}
