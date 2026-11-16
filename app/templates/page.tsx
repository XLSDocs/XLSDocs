import type { Metadata } from 'next';
import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';
import { TemplateList } from '@/components/templates/template-list';
import { getTemplates } from '@/lib/templates';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Free, downloadable Excel workbooks matching the tutorials and guides on this site — no email required.',
  alternates: {
    canonical: '/templates',
  },
};

export default function TemplatesPage() {
  const templates = getTemplates();

  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-6 py-16">
          <h1 className="text-4xl font-normal md:text-5xl">
            <span className="font-serif text-fd-primary italic">Templates</span>
          </h1>
          <p className="mt-4 text-fd-muted-foreground">
            Starter workbooks matching the tutorials and guides on this site — direct download, no
            email required.
          </p>
          <div className="mt-12">
            <TemplateList templates={templates} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
