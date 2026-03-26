import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

describe('eslint config', () => {
  it('ignores generated next files and exposes a lint script', async () => {
    const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
    const eslintConfigSource = await readFile(
      resolve(repoRoot, 'eslint.config.mjs'),
      'utf8',
    );
    const packageJson = JSON.parse(
      await readFile(resolve(repoRoot, 'package.json'), 'utf8'),
    ) as {
      scripts?: Record<string, string>;
    };

    expect(eslintConfigSource).toContain("'next-env.d.ts'");
    expect(packageJson.scripts?.lint).toBe('eslint .');
  });
});
