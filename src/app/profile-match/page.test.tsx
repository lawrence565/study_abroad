import { render, screen } from '@testing-library/react';
import Page from '@/app/profile-match/page';

describe('profile match page', () => {
  it('shows the profile form and grouped recommendation results', async () => {
    render(
      await Page({
        searchParams: Promise.resolve({
          gpa: '2.5',
          standardizedScore: '50',
          country: 'UK',
        }),
      }),
    );

    expect(
      screen.getByRole('heading', { name: /^profile match$/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/gpa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/standardized score/i)).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /target country/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /^reach$/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /^match$/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /^safety$/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('heading', { name: /^boston university$/i, level: 3 })
        .length,
    ).toBeGreaterThan(1);
    expect(
      screen.getAllByText(/not modeled in this mvp|context only/i).length,
    ).toBeGreaterThan(0);
  });
});
