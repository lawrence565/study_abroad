import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/layout';
import Page from '@/app/page';

describe('landing page', () => {
  it('shows the MVP navigation and summary', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <RootLayout>
        <Page />
      </RootLayout>,
    );

    consoleErrorSpy.mockRestore();

    expect(
      screen.getByRole('heading', { name: /studyabroad hub/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /school explorer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /profile match/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /verification/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/community modules are deferred/i),
    ).toBeInTheDocument();
  });
});
