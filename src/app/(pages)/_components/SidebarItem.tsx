'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nunito } from 'next/font/google';
import { cn } from '@/lib/utils';

const nunito = Nunito({ subsets: ['latin'], weight: ['400'] });

interface SideBarItemProps {
  icon: LucideIcon;
  href: string;
  label: string;
}

function SidebarItem({ icon: Icon, href, label }: SideBarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-4  hover:bg-slate-300 transition text-gray-600 hover:text-gray-800',
        isActive && 'text-sky-700 bg-sky-200/60 hover:bg-sky-200 hover:text-sky-800 border-r-4 border-sky-800'
      )}
    >
      <Icon className="w-6 h-6" />
      <span className={`${nunito.className} text-md font-medium`}>{label}</span>
    </Link>
  );
}

export default SidebarItem;
