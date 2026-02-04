import { Search, Bell, Command } from 'lucide-react';
import { Input } from '../ui';

interface HeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-neutral-500">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Input
              placeholder="Buscar pedidos, clientes..."
              className="w-72 pl-10 pr-12 bg-neutral-50 border-neutral-100 focus:bg-white"
              leftIcon={<Search size={16} />}
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-neutral-400 bg-neutral-100 rounded border border-neutral-200">
                <Command size={10} />K
              </kbd>
            </div>
          </div>

          <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {actions}
        </div>
      </div>
    </header>
  );
}
