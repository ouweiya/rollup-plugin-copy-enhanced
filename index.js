import { readFileSync } from 'node:fs';
import path from 'node:path';
import glob from 'glob';

export default function jsonMinify({ patterns = [], rootDir = process.cwd() }) {
  let files = [];
  return {
    name: 'rollup-plugin-json-minify',
    async buildStart() {
      const filesListPromise = patterns.map(pattern => {
        return new Promise(resolve => {
          glob(pattern, { cwd: rootDir }, (er, files) => {
            resolve(files);
          });
        });
      });

      const filesList = await Promise.all(filesListPromise);
      files = filesList.reduce((acc, item) => acc.concat(item), []);
      files.forEach(file => {
        this.addWatchFile(path.resolve(rootDir, file));
      });
    },

    async generateBundle() {
      files.forEach(file => {
        const data = readFileSync(path.resolve(rootDir, file), 'utf-8');
        this.emitFile({
          type: 'asset',
          fileName: file,
          source: JSON.stringify(JSON.parse(data)),
        });
      });
    },
  };
}
