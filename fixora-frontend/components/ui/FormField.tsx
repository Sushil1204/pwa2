"use client";

import { useId } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass =
  "w-full rounded-md border border-ink bg-canvas px-4 py-3 text-body-md text-ink placeholder:text-mute " +
  "transition-shadow duration-fast ease-out-soft focus:outline-none focus-visible:outline-2 focus-visible:outline-ink " +
  "disabled:opacity-60 aria-[invalid=true]:border-negative";

const errorClass = "mt-1.5 text-body-sm text-negative-darkest";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: (props: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean | undefined;
  }) => React.ReactNode;
}

export function FormField({ label, error, hint, required, optional, children }: FormFieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body-sm-strong text-ink">
        {label}
        {required ? (
          <span aria-hidden className="ml-1 text-negative">
            *
          </span>
        ) : optional ? (
          <span className="ml-1 font-normal text-mute">(optional)</span>
        ) : null}
      </label>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-body-sm text-body">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  invalid?: boolean;
  className?: string;
};

export function TextField({ invalid, className = "", ...rest }: TextFieldProps) {
  return (
    <input
      className={`${fieldClass} ${className}`}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

export function TextArea({ invalid, ...rest }: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & { invalid?: boolean }) {
  return <textarea className={`${fieldClass} min-h-28 resize-y`} aria-invalid={invalid || undefined} {...rest} />;
}

export function SelectField({
  invalid,
  ...rest
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & { invalid?: boolean }) {
  return <select className={fieldClass} aria-invalid={invalid || undefined} {...rest} />;
}
