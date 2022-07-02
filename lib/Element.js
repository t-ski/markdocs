class Element {

    static emptyTagNames = [
        "hr"
    ];

    constructor(tokenName, tagName, groupTagName, wrappingModifier) {
        this.tokenName = tokenName;
        this.tagName = tagName
        ? tagName.toLowerCase()
        : null;
        this.groupTagName = groupTagName
        ? groupTagName.toLowerCase()
        : null;;
        this.wrappingModifier = wrappingModifier;   // TODO: Attributes
    }

    wrap(line) {
        line = this.tagName
        ? `<${this.tagName}>${line}${!Element.emptyTagNames.includes(this.tagName) ? `</${this.tagName}>` : ""}`
        : line;
        
        return this.wrappingModifier
        ? this.wrappingModifier(line)
        : line;
    }
    
}

class BlockElement extends Element {

    static registeredElements = [];

    constructor(tokenName, tagName, groupTagName, wrappingModifier, prefix, inlineStyles = true, standalone = false) {
        super(tokenName, tagName, groupTagName, wrappingModifier);

        this.prefix = prefix;
        this.standalone = standalone;

        BlockElement.registeredElements.push(this);
    }
    
}

class InlineElement extends Element {

    static registeredElements = [];

    constructor(tokenName, tagName, groupTagName, wrappingModifier, pattern, priority = 0) {
        super(tokenName, tagName, groupTagName, wrappingModifier);

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