import { resolve } from 'node:path';
import nextConfig from '../next.config';

describe('next config', () => {
  it('pins output file tracing to the repository root', () => {
    expect(nextConfig.outputFileTracingRoot).toBe(resolve(process.cwd()));
  });
});
