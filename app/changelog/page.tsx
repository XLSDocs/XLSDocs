import type { Metadata } from 'next';
import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';
import { ChangelogList } from '@/components/changelog/changelog-list';
import { getChangelog } from '@/lib/changelog';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'What changed on xlsdocs.com, and why.',
};

export default function ChangelogPage() {
  const entries = getChangelog();

  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-4xl font-normal md:text-5xl">
            <span className="font-serif text-fd-primary italic">Changelog</span>
          </h1>
          <p className="mt-4 text-fd-muted-foreground">
            New functions, features, and improvements to xlsdocs.com — newest first.
          </p>
          <div className="mt-12">
            <ChangelogList entries={entries} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
