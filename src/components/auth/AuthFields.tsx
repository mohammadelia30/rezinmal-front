"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: "text" | "tel";
  inputMode?: "text" | "tel" | "numeric";
  autoComplete?: string;
  maxLength?: number;
};

export function AuthField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  inputMode = "text",
  autoComplete,
  maxLength,
}: FieldProps) {
  return (
    <div className="text-right">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-xl border bg-[#fbf9f1] px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-[#a89aad] focus:border-brand focus:ring-2 focus:ring-brand/15 ${
          error ? "border-red-400" : "border-[#e6dcc2]"
        }`}
      />
      {error ? <p className="mt-1.5 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

type OtpFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  length?: number;
};

export function OtpField({
  value,
  onChange,
  error,
  length = 5,
}: OtpFieldProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const updateValue = useCallback(
    (nextDigits: string[]) => {
      onChange(nextDigits.join("").slice(0, length));
    },
    [length, onChange],
  );

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digit = event.target.value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    updateValue(nextDigits);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    onChange(pasted);
  };

  return (
    <div className="text-right">
      <p className="mb-3 block text-sm font-medium text-foreground">کد تایید</p>
      <div className="flex flex-row-reverse items-center justify-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            aria-label={`رقم ${index + 1} کد تایید`}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className={`size-11 rounded-xl border bg-[#fbf9f1] text-center text-lg font-bold text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 sm:size-12 ${
              error ? "border-red-400" : "border-[#e6dcc2]"
            }`}
          />
        ))}
      </div>
      {error ? <p className="mt-2 text-center text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

export function AuthSubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}
