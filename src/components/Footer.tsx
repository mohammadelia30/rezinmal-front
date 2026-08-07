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
    <footer id="contact" className="scroll-mt-20 bg-surface">
      <Container className="py-10 sm:py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 text-right text-sm">
            <p className="font-bold text-foreground">تماس</p>
            <div className="flex items-center justify-end gap-2 text-muted">
              <span dir="ltr">{footerContacts.phone}</span>
              <Image
                src="/images/figma/icon-phone.svg"
                alt=""
                width={14}
                height={14}
                className="size-3.5"
              />
            </div>
            <div className="flex items-center justify-end gap-2 text-muted">
              <span>{footerContacts.address}</span>
              <Image
                src="/images/figma/icon-location.svg"
                alt=""
                width={14}
                height={14}
                className="size-3.5"
              />
            </div>
          </div>

          <div className="space-y-2 text-right text-sm">
            <p className="font-bold text-foreground">تلفن:</p>
            <p className="text-muted">فروشگاه محصولات</p>
          </div>

          <div className="space-y-2 text-right text-sm">
            <p className="font-bold text-foreground">تلفن:</p>
            <p className="text-muted">{footerContacts.addressLine}</p>
            <p className="text-muted" dir="ltr">
              ایمیل: {footerContacts.email}
            </p>
          </div>

          <div className="flex items-start gap-2 sm:justify-start">
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

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-footer-line pt-4 text-xs text-[#8a7a6a] sm:flex-row sm:text-sm">
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
          <p>© کلیه حقوق مادی و معنوی سایت محفوظ می‌باشد.</p>
        </div>
      </Container>
    </footer>
  );
}
