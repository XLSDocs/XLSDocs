import { HomeNav } from '@/components/home/nav';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      {children}
    </div>
  );
}
