import { render, screen } from '@testing-library/react';
import Page from '@/app/profile-match/page';

describe('profile match page', () => {
  it('shows the profile form and grouped recommendation results', async () => {
    render(
      await Page({
        searchParams: Promise.resolve({
          gpa: '2.5',
          testScore: '50',
          country: 'UK',
        }),
      }),
    );

    expect(
      screen.getByRole('heading', { name: /^profile match$/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/gpa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/test score/i)).toBeInTheDocument();
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
      screen.getAllByText(/target country matches this school/i).length,
    ).toBeGreaterThan(0);
  });
});
