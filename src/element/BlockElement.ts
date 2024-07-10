import { IConfig, Element } from "./Element";


export interface IBlockConfig extends IConfig {
    isContainer?: boolean;
    isInline?: boolean;
}


export class BlockElement extends Element {
    private static readonly defaultConfig: Partial<IBlockConfig> = {
        isContainer: true
    };

    public readonly config: IBlockConfig;

    constructor(name: string, config: IBlockConfig) {
        super(name, config);

        this.config = {
            ...BlockElement.defaultConfig,
            ...config
        };
    }
    
    public lookahead(line: string): boolean {
        throw new Error("Method not implemented.");
    }
}