declare function copyPlugin(src: string | string[], shouldMinify?: boolean): {
    name: string;
    buildStart(): void;
    watchChange(id: string): void;
    buildEnd(): void;
};
export default copyPlugin;
