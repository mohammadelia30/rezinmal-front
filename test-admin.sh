#!/usr/bin/env bash
#
# تست پنل مدیریت از بیرون، مثل یک مرورگر واقعی.
#
# رمز عبور به‌صورت مخفی پرسیده می‌شود، در تاریخچهٔ شل نمی‌رود و جایی
# ذخیره نمی‌شود. کوکی‌ها در فایل موقت می‌نشینند و در پایان پاک می‌شوند.
#
#   ./test-admin.sh
#   BASE_URL=https://example.com ./test-admin.sh
#
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"

JAR="$(mktemp)"
cleanup() { rm -f "$JAR"; }
trap cleanup EXIT

pass=0
fail=0

ok()   { printf '  \033[0;32m✓\033[0m %s\n' "$1"; pass=$((pass + 1)); }
bad()  { printf '  \033[0;31m✗\033[0m %s\n' "$1"; fail=$((fail + 1)); }
step() { printf '\n\033[1;35m▸ %s\033[0m\n' "$1"; }

code_of() {
  curl -s -b "$JAR" -o /dev/null -w '%{http_code}' --max-time 20 "$BASE_URL$1"
}

expect() {
  local path="$1" want="$2" got
  got="$(code_of "$path")"
  if [ "$got" = "$want" ]; then
    ok "$path → $got"
  else
    bad "$path → $got (انتظار: $want)"
  fi
}

# ----------------------------------------------------------------------
read -rp "شماره موبایل مدیر: " PHONE
read -rsp "رمز عبور: " PASSWORD
echo

step "ورود"
login_code="$(curl -s -c "$JAR" -o /dev/null -w '%{http_code}' --max-time 20 \
  -X POST "$BASE_URL/auth/login" \
  -H 'Content-Type: application/json' \
  --data-binary "$(PHONE="$PHONE" PASSWORD="$PASSWORD" python3 -c '
import json, os
print(json.dumps({"phone_number": os.environ["PHONE"], "password": os.environ["PASSWORD"]}))')")"
unset PASSWORD

if [ "$login_code" = "200" ]; then
  ok "POST /auth/login → 200"
else
  bad "POST /auth/login → $login_code"
  printf '\n\033[0;31mورود ناموفق بود؛ بقیهٔ تست‌ها معنا ندارند.\033[0m\n'
  exit 1
fi

if [ "$(grep -c 'HttpOnly_.*rz_at' "$JAR")" -ge 1 ] &&
   [ "$(grep -c 'HttpOnly_.*rz_rt' "$JAR")" -ge 1 ]; then
  ok "توکن‌ها در کوکی httpOnly نشسته‌اند"
else
  bad "کوکی httpOnly پیدا نشد — توکن ممکن است در دسترس جاوااسکریپت باشد"
fi

step "نشست"
session="$(curl -s -b "$JAR" --max-time 20 "$BASE_URL/auth/session")"
if printf '%s' "$session" | grep -q '"isStaff":true'; then
  perms="$(printf '%s' "$session" | python3 -c '
import json, sys
print(len(json.load(sys.stdin)["user"]["panelPermissions"]))' 2>/dev/null || echo "?")"
  ok "کاربر دسترسی مدیریت دارد (تعداد دسترسی‌ها: $perms)"
else
  bad "این حساب دسترسی مدیریت ندارد: $session"
fi

step "صفحات پنل"
for path in /admin /admin/orders /admin/invoices /admin/products \
            /admin/discounts /admin/users /admin/roles /admin/settings; do
  got="$(code_of "$path")"
  case "$got" in
    200) ok "$path → 200" ;;
    307) printf '  \033[1;33m!\033[0m %s → 307 (دسترسی این بخش را ندارید)\n' "$path" ;;
    *)   bad "$path → $got" ;;
  esac
done

step "اندپوینت‌های مدیریتی"
expect /api/accounts/users/ 200
expect /api/accounts/roles/ 200
expect /api/core/settings/ 200
expect /api/reports/overview/ 200

step "خروج"
logout_code="$(curl -s -b "$JAR" -c "$JAR" -o /dev/null -w '%{http_code}' \
  --max-time 20 -X POST "$BASE_URL/auth/logout")"
[ "$logout_code" = "200" ] && ok "POST /auth/logout → 200" || bad "POST /auth/logout → $logout_code"

after="$(code_of /admin)"
if [ "$after" = "307" ]; then
  ok "/admin بعد از خروج → 307 (به صفحهٔ ورود)"
else
  bad "/admin بعد از خروج → $after (انتظار: 307)"
fi

step "نتیجه"
printf '  موفق: %d   ناموفق: %d\n' "$pass" "$fail"
[ "$fail" -eq 0 ] || exit 1
