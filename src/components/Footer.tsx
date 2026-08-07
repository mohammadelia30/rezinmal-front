import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/icons";
import { footerContacts } from "@/data/home";

const socials = [
  { label: "اینستاگرام", href: "#", icon: InstagramIcon },
  { label: "توییتر", href: "#", icon: TwitterIcon },
  { label: "فیسبوک", href: "#", icon: FacebookIcon },
  { label: "یوتیوب", href: "#", icon: YoutubeIcon },
] as const;

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20 bg-[#f6f1e7] md:bg-surface">
      {/* Mobile — Figma 25:5 */}
      <div className="border-t border-[#e6ddcd] px-4 py-4 md:hidden">
        <div className="space-y-1.5 text-right text-[11px] text-[#4a3a55]">
          <div className="flex items-center justify-end gap-1.5">
            <span dir="ltr">تماس: {footerContacts.phone}</span>
            <Image
              src="/images/figma/icon-phone.svg"
              alt=""
              width={12}
              height={12}
              className="size-3 shrink-0"
            />
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <span>{footerContacts.addressLine}</span>
            <Image
              src="/images/figma/icon-location.svg"
              alt=""
              width={12}
              height={12}
              className="size-3 shrink-0"
            />
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <span dir="ltr">ایمیل: {footerContacts.email}</span>
            <Image
              src="/images/figma/icon-mail.svg"
              alt=""
              width={12}
              height={12}
              className="size-3 shrink-0"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-1.5">
          {socials.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="flex size-3.5 items-center justify-center rounded-full bg-[#6e4b7c] text-white"
            >
              <Icon className="h-2 w-2" />
            </Link>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#e6ddcd] pt-2 text-[10px] text-[#7a6a80]">
          <p>© کلیه حقوق محفوظ است</p>
          <p>گروه رزینمال</p>
        </div>
      </div>

      {/* Desktop */}
      <Container className="hidden py-10 md:block md:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="space-y-2 text-right text-sm">
            <p className="font-bold text-foreground">تماس</p>
            <div className="flex items-center justify-end gap-2 text-muted">
              <span dir="ltr">{footerContacts.phone}</span>
              <Image
                src="/images/figma/icon-phone.svg"
                alt=""
                width={14}
                height={14}
                className="size-3.5 shrink-0"
              />
            </div>
            <div className="flex items-start justify-end gap-2 text-muted">
              <span className="leading-6">{footerContacts.address}</span>
              <Image
                src="/images/figma/icon-location.svg"
                alt=""
                width={14}
                height={14}
                className="mt-1 size-3.5 shrink-0"
              />
            </div>
          </div>

          <div className="space-y-2 text-right text-sm">
            <p className="font-bold text-foreground">تلفن:</p>
            <p className="text-muted">فروشگاه محصولات</p>
          </div>

          <div className="space-y-2 text-right text-sm">
            <p className="font-bold text-foreground">تلفن:</p>
            <p className="break-words text-muted">{footerContacts.addressLine}</p>
            <p className="break-all text-muted" dir="ltr">
              ایمیل: {footerContacts.email}
            </p>
          </div>

          <div className="flex items-start justify-end gap-2 lg:justify-start">
            {socials.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex size-7 items-center justify-center rounded bg-brand text-white transition hover:bg-brand-dark"
              >
                <Icon className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-footer-line pt-4 text-center text-xs text-[#8a7a6a] sm:flex-row sm:text-right sm:text-sm">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="رزین‌مال"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
            <p className="font-bold text-brand">گروه رزین‌مال</p>
          </div>
          <p className="leading-6">© کلیه حقوق مادی و معنوی سایت محفوظ می‌باشد.</p>
        </div>
      </Container>
    </footer>
  );
}
