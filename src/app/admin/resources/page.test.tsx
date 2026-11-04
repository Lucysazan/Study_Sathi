import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/admin/resources', () => ({
  listResourcesForAdmin: vi.fn().mockResolvedValue([
    {
      id: 'demo',
      title: 'Demo',
      provider: 'QA',
      category: 'Academic Education',
      topic: 'Assessment',
      description: 'Demo resource',
      language: 'English',
      age: '10–12',
      minAge: 10,
      maxAge: 12,
      format: 'Website',
      purpose: 'Independent Learning',
      url: 'https://example.com',
      note: '',
      verification: 'Checked',
      order: 1,
    },
  ]),
}));

vi.mock('@/components/admin/PortalHeader', () => ({
  PortalHeader: ({ title }: { title: string }) => <div>{title}</div>,
  StatusNote: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/admin/ResourceRowActions', () => ({
  ResourceRowActions: () => <span>actions</span>,
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('lucide-react', () => ({
  Plus: () => <svg />,
}));

import { AdminResourcesPage } from './page';

describe('AdminResourcesPage', () => {
  it('wraps resource loading in a Suspense boundary so session checks remain request-time', async () => {
    const page = await AdminResourcesPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve({}),
    });
    expect(page.type).toBe(React.Suspense);
  });
});
