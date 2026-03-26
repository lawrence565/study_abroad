import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Page from '@/app/explorer/page';

describe('explorer page', () => {
  it('shows the search controls and seeded school cards by default', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Page />);

    consoleErrorSpy.mockRestore();

    expect(
      screen.getByRole('heading', { name: /school explorer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('searchbox', { name: /search schools/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /country/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /boston university/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/ranked #27/i)).toBeInTheDocument();
    expect(screen.getAllByText(/sat or act/i).length).toBeGreaterThan(0);
  });

  it('shows an empty state when filtered results are empty', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Page searchParams={{ q: 'quantum basket weaving', country: 'US' }} />);

    consoleErrorSpy.mockRestore();

    expect(
      screen.getByText(/no schools match your search/i),
    ).toBeInTheDocument();
  });
});
