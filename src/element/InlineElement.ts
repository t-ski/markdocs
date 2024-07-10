import { IConfig, Element } from "./Element";


export class InlineElement extends Element {
    constructor(name: string, config: IConfig) {
        super(name, config);
    }

    public lookahead(word: string): boolean {
        throw new Error("Method not implemented.");
    }
}