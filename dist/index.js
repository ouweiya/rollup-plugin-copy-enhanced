import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { minify } from 'html-minifier-terser';
function copyPlugin(src, shouldMinify) {
    const changedFiles = new Set();
    const watchedFiles = new Set();
    let isFirstBuild = true;
    async function emitFileFromPath(filePath, shouldMinify) {
        const parts = filePath.split(path.sep)[0];
        const destPath = path.relative(parts, filePath) || path.basename(filePath);
        const ext = path.extname(filePath).toLowerCase();
        let source;
        if (shouldMinify && ['.html', '.css', '.json'].includes(ext)) {
            source = await minify(fs.readFileSync(filePath, 'utf8'), {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true,
            });
        }
        else {
            source = fs.readFileSync(filePath);
        }
        this.emitFile({
            type: 'asset',
            fileName: destPath,
            source,
        });
    }
    const files = globSync(src, { nodir: true });
    return {
        name: 'copy-plugin',
        buildStart() {
            files.forEach(file => {
                this.addWatchFile(file);
                watchedFiles.add(file);
                if (isFirstBuild) {
                    emitFileFromPath.call(this, file, shouldMinify);
                }
            });
            isFirstBuild = false;
        },
        watchChange(id) {
            if (watchedFiles.has(id)) {
                changedFiles.add(id);
            }
        },
        buildEnd() {
            changedFiles.forEach(file => {
                emitFileFromPath.call(this, file, shouldMinify);
            });
            changedFiles.clear();
        },
    };
}
export default copyPlugin;
//# sourceMappingURL=index.js.map