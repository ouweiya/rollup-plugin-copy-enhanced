import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { PluginContext } from 'rollup';
import { minify } from 'html-minifier-terser';

function copyPlugin(src: string | string[], shouldMinify?: boolean) {
    const changedFiles: Set<string> = new Set();
    const watchedFiles: Set<string> = new Set();
    let isFirstBuild = true;

    async function emitFileFromPath(this: PluginContext, filePath: string, shouldMinify?: boolean) {
        const parts = filePath.split(path.sep)[0];
        const destPath = path.relative(parts, filePath) || path.basename(filePath);
        const ext = path.extname(filePath).toLowerCase();
        let source: string | Buffer;

        if (shouldMinify && ['.html', '.css', '.json'].includes(ext)) {
            // console.log('压缩');
            source = await minify(fs.readFileSync(filePath, 'utf8'), {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true,
            });
        } else {
            // console.log('不压缩');
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
                // console.log('监视');

                if (isFirstBuild) {
                    emitFileFromPath.call(this, file, shouldMinify);
                }
            });

            isFirstBuild = false;
        },
        watchChange(id: string) {
            if (watchedFiles.has(id)) {
                changedFiles.add(id);
            }
        },
        buildEnd() {
            // console.log('changedFiles', changedFiles);
            changedFiles.forEach(file => {
                emitFileFromPath.call(this, file, shouldMinify);
            });
            changedFiles.clear();
        },
    };
}

export default copyPlugin;
