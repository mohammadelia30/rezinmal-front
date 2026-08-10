# استقرار با بک‌اند Rozinweb

فرانت روی همان شبکه داکر بک‌اند (`rozinmall_network`) اجرا می‌شود و درخواست‌های `/api/*` به کانتینر `rozinmall_web` پروکسی می‌شوند.

## پیش‌نیاز

۱. اول بک‌اند را بالا بیاورید تا شبکه ساخته شود:

```bash
cd /home/mohammad/Rozinweb
docker compose up -d --build
```

شبکه باید با نام `rozinmall_network` ساخته شود.

۲. سپس فرانت:

```bash
cd /home/mohammad/rezinmal-front
cp .env.example .env   # در صورت نیاز
docker compose up -d --build
```

## آدرس‌ها

| سرویس | آدرس |
|--------|------|
| فرانت مستقیم | http://localhost:3000 |
| از طریق nginx بک‌اند | http://localhost:8080 |
| API بک‌اند | http://localhost:8080/api/... |

## متغیرها

- `API_INTERNAL_URL` — داخل شبکه داکر (پیش‌فرض `http://rozinmall_web:8000`)
- `FRONTEND_PORT` — پورت هاست برای فرانت (پیش‌فرض `3000`)
- `NEXT_PUBLIC_API_URL` — اختیاری؛ اگر خالی باشد کلاینت از `/api` نسبی استفاده می‌کند

## نکته شبکه

اگر شبکه از قبل با نام دیگری ساخته شده، یا بک‌اند را دوباره با compose جدید بالا بیاورید، یا موقتاً در `docker-compose.yml` فرانت نام `external` را با خروجی زیر هماهنگ کنید:

```bash
docker network ls | grep rozin
```
