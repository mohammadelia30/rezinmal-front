# استقرار با بک‌اند Rozinweb

فرانت و بک‌اند روی یک شبکهٔ داکر مشترک (`rozinmall_network`) اجرا می‌شوند.
بک‌اند **هیچ پورتی روی هاست منتشر نمی‌کند** و فقط از داخل شبکه در دسترس است؛
مرورگر فقط با فرانت (پورت ۳۰۰۰) حرف می‌زند.

## توپولوژی

```
مرورگر ──▶ rezinmal_front:3000 ──▶ rozinmall_nginx:80 ──┬──▶ rozinmall_web:8000 (gunicorn)
           (Next.js + rewrite)      (داخل شبکه)          ├──▶ /static/  (volume)
                                                         └──▶ /media/   (volume)
```

مسیرهای `‎/api/*`، `‎/media/*` و `‎/static/*` در `next.config.ts` به بک‌اند rewrite می‌شوند.
یعنی هیچ درخواستی از مرورگر مستقیماً به بک‌اند نمی‌رود و به CORS هم نیازی نیست.

## اجرا

ساده‌ترین راه، اسکریپت استقرار در ریپو بک‌اند است که هر دو پروژه را به‌ترتیب
درست بالا می‌آورد، migration می‌زند و در پایان سلامت سایت را بررسی می‌کند:

```bash
cd ~/Rozinweb && ./deploy.sh
```

اگر کد را دستی روی سرور گذاشته‌اید و نمی‌خواهید `git pull` بزند از
`./deploy.sh --no-pull` استفاده کنید؛ مسیر فرانت هم با متغیر `FRONTEND_DIR`
قابل تغییر است.

یا دستی — که ترتیبش مهم است، چون بک‌اند شبکهٔ مشترک را می‌سازد:

```bash
cd ~/Rozinweb && docker compose up -d --build
```

```bash
cd ~/rezinmal-front && docker compose up -d --build
```

## آدرس‌ها

| سرویس | آدرس |
|--------|------|
| فرانت | http://localhost:3000 |
| API از طریق فرانت | http://localhost:3000/api/... |
| Swagger از طریق فرانت | http://localhost:3000/api/docs/swagger/ |
| بک‌اند مستقیم | ❌ منتشر نشده (فقط داخل شبکه) |

## متغیرها

| متغیر | توضیح |
|--------|-------|
| `API_INTERNAL_URL` | آدرس بک‌اند داخل شبکه (پیش‌فرض `http://rozinmall_nginx`) |
| `FRONTEND_PORT` | پورت هاست برای فرانت (پیش‌فرض `3000`) |
| `NEXT_PUBLIC_API_BASE_URL` | اختیاری؛ خالی بماند تا مرورگر از مسیر نسبی استفاده کند |

در توسعهٔ محلی بدون داکر، `API_INTERNAL_URL` را در `.env.local` به آدرس بک‌اند روی
هاست (مثلاً `http://127.0.0.1:8080`) تنظیم کنید.

## چک‌لیست پروداکشن

قبل از انتشار روی دامنهٔ واقعی:

۱. در `.env` بک‌اند دامنه را اضافه کنید — بدون این، جنگو با ۴۰۰ جواب می‌دهد:

```
ALLOWED_HOSTS=127.0.0.1,localhost,web,nginx,example.com,www.example.com
CSRF_TRUSTED_ORIGINS=https://example.com,https://www.example.com
```

۲. بعد از فعال کردن گواهی TLS روی `nginx-proxy-manager` (پنل: `http://127.0.0.1:81`)
این‌ها را در `.env` بک‌اند `True` کنید:

```
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
```

۳. در `.env` فرانت، پورت را از دسترس عمومی خارج کنید (NPM از داخل شبکه وصل می‌شود):

```
FRONTEND_BIND=127.0.0.1
```

۴. در `nginx-proxy-manager` یک Proxy Host بسازید که به `rezinmal_front` روی پورت
`3000` اشاره کند. کل ترافیک (صفحات، `/api`، `/media`) از همان‌جا عبور می‌کند.

۵. کد بک‌اند از داخل ایمیج اجرا می‌شود (bind mount حذف شده)، پس بعد از هر تغییر کد:

```bash
docker compose up -d --build web celery_worker celery_beat
```

## جست‌وجو (Elasticsearch) اختیاری است

`elasticsearch` و `kibana` پشت profile هستند و با `docker compose up -d`
بالا نمی‌آیند. دلیلش این است که فرانت از جست‌وجو استفاده نمی‌کند و رجیستری
`docker.elastic.co` از داخل ایران در دسترس نیست.

بدون آن‌ها همه‌چیز کار می‌کند و فقط `/api/search/*` پاسخ ۵۰۳ می‌دهد.
اگر خواستید فعالشان کنید:

```bash
docker compose --profile search up -d
```

اگر کشیدن ایمیج از Docker Hub هم روی سرور شکست خورد، یک registry mirror
داخلی در `/etc/docker/daemon.json` تنظیم کنید:

```json
{ "registry-mirrors": ["https://docker.arvancloud.ir"] }
```

## نکات مهم (هرکدام یک بار ما را زمین زد)

- **آندرلاین در نام هاست ممنوع است.** جنگو هدر `Host` دارای `_` را مستقل از
  `ALLOWED_HOSTS` رد می‌کند (regex اعتبارسنجی هاست). برای همین مقصد باید
  `http://nginx` باشد (نام سرویس) نه `http://rozinmall_nginx` (نام کانتینر).
- **rewriteها موقع build ثبت می‌شوند.** مقدار `API_INTERNAL_URL` در
  `routes-manifest` پخته می‌شود؛ عوض کردن آن فقط در `environment` کافی نیست و
  باید در `build.args` هم باشد (در `docker-compose.yml` هر دو ست شده‌اند).
- **اسلش انتهایی.** Next مسیر را بدون اسلش فوروارد می‌کند و `APPEND_SLASH`
  جنگو حلقهٔ ریدایرکت می‌سازد؛ برای همین مقصد `/api/:path*/` اسلش دارد
  ولی مقصد media/static ندارد (فایل‌ها نباید اسلش بگیرند).
- **مالکیت volume استاتیک.** کانتینر با کاربر `django` اجرا می‌شود ولی volume
  مال root است و `collectstatic` خطای permission می‌دهد. یک بار:

```bash
docker exec -u root rozinmall_web chown -R django:django /app/static /app/media
```

- اگر شبکه پیدا نشد، یعنی بک‌اند هنوز بالا نیامده:

```bash
docker network ls | grep rozinmall_network
```
