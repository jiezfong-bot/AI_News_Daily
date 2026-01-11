import { Newspaper } from "lucide-react";
import Link from "next/link";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                        <Newspaper className="h-5 w-5" />
                    </div>
                    <span className="hidden sm:block text-lg font-bold tracking-tight text-gray-900 font-sans">AI News Daily</span>
                </Link>

                <nav className="flex items-center gap-1">
                    <NavLink href="/">Today</NavLink>
                    <NavLink href="#">Archive</NavLink>
                    <NavLink href="https://github.com" external>About</NavLink>
                </nav>
            </div>
        </header>
    );
}

function NavLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
    const Component = external ? 'a' : Link;
    const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

    return (
        // @ts-ignore
        <Component
            href={href}
            {...props}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-indigo-600 active:scale-95"
        >
            {children}
        </Component>
    );
}
