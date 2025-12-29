'use client';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from './ThemeToggle';
import { converterTools } from '@/lib/converter-options';
import type { ConverterType } from '@/lib/types';

const getPageTitle = (path: string) => {
    const pathSegments = path.split('/').filter(Boolean);

    if (pathSegments[0] === 'converters' && pathSegments[1]) {
        const type = pathSegments[1] as ConverterType;
        if(Object.keys(converterTools).includes(type)) {
            return `${type.charAt(0).toUpperCase()}${type.slice(1)} Converter`;
        }
    }

    switch (`/${pathSegments[0]}`) {
        case '/about': return 'About FlipFile';
        case '/report': return 'Report a Problem';
        default: return 'FlipFile';
    }
}

export function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
        <div className="flex-1">
            <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
             <ThemeToggle />
        </div>
    </header>
  );
}
