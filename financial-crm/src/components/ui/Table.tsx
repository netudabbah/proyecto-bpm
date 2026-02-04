import { clsx } from 'clsx';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="w-full">
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={clsx('bg-neutral-50/80 sticky top-0 z-10', className)}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return <tbody className={clsx('divide-y divide-neutral-100', className)}>{children}</tbody>;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isClickable?: boolean;
}

export function TableRow({ children, className, onClick, isClickable }: TableRowProps) {
  return (
    <tr
      className={clsx(
        'transition-colors duration-150',
        isClickable && 'hover:bg-neutral-50 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

export function TableHead({ children, className, sortable, sorted, onSort }: TableHeadProps) {
  return (
    <th
      className={clsx(
        'px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider',
        sortable && 'cursor-pointer hover:text-neutral-700 select-none',
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && sorted && (
          <span className="text-neutral-400">
            {sorted === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={clsx('px-4 py-3.5 text-sm text-neutral-700', className)}>
      {children}
    </td>
  );
}
