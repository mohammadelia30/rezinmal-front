"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";
import { CartIcon, MenuIcon, UserIcon } from "@/components/icons";
import { navLinks } from "@/data/home";

type NavItem = {
  label: string;
  href: string;
};

type HeaderProps = {
  links?: readonly NavItem[];
};

export function Header({ links = navLinks }: HeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-[#f6f1e7]/95 backdrop-blur-sm md:bg-background/95">
      {/* Mobile — Figma 25:93 */}
      <div className="md:hidden">
        <div
          className="flex h-14 items-center justify-between px-4"
          dir="ltr"
        >
          <button
            type="button"
            className="rounded-lg p-1.5 text-[#33203c] transition hover:bg-brand-mist"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <BrandLogo
            className="gap-1.5"
            imageClassName="h-7 w-7 rounded-full object-cover"
            textClassName="text-base font-bold text-brand"
            size={28}
          />

          <div className="flex items-center gap-2.5 text-[#33203c]">
            <button type="button" aria-label="سبد خرید" className="p-1">
              <Image
                src="/images/figma/icon-cart-mobile.svg"
                alt=""
                width={17}
                height={17}
                className="size-[17px]"
              />
            </button>
            <button type="button" aria-label="حساب کاربری" className="p-1">
              <Image
                src="/images/figma/icon-user-mobile.svg"
                alt=""
                width={17}
                height={17}
                className="size-[17px]"
              />
            </button>
          </div>
        </div>

        {open ? (
          <nav
            className="border-t border-brand-soft/40 bg-[#f6f1e7] px-4 py-3"
            aria-label="منوی موبایل"
            dir="rtl"
          >
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={`${link.href}-${link.label}-m`}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#4a3a50] transition hover:bg-brand-mist hover:text-brand"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>

      {/* Desktop */}
      <Container className="relative hidden h-16 items-center justify-between md:flex md:h-20">
        <BrandLogo className="relative z-10" />

        <nav
          className="absolute inset-x-0 flex items-center justify-center gap-4 px-24 lg:gap-8 xl:gap-10"
          aria-label="منوی اصلی"
        >
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="whitespace-nowrap text-sm text-[#4a3a50] transition-colors hover:text-brand lg:text-base"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative z-10 flex items-center gap-3 text-foreground">
          <button
            type="button"
            aria-label="سبد خرید"
            className="rounded-lg p-2 transition hover:bg-brand-mist hover:text-brand"
          >
            <CartIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="حساب کاربری"
            className="rounded-lg p-2 transition hover:bg-brand-mist hover:text-brand"
          >
            <UserIcon className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </header>
  );
}
