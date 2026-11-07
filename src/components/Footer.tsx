import Image from "next/image";
import { Container } from "@/components/Container";
import { BaleIcon, InstagramIcon, TelegramIcon } from "@/components/icons";
import { TrustSeal } from "@/components/TrustSeal";
import { getPublicSiteInfo } from "@/lib/api";
import { footerContacts, socialChannels } from "@/data/home";

/**
 * چهار آیکون قبلی (اینستاگرام، توییتر، فیسبوک، یوتیوب) همگی به `#`
 * می‌رفتند و هیچ‌کدام حساب واقعی فروشگاه نبودند. این سه، هستند.
 */
const ICONS = {
  telegram: TelegramIcon,
  bale: BaleIcon,
  instagram: InstagramIcon,
} as const;

const socials = socialChannels.map((channel) => ({
  label: channel.label,
  href: channel.href,
  icon: ICONS[channel.key],
}));

/**
 * اطلاعات تماس از پنل می‌آید، نه از داخل کد.
 *
 * تا امروز این‌ها ثابت داخل `footerContacts` بود: مدیر آدرس و تلفن را
 * در تنظیمات عوض می‌کرد، بک‌اند هم درست ذخیره می‌کرد، ولی سایت همان
 * مقدار قدیمیِ داخل کد را نشان می‌داد — و به نظر می‌رسید «ذخیره
 * نمی‌شود». حالا چیزی که در پنل نوشته شده مقدم است و مقدار داخل کد
 * فقط وقتی به کار می‌آید که آن فیلد در پنل خالی مانده باشد.
 */
export async function Footer() {
  const info = await getPublicSiteInfo();

  const phone = info?.phone?.trim() || footerContacts.phone;
  const address = info?.address?.trim() || footerContacts.address;
  const email = info?.email?.trim() || footerContacts.email;
  const shopName = info?.shopName?.trim() || "گروه رزین‌مال";

  return (
    <footer id="contact" className="scroll-mt-20 bg-[#f6f1e7] md:bg-surface">
      {/* Mobile — Figma 25:5 */}
      <div className="border-t border-[#e6ddcd] px-4 py-4 md:hidden">
        <div className="space-y-1.5 text-right text-[11px] text-[#4a3a55]">
          <div className="flex items-center justify-end gap-1.5">
            <span dir="ltr">تماس: {phone}</span>
            <Image
              src="/images/figma/icon-phone.svg"
              alt=""
              width={12}
              height={12}
              className="size-3 shrink-0"
            />
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <span>آدرس: {address}</span>
            <Image
              src="/images/figma/icon-location.svg"
              alt=""
              width={12}
              height={12}
              className="size-3 shrink-0"
            />
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <span dir="ltr">ایمیل: {email}</span>
            <Image
              src="/images/figma/icon-mail.svg"
              alt=""
              width={12}
              height={12}
              className="size-3 shrink-0"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          {socials.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex size-6 items-center justify-center rounded-full bg-[#6e4b7c] text-white"
            >
              <Icon className="size-3.5" />
            </a>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#e6ddcd] pt-3 text-[10px] text-[#7a6a80]">
          <TrustSeal />
          <div className="space-y-1 text-right">
            <p>{shopName}</p>
            <p>© کلیه حقوق محفوظ است</p>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <Container className="hidden py-10 md:block md:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="space-y-2 text-right text-sm">
            <p className="font-bold text-foreground">تماس</p>
            <div className="flex items-center justify-end gap-2 text-muted">
              <span dir="ltr">{phone}</span>
              <Image
                src="/images/figma/icon-phone.svg"
                alt=""
                width={14}
                height={14}
                className="size-3.5 shrink-0"
              />
            </div>
            <div className="flex items-start justify-end gap-2 text-muted">
              <span className="leading-6">{address}</span>
              <Image
                src="/images/figma/icon-location.svg"
                alt=""
                width={14}
                height={14}
                className="mt-1 size-3.5 shrink-0"
              />
            </div>
          </div>

          {/* این دو ستون از فیگما «تلفن:» و «فروشگاه محصولات» نوشته
              بودند که هیچ‌کدام تلفن نبود */}
          <div className="space-y-2 text-right text-sm">
            <p className="font-bold text-foreground">فروشگاه</p>
            <p className="text-muted">{shopName}</p>
          </div>

          <div className="space-y-2 text-right text-sm">
            <p className="font-bold text-foreground">ایمیل</p>
            <p className="break-all text-muted" dir="ltr">
              {email}
            </p>
          </div>

          <div className="flex items-start justify-end gap-2 lg:justify-start">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex size-8 items-center justify-center rounded bg-brand text-white transition hover:bg-brand-dark"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-footer-line pt-4 text-center text-xs text-[#8a7a6a] sm:flex-row sm:text-right sm:text-sm">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt={shopName}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
            <p className="font-bold text-brand">{shopName}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="leading-6">
              © کلیه حقوق مادی و معنوی سایت محفوظ می‌باشد.
            </p>
            <TrustSeal />
          </div>
        </div>
      </Container>
    </footer>
  );
}
