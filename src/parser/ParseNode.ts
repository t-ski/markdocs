import { BlockElement } from "../element/BlockElement";


export class ParseNode {
    public readonly blockElement: BlockElement;
    public readonly children: ParseNode[] = [];

    public parent: ParseNode;

    constructor(blockElement: BlockElement) {
        this.blockElement = blockElement;
    }
    
    public appendChild(node: ParseNode) {
        node.parent = this;

        this.children.push(node);
    }
}

export type TParseTree = ParseNode;