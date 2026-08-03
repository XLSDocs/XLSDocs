import { Hero } from '@/components/home/hero';
import { FormulaTicker } from '@/components/home/formula-ticker';
import { CodeWriterSection } from '@/components/home/code-writer';

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <FormulaTicker />
      <CodeWriterSection />
    </div>
  );
}
