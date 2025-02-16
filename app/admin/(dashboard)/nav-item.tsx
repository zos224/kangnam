'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/admin/ui/tooltip';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
  href,
  label,
  children,
  full
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  const pathname = usePathname();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={clsx(
            'flex items-center gap-4 px-2 py-1 rounded-lg text-muted-foreground transition-colors hover:text-foreground',
            {
              'bg-accent text-black': pathname === href
            }
          )}
        >
          {children}
          <span className={full ? "" : "hidden"}>{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
