import { TParseTree, Parser } from "./parser/Parser";
import { Registry } from "./Registry";


export { Parser } from "./parser/Parser";
export { Registry } from "./Registry";

export * as registries from "./registries/registries";

export function transpile(markdown: string, elementRegistry: Registry): string {
    const parser = new Parser(elementRegistry);

    const parseTree: TParseTree = parser.parse(markdown);
    
    return "";
}