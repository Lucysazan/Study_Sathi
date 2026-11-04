'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, useTransition } from 'react';
import { setUserDisabled, setUserRole } from '@/app/admin/users/actions';
import { type Role, roles } from '@/lib/auth/roles';
import { ConfirmButton } from './ConfirmButton';

const labels: Record<Role, string> = {
  student: 'Student',
  parent: 'Parent',
  creator: 'Creator',
  admin: 'Admin',
};

/** Role picker (with confirm) and turn off / turn on for one user. */
export function UserRowControls({
  uid,
  name,
  role,
  disabled,
  suggestCreator,
}: {
  uid: string;
  name: string;
  role: Role | null;
  disabled: boolean;
  suggestCreator: boolean;
}) {
  const router = useRouter();
  const selectId = useId();
  const [nextRole, setNextRole] = useState<Role | ''>(role ?? (suggestCreator ? 'creator' : ''));
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      setMessage(
        result.ok ? { text: success, error: false } : { text: result.error ?? '', error: true },
      );
      if (result.ok) router.refresh();
    });
  }

  const roleChanged = nextRole !== '' && nextRole !== role;
  return (
    <div className="row-actions">
      <div className="row-actions-buttons">
        <label className="sr-only" htmlFor={selectId}>
          Role for {name}
        </label>
        <select
          id={selectId}
          className="admin-select"
          value={nextRole}
          onChange={(e) => setNextRole(e.target.value as Role | '')}
          disabled={pending}
        >
          {role === null && <option value="">No role</option>}
          {roles.map((r) => (
            <option key={r} value={r}>
              {labels[r]}
            </option>
          ))}
        </select>
        {roleChanged && (
          <ConfirmButton
            label="Save role"
            confirmLabel="Yes, change"
            question={`Make ${name} ${nextRole === 'admin' ? 'an' : 'a'} ${labels[nextRole]}?`}
            disabled={pending}
            onConfirm={() =>
              run(() => setUserRole(uid, nextRole), `${name} is now ${labels[nextRole]}.`)
            }
          />
        )}
        <ConfirmButton
          label={disabled ? 'Turn on' : 'Turn off'}
          confirmLabel={disabled ? 'Yes, turn on' : 'Yes, turn off'}
          question={disabled ? `Let ${name} log in again?` : `Turn off ${name}'s account?`}
          danger={!disabled}
          disabled={pending}
          onConfirm={() =>
            run(
              () => setUserDisabled(uid, !disabled),
              disabled ? `${name} can log in again.` : `${name}'s account is turned off.`,
            )
          }
        />
      </div>
      {message && (
        <p className={message.error ? 'field-error' : 'admin-row-status'} role="status">
          {message.text}
        </p>
      )}
    </div>
  );
}
