'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import { cn } from "@/lib/utils";
const navItems =[
{label:'Home', href: '/' },
{label: 'Companions', href: '/companions'},
{label: 'My Journey', href: 'my-journey' },
]

const NavItems = ()=> {
    const pathname = usePathname();
    
return (
<nav className="flex items-center gap-4">
        {navItems.map(({label, href}) => (
            <Link
                key={label}
                href={href}
                className={cn(
                        "text-sm transition-colors hover:text-primary",
                        pathname === href ? 'text-primary font-semibold' : 'text-muted-foreground'
                    )}
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
};

export default NavItems;