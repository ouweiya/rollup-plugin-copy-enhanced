interface Options {
    minify?: boolean;
    context?: any;
}
declare function copyPlugin(src: string | string[], opts?: Options): {
    name: string;
    buildStart(): void;
    watchChange(id: string): void;
    buildEnd(): void;
};
export default copyPlugin;
