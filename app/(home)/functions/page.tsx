import { getFunctionCatalog } from '@/lib/source';
import { FunctionsExplorer } from '@/components/functions/functions-explorer';

export default function FunctionsPage() {
  const categories = getFunctionCatalog();

  return <FunctionsExplorer categories={categories} />;
}
