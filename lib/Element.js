class Element {

    static registeredElements = [];

    static emptyTagNameOrWrappers = [
        "hr"
    ];

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

    wrap(line) {
        return this.customWrapper
        ? this.customWrapper(line)
        : (this.tagName
            ? `<${this.tagName}>${line}${!Element.emptyTagNameOrWrappers.includes(this.tagName) ? `</${this.tagName}>` : ""}`
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
    InlineElement
};