import { HomeNav } from '@/components/home/nav';
import { Footer } from '@/components/home/footer';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
