import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
await writeFile('dist/.nojekyll', '');

await copyIfPresent('googleaadac00a0d8b2dac.html', 'dist/googleaadac00a0d8b2dac.html');
await copyIfPresent('CNAME', 'dist/CNAME');

async function copyIfPresent(source, destination) {
  try {
    await access(source);
    await copyFile(source, destination);
  } catch {
    // Optional static files are copied only when present.
  }
}
