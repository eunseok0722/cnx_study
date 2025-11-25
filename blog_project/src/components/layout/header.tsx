"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    {href: "/photos", label: "Photos"},
    // {href: "/place", label: "Place"},
    {href: "/interests", label: "Interests"},
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white w-full">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between w-full">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/img_logo001.svg" 
              alt="MONERE" 
              width={160} 
              height={32}
              className="h-6 md:h-8 w-auto"
            />
          </Link>

          {/* GNB */}
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  pathname === item.href ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
