import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { navLinks } from "@/data/home";

export function Header() {
  return (
    <header className="bg-background">
      <Container className="relative flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="relative z-10 flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="رزینمال"
            width={48}
            height={48}
            priority
            className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
          />
          <span className="text-xl font-bold text-brand sm:text-2xl">
            رزینمال
          </span>
        </Link>

        <nav
          className="absolute inset-x-0 hidden items-center justify-center gap-5 sm:gap-8 lg:gap-10 md:flex"
          aria-label="منوی اصلی"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#4a3a50] transition-colors hover:text-brand sm:text-base"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* spacer to keep logo on the right with justify-between in RTL */}
        <div className="pointer-events-none invisible hidden w-[140px] md:block" aria-hidden />
      </Container>

      <nav
        className="flex flex-wrap items-center justify-center gap-4 px-5 pb-3 md:hidden"
        aria-label="منوی موبایل"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
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
