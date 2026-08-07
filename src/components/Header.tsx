import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";
import { navLinks } from "@/data/home";

type NavItem = {
  label: string;
  href: string;
};

type HeaderProps = {
  links?: readonly NavItem[];
};

export function Header({ links = navLinks }: HeaderProps) {
  return (
    <header className="bg-background">
      <Container className="relative flex h-16 items-center justify-between sm:h-20">
        <BrandLogo className="relative z-10" />

        <nav
          className="absolute inset-x-0 hidden items-center justify-center gap-5 sm:gap-8 lg:gap-10 md:flex"
          aria-label="منوی اصلی"
        >
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="text-sm text-[#4a3a50] transition-colors hover:text-brand sm:text-base"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div
          className="pointer-events-none invisible hidden w-[140px] md:block"
          aria-hidden
        />
      </Container>

      <nav
        className="flex flex-wrap items-center justify-center gap-4 px-5 pb-3 md:hidden"
        aria-label="منوی موبایل"
      >
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}-m`}
            href={link.href}
            className="text-sm text-[#4a3a50] transition-colors hover:text-brand"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
