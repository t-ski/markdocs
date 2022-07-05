class Element {

    static registeredElements = [];

    constructor(tokenName, tagNameOrWrapper, groupTagName) {
        this.tokenName = tokenName;
        
        this.groupTagName = groupTagName
        ? groupTagName.toLowerCase()
        : null;

        if(!tagNameOrWrapper) {
            return;
        }

        if(tagNameOrWrapper instanceof Function) { // Concept exclusive overload
            this.customWrapper = tagNameOrWrapper;
        } else {
            this.tagName = tagNameOrWrapper.toLowerCase();
        }
    }

    wrap(line, isEmpty = false) {
        return this.customWrapper
        ? this.customWrapper(line)
        : (this.tagName
            ? `<${this.tagName}>${line}${!isEmpty ? `</${this.tagName}>` : ""}`
            : line);
    }
    
}

class BlockElement extends Element {

    static paragraphElement;

    constructor(tokenName, tagNameOrWrapper, groupTagName, prefix, inlineStyles = true, standalone = false) {
        super(tokenName, tagNameOrWrapper, groupTagName);

        this.prefix = prefix;
        this.inlineStyles = inlineStyles;
        this.standalone = standalone;

        if(tokenName === "Paragraph") {
            BlockElement.paragraphElement = this;

            return;
        }
        
        BlockElement.registeredElements.push(this);
    }

    wrap(line) {
        return super.wrap(line, this.standalone);
    }
    
}

class FencedBlockElement extends BlockElement {

    constructor(tokenName, tagNameOrWrapper, groupTagName, prefix) {
        super(tokenName, tagNameOrWrapper, groupTagName, prefix, false);
    }

    wrap(concatLines) {
        return super.wrap(`${concatLines.replace(/\n/g, "\n    ")}\n`);
    }
}

class InlineElement extends Element {

    constructor(tokenName, tagNameOrWrapper, groupTagName, pattern, priority = 0) {
        super(tokenName, tagNameOrWrapper, groupTagName);

        this.pattern = pattern;
        this.priority = priority;

        InlineElement.registeredElements.push(this);

        InlineElement.registeredElements.sort((a, b) => {
            return b.priority - a.priority;
        });
    }

}


module.exports = {
    BlockElement,
    FencedBlockElement,
    InlineElement
};