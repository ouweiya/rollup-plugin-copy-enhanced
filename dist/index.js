import { readFileSync } from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
const jsonMinify = ({ patterns, rootDir } = { patterns: [], rootDir: '' }) => {
    const fileList = globSync(patterns, { cwd: rootDir });
    return {
        name: 'rollup-plugin-json-minify',
        async buildStart() {
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
//# sourceMappingURL=index.js.map