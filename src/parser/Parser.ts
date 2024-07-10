import { Registry } from "../Registry";
import { TParseTree, ParseNode } from "./ParseNode";


export class Parser {
    private readonly registry: Registry;
    private readonly parseTree: TParseTree = new ParseNode(null);    // root

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    public parse(markdown: string): TParseTree {
        const lines: string[] = markdown.split(/\n/g);
        for(const line of lines) {
            for(const blockElement of this.registry.blockElements) {
                if(!blockElement.lookahead(line)) continue;
                
                break;
            }
        }
        
        return null;
    }
}