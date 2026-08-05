"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks } from "@/data/home";
import { MenuIcon } from "@/components/icons";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-soft/50 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-[1.7rem] font-extrabold tracking-tight text-brand sm:text-3xl"
        >
          رزین‌مال
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="منوی اصلی"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-full p-2 text-foreground/75 transition-colors hover:bg-brand-mist hover:text-brand md:hidden"
          aria-label="باز کردن منو"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <nav
          className="border-t border-brand-soft/40 bg-background px-4 py-3 md:hidden"
          aria-label="منوی موبایل"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-brand-mist hover:text-brand"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
