'use client';

import type { AccountType } from '@/lib/auth/accounts';

const options: { value: AccountType; title: string; text: string }[] = [
  {
    value: 'parent',
    title: 'Parent or guardian',
    text: 'Create accounts for your children and follow their progress.',
  },
  {
    value: 'creator',
    title: 'Course creator',
    text: 'Apply to build free courses. An admin reviews each application.',
  },
];

export function AccountTypeChoice({
  value,
  onChange,
  error,
}: {
  value: AccountType | '';
  onChange: (value: AccountType) => void;
  error?: string;
}) {
  return (
    <fieldset className="choice-group" aria-describedby={error ? 'account-type-error' : undefined}>
      <legend>Who is this account for?</legend>
      {options.map((o) => (
        <label key={o.value} className="choice">
          <input
            type="radio"
            name="accountType"
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          <span>
            <strong>{o.title}</strong>
            <span>{o.text}</span>
          </span>
        </label>
      ))}
      {error && (
        <span className="field-error" id="account-type-error">
          {error}
        </span>
      )}
    </fieldset>
  );
}
