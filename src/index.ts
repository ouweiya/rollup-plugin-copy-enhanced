import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { PluginContext } from 'rollup';
import { minify } from 'html-minifier-terser';
import Handlebars from 'handlebars';

interface Options {
    minify?: boolean;
    context?: any;
}

function copyPlugin(src: string | string[], opts?: Options) {
    const changedFiles: Set<string> = new Set();
    const watchedFiles: Set<string> = new Set();
    let isFirstBuild = true;

    const minifyContent = (content: string) => {
        return minify(content, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
        });
    };

    async function emitFileFromPath(this: PluginContext, filePath: string, opts?: Options) {
        const parts = filePath.split(path.sep)[0];
        const destPath = path.relative(parts, filePath) || path.basename(filePath);
        const ext = path.extname(filePath).toLowerCase();
        let source: string | Buffer;

        if (ext === '.html') {
            const compiledHtml = Handlebars.compile(fs.readFileSync(filePath, 'utf8'))(opts?.context);
            if (opts?.minify) {
                source = await minifyContent(compiledHtml);
            } else {
                source = compiledHtml;
            }
        } else if (['.css', '.json'].includes(ext)) {
            if (opts?.minify) {
                source = await minifyContent(fs.readFileSync(filePath, 'utf8'));
            } else {
                source = fs.readFileSync(filePath, 'utf8');
            }
        } else {
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
        watchChange(id: string) {
            if (watchedFiles.has(id)) {
                changedFiles.add(id);
            }
        },
        buildEnd() {
            // console.log('changedFiles', changedFiles);
            changedFiles.forEach(file => {
                emitFileFromPath.call(this, file, opts);
            });
            changedFiles.clear();
        },
    };
}

export default copyPlugin;
