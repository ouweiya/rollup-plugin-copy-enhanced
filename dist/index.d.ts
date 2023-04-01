import type { Plugin } from 'rollup';
type FileType = {
    patterns: string[];
    rootDir: string;
};
declare const jsonMinify: ({ patterns, rootDir }?: FileType) => Plugin;
export default jsonMinify;
