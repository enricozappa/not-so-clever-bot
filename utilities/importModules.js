import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';

async function importModules(folderName) {
  const modules = [];
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const projectRoot = join(currentDir, '..');

  try {
    const folderPath = join(projectRoot, folderName);
    const files = (await fs.readdir(folderPath)).filter((file) =>
      file.endsWith('.js')
    );

    for (const file of files) {
      const filePath = join(folderPath, file);
      const module = await import(`file://${filePath}`);

      modules.push(module?.event || module?.command);
    }

    return modules;
  } catch (error) {
    console.error('Error loading files =>', error);
  }
}

export default importModules;
