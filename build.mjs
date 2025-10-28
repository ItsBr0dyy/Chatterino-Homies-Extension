import fs from 'node:fs/promises';

await fs.rm('build', { recursive: true, force: true }).catch(() => {});
await fs.mkdir('build');
await fs.mkdir('build/chrome');

await fs.cp('src', 'build/chrome', { recursive: true });

const mapManifest = async (path, fn) => {
  const json = JSON.parse(await fs.readFile(path, 'utf8'));
  fn(json);
  await fs.writeFile(path, JSON.stringify(json, null, 2), 'utf8');
};

// The manifest in src/ currently supports both browsers, but will show warnings
// about unsupported/unknown features. In "release" builds (i.e. builds
// submitted to the respective store), these unknown keys are deleted.
mapManifest('build/chrome/manifest.json', json => {
  delete json.background.scripts;
});

