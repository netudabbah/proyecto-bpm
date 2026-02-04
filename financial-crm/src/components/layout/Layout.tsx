import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <main className="pl-64 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
