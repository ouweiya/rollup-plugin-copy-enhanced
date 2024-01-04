import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { minify } from 'html-minifier-terser';
import Handlebars from 'handlebars';
function copyPlugin(src, opts) {
    const changedFiles = new Set();
    const watchedFiles = new Set();
    let isFirstBuild = true;
    const minifyContent = (content) => {
        return minify(content, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
        });
    };
    async function emitFileFromPath(filePath, opts) {
        const parts = filePath.split(path.sep)[0];
        const destPath = path.relative(parts, filePath) || path.basename(filePath);
        const ext = path.extname(filePath).toLowerCase();
        let source;
        if (ext === '.html') {
            const compiledHtml = Handlebars.compile(fs.readFileSync(filePath, 'utf8'))(opts?.context);
            if (opts?.minify) {
                source = await minifyContent(compiledHtml);
            }
            else {
                source = compiledHtml;
            }
        }
        else if (['.css', '.json'].includes(ext)) {
            if (opts?.minify) {
                source = await minifyContent(fs.readFileSync(filePath, 'utf8'));
            }
            else {
                source = fs.readFileSync(filePath, 'utf8');
            }
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
                    emitFileFromPath.call(this, file, opts);
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
                emitFileFromPath.call(this, file, opts);
            });
            changedFiles.clear();
        },
    };
}
export default copyPlugin;
//# sourceMappingURL=index.js.map