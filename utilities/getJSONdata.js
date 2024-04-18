import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';

async function getJSONdata() {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const projectRoot = join(currentDir, '..');

  try {
    const data = await fs.readFile(`${projectRoot}/data/data.json`, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON:', err);
  }
}

export default getJSONdata;
