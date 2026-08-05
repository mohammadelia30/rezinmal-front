import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/icons";

const socials = [
  { label: "اینستاگرام", href: "#", icon: InstagramIcon },
  { label: "توییتر", href: "#", icon: TwitterIcon },
  { label: "فیسبوک", href: "#", icon: FacebookIcon },
  { label: "یوتیوب", href: "#", icon: YoutubeIcon },
] as const;

export function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-brand-soft/40 bg-surface"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="text-xl font-extrabold text-brand">گروه رزین‌مال</p>
            <p className="text-sm leading-7 text-muted">
              فروشگاه تخصصی مواد، ابزار و آموزش هنر رزین.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socials.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full bg-white p-2 text-brand shadow-sm ring-1 ring-brand-soft/40 transition hover:bg-brand hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-sm leading-7 text-muted">
            <p className="font-bold text-foreground">آدرس</p>
            <p>تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
          </div>

          <div className="space-y-2 text-sm leading-7 text-muted">
            <p className="font-bold text-foreground">تلفن</p>
            <p dir="ltr" className="text-right">
              ۰۲۱-۸۸۷۷۶۶۵۵
            </p>
            <p dir="ltr" className="text-right">
              ۰۹۱۲-۳۴۵-۶۷۸۹
            </p>
          </div>

          <div className="space-y-2 text-sm leading-7 text-muted">
            <p className="font-bold text-foreground">ایمیل</p>
            <p dir="ltr" className="text-right">
              info@resinmal.ir
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-soft/40 pt-5 text-center text-xs text-muted sm:text-sm">
          © کلیه حقوق مادی و معنوی سایت محفوظ می‌باشد.
        </div>
      </div>
    </footer>
  );
}
