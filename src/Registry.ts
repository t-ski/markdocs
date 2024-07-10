import { Element } from "./element/Element";
import { BlockElement } from "./element/BlockElement";
import { InlineElement } from "./element/InlineElement";


export class Registry {
    public readonly blockElements: BlockElement[] = [];
    public readonly inlineElements: InlineElement[] = [];

    constructor(extending?: Registry) {
        this.blockElements.push(...(extending ? extending.blockElements : []));
        this.inlineElements.push(...(extending ? extending.inlineElements : []));
    }

    public registerElement(element: Element): this {
        (element instanceof BlockElement)
        && this.blockElements.push(element);
        (element instanceof InlineElement)
        && this.inlineElements.push(element);
        
        return this;
    }
}