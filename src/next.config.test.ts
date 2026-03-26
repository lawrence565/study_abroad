import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vi } from 'vitest';

describe('next config', () => {
  it('pins output file tracing to the repository root independently of cwd', async () => {
    const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue('/tmp/not-the-repo');

    try {
      vi.resetModules();
      const { default: nextConfig } = await import('../next.config');

      expect(nextConfig.outputFileTracingRoot).toBe(repoRoot);
    } finally {
      cwdSpy.mockRestore();
    }
  });
});
