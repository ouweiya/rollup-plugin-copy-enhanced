import type { Plugin } from 'rollup';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
// import { createFilter } from '@rollup/pluginutils';
// import { fileURLToPath } from 'node:url';

type FileType = { patterns: string[]; rootDir: string };

const jsonMinify = ({ patterns, rootDir }: FileType = { patterns: [], rootDir: '' }): Plugin => {
  const fileList = globSync(patterns, { cwd: rootDir });
  return {
    name: 'rollup-plugin-json-minify',
    async buildStart() {
      // console.log('buildStart');
      fileList.forEach(f => {
        this.addWatchFile(path.resolve(rootDir, f));
      });
    },
    async generateBundle() {
      fileList.forEach(f => {
        const data = readFileSync(path.resolve(rootDir, f), 'utf-8');
        this.emitFile({
          type: 'asset',
          fileName: f,
          source: JSON.stringify(JSON.parse(data)),
        });
      });
    },
  };
};

export default jsonMinify;
