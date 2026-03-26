import { render, screen } from '@testing-library/react';
import Page from '@/app/explorer/page';

describe('explorer page', () => {
  it('shows the search controls and seeded school cards by default', async () => {
    render(await Page({ searchParams: Promise.resolve({}) }));

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

  it('shows an empty state when filtered results are empty', async () => {
    render(
      await Page({
        searchParams: Promise.resolve({
          q: 'quantum basket weaving',
          country: 'US',
        }),
      }),
    );

    expect(
      screen.getByText(/no schools match your search/i),
    ).toBeInTheDocument();
  });
});
