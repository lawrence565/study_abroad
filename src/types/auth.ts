export type DemoRole = 'guest' | 'basic' | 'verified';

export type DemoSession = {
  role: DemoRole;
  isVerified: boolean;
  displayName: string;
};
