class Element {

    static registeredElements = [];

    constructor(tokenName, tagNameOrWrapper) {
        this.tokenName = tokenName;

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

    constructor(tokenName, tagNameOrWrapper, groupTagName, prefix, options = {}) {
        super(tokenName, tagNameOrWrapper);
        
        this.groupTagName = groupTagName
        ? groupTagName.toLowerCase()
        : null;
        this.prefix = prefix;
        
        this.options = {
            // Defaults:
            fenced: false,
            inlineStyles: true,
            standalone: false,

            ...options
        };

        if(tokenName === "Paragraph") {
            BlockElement.paragraphElement = this;

            return;
        }
        
        BlockElement.registeredElements.push(this);
    }

    wrap(line) {
        return super.wrap(this.options.fenced
            ? `${line.replace(/\n/g, "\n    ")}\n`
            : line, this.options.standalone);
    }
    
}

class InlineElement extends Element {

    constructor(tokenName, tagNameOrWrapper, pattern, options = {}) {
        super(tokenName, tagNameOrWrapper);

        this.pattern = pattern;

        this.options = {
            // Defaults:
            priority: 0,

            ...options
        };

        InlineElement.registeredElements.push(this);

        InlineElement.registeredElements.sort((a, b) => {
            return b.options.priority - a.options.priority;
        });
    }

}


module.exports = {
    BlockElement,
    InlineElement
};