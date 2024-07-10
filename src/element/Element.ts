export interface IConfig {
    affix: string;
    tagName: string;
}


export abstract class Element {
    public readonly name: string;
    public readonly config: IConfig;

    constructor(name: string, config: IConfig) {
        this.name = name;
        this.config = config;
    }

    public abstract lookahead(sequence: string): boolean;
}