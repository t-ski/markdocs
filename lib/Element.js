class Element {

    static emptyTagNames = [
        "hr"
    ];
    static registeredElements = [];
    static translatedLines = [];

    static pushTranslatedLine(translatedLine, groupTagName) {
        Element.translatedLines.push({
            translatedLine, groupTagName
        });
    }

    static produceTranslation() {
        const preparedLines = [];

        let lastGroupTagName;

        Element.translatedLines.forEach(translationObj => {
            if(lastGroupTagName && (translationObj.groupTagName !== lastGroupTagName)) {
                (preparedLines[preparedLines.length - 1].trim().length === 0)
                && preparedLines.pop();

                (preparedLines[preparedLines.length - 1] === `<${lastGroupTagName}>`)
                ? preparedLines.pop()
                : preparedLines.push(`</${lastGroupTagName}>`);
            }

            (translationObj.groupTagName && translationObj.groupTagName !== lastGroupTagName)
            && preparedLines.push(`<${translationObj.groupTagName}>`);
            
            lastGroupTagName = translationObj.groupTagName;

            preparedLines.push(`${lastGroupTagName ? "    " : ""}${translationObj.translatedLine}`);
        });
        lastGroupTagName
        && preparedLines.push(`</${lastGroupTagName}>`);
        
        return preparedLines.join("\n");
    }

    constructor(tokenName, tagName, groupTagName, wrappingModifier) {
        this.tokenName = tokenName;
        this.tagName = tagName
        ? tagName.toLowerCase()
        : null;
        this.groupTagName = groupTagName
        ? groupTagName.toLowerCase()
        : null;;
        this.wrappingModifier = wrappingModifier;   // TODO: Attributes

        Element.registeredElements.push(this);
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

    static translate(line) {
        const prefix = (line.match(/^[^ ]+/) || [""])[0];
        
        for(const element of BlockElement.registeredElements) {
            const bareLine = line.slice(prefix.length).trim();

            if(element.standalone && bareLine.length > 0) {
                continue;
            }

            if((element.prefix instanceof RegExp)
            ? element.prefix.test(prefix)
            : element.prefix === prefix) {
                Element.pushTranslatedLine(element.wrap(bareLine), this.groupTagName);
                
                return;
            }
        }

        Element.pushTranslatedLine(line, "p")
    }

    constructor(tokenName, tagName, groupTagName, wrappingModifier, prefix, standalone = false) {
        super(tokenName, tagName, groupTagName, wrappingModifier);

        this.prefix = prefix;
        this.standalone = standalone;
    }
    
}

class InlineElement extends Element {

    static translate(line) {
        return line;
    }

    constructor(tokenName, tagName, groupTagName, wrappingModifier, pattern, patternEnd) {
        super(tokenName, tagName, groupTagName, wrappingModifier);

        this.pattern = pattern;
        this.patternEnd = patternEnd;
    }

}


module.exports = {
    Element,
    BlockElement,
    InlineElement
};