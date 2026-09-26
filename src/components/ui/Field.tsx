import { AlertCircle } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Field.module.css';

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label, optional hint and inline error, wired up with aria-describedby by the control. */
function FieldShell({ id, label, hint, error, optional, className, children }: FieldShellProps) {
  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional ? <span className={styles.optional}> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          <AlertCircle size={16} aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, hint?: string, error?: string) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

type TextFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'id'> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
};

export function TextField({ id, label, hint, error, optional, className, ...input }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input
        id={id}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...input}
      />
    </FieldShell>
  );
}

type TextAreaProps = Omit<ComponentPropsWithoutRef<'textarea'>, 'id'> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function TextArea({ id, label, hint, error, className, ...textarea }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        className={cn(styles.control, styles.textarea)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...textarea}
      />
    </FieldShell>
  );
}

type SelectFieldProps = Omit<ComponentPropsWithoutRef<'select'>, 'id'> & {
  id: string;
  label: string;
  error?: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
};

export function SelectField({ id, label, error, options, placeholder, className, ...select }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} className={className}>
      <select
        id={id}
        className={cn(styles.control, styles.select)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, undefined, error)}
        {...select}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface ChoiceGroupProps {
  name: string;
  legend: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

/** Radio group styled as segmented choices; a real fieldset/legend for assistive tech. */
export function ChoiceGroup({ name, legend, options, value, onChange, error, className }: ChoiceGroupProps) {
  const errorId = `${name}-error`;
  return (
    <fieldset className={cn(styles.fieldset, className)} aria-describedby={error ? errorId : undefined}>
      <legend className={styles.label}>{legend}</legend>
      <div className={styles.choices}>
        {options.map((option) => (
          <label key={option.value} className={styles.choice}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={styles.choiceInput}
            />
            <span className={styles.choiceLabel}>{option.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} className={styles.error}>
          <AlertCircle size={16} aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Invisible to people and assistive tech; bots tend to fill it in. */
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label htmlFor="website">Leave this field empty</label>
      <input id="website" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
