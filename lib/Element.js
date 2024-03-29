const util = require("./util");


/**
 * Abstract class representing a syntax element.
 * A syntax element must be either of type block or inline.
 * Inline elements occur in block contents only.
 */
class Element {

    static registeredElements = [];

    /**
     * Translate complete markdown (+ possible extensions) code.
     * Utilize from globel translation API.
     * @param {String} code MD code
     * @returns {String} HTML code
     */
    static translate(code) {
        return BlockElement.translate(code);
    }

    /**
     * Create an element.
     * Elements base on a token name for internal organization
     * and either a tag name to use for wrapping occurrences
     * or a function to invoke on the parsed contents to wrap
     * the element in a custom mann er.
     * @param {String} tokenName Internal name 
     * @param {String|Function} tagNameOrWrapper Tag name or function for wrapping
     */
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

    /**
     * Default wrapper.
     * Wraps a sequence in accordance with the provided property.
     * Either applies the custom wrapper function or surrounds the
     * sequence with the associated tag name.
     * @param {String} sequence Sequence to wrap
     * @param {Boolean} [isEmpty] Whether the element tag should be coded empty (no closing tag)
     * @returns {String} Wrapped sequence
     */
    wrap(sequence, isEmpty = false) {
        return this.customWrapper
        ? this.customWrapper(sequence)
        : (this.tagName
            ? `<${this.tagName}>${sequence}${(sequence && (sequence.length > 0) && !isEmpty) ? `</${this.tagName}>` : ""}`
            : sequence);
    }
    
}


/**
 * Concrete class representing a block element.
 * Block elements to be indicated in a MD line with a certain unique prefix
 * followed by a space (e.g. '## ').
 * Logically, any line (or line compound) represents a single block).
 */
class BlockElement extends Element {

    static paragraphElement;

    static Type = {
        DEFAULT: 0,
        STANDLONE: 1,
        FENCED: 2
    };

    /**
     * Translate code.
     * @param {String} code MD code
     * @returns {String} HTML code
     */
    static translate(code) {
        const translatedLines = [];
        const openFence = {
            element: null,
            in: null,
            content: []
        };

        let lastGroupTagName;

        code.trim().split(/\n/g)
        .forEach(line => {
            const prefix = (line.match(/^[^ ]+/) || [""])[0];
            const bareLine = line.slice(prefix.length).trim();

            if(openFence.element) {
                if(prefix === (openFence.element || {}).prefix) {
                    translatedLines.push(openFence.element.wrap([
                        openFence.in,
                        openFence.content.join("\n"),
                        bareLine
                    ]));

                    openFence.element = null;
                    openFence.content = [];
                } else {
                    line = openFence.element.options.inlineStyles
                    ? InlineElement.translate((openFence.lines || []).join("\n"))
                    : line;

                    openFence.content.push(line);
                }

                return;
            }

            let curBlockElement;
            
            for(const element of BlockElement.registeredElements) {
                if((element.options.type === BlockElement.Type.STANDALONE) && bareLine.length > 0) {
                    continue;
                }
                
                if((element.prefix instanceof RegExp)    // p check initially
                ? (new RegExp(`^${element.prefix.source}$`)).test(prefix)
                : element.prefix === prefix) {
                    curBlockElement = element;

                    if(curBlockElement.options.type === BlockElement.Type.FENCED) {
                        openFence.element = curBlockElement;
                        openFence.in = bareLine;

                        break;
                    }

                    line = curBlockElement.wrap(bareLine);

                    break;
                }
            }

            curBlockElement = !curBlockElement
            ? BlockElement.paragraphElement
            : curBlockElement;
            
            const isOpenGroup = lastGroupTagName && (lastGroupTagName === curBlockElement.groupTagName);

            if(lastGroupTagName && !isOpenGroup) {
                (translatedLines[translatedLines.length - 1].trim().length === 0)
                && translatedLines.pop();

                translatedLines.push(util.closeTag(lastGroupTagName));
            }
            
            if(curBlockElement.groupTagName && !isOpenGroup) {
                if(line.trim().length === 0) {
                    lastGroupTagName = null;

                    return;
                }

                translatedLines.push(util.openTag(curBlockElement.groupTagName));
            }

            if(!curBlockElement.tagName && isOpenGroup) {
                translatedLines[translatedLines.length - 1] += "<br>"; // Intentional line breaks
            }
            
            line = curBlockElement.options.inlineStyles
            ? InlineElement.translate(line)
            : line;
            
            lastGroupTagName = curBlockElement.groupTagName;
            
            !openFence.element
            && translatedLines.push(`${curBlockElement.groupTagName ? "    " : ""}${line}`);
        });

        lastGroupTagName
        && translatedLines.push(util.closeTag(lastGroupTagName));
        
        return translatedLines.join("\n").trim();
    }

    /**
     * Create a block element.
     * Blocks can be associated with a group in order to have a surrounding
     * tag injected upon translation.
     * Options: {
     *   fenced: <Whether the block is to be parsed multiline (open and close)>,
     *   inlineStyles: <Whether to parse inline elements on the block contents>,
     *   standalone: <Whether the block is prefix only (no contents)>,
     *   surrounded: <Whether to have each prefixed line surrounded (not only prepended)>
     * }
     * // TODO: Optimize options (exclusion behavior)
     * @param {String} tokenName 
     * @param {String|Function} tagNameOrWrapper 
     * @param {String|RegExp} prefix Prefix to associate with the element (RegExp escaped if given a string)
     * @param {String} [groupTagName] Group tag name
     * @param {Object} [options] Options object
     */
    constructor(tokenName, tagNameOrWrapper, prefix, groupTagName, options = {}) {
        super(tokenName, tagNameOrWrapper);
        
        this.prefix = prefix;
        this.groupTagName = groupTagName
        ? groupTagName.toLowerCase()
        : null;
        
        this.options = {
            // Defaults:
            inlineStyles: true,
            type: BlockElement.Type.DEFAULT,

            ...options
        };

        if(tokenName === "Paragraph") {
            BlockElement.paragraphElement = this;

            return;
        }
        
        BlockElement.registeredElements.unshift(this);
    }

    /**
     * Wrap block element contents.
     * @param {String} sequence Block contents
     * @returns {String} Wrapped block contents
     */
    wrap(sequence) {
        if(this.options.type === BlockElement.Type.FENCED) {
            sequence[1] = sequence[1].trim().replace(/(^|\n)/g, "$1\t");

        }

        sequence = (this.options.type === BlockElement.Type.FENCED && !this.customWrapper)
        ? sequence.join("\n")
        : sequence;
        
        return super.wrap(sequence, (this.options.type === BlockElement.Type.STANDALONE));
    }
    
}

class InlineElement extends Element {

    /**
     * Translate block contents.
     * @param {String} line Block contents
     * @returns 
     */
    static translate(contents) {
        InlineElement.registeredElements
        .forEach(element => {
            const isTrivialPattern = !(element.pattern instanceof RegExp);

            contents = contents.replace(new RegExp(
                isTrivialPattern
                ? `${element.pattern}.*${element.pattern}`
                : element.pattern.source
            , "g"), match => {
                return element.wrap(isTrivialPattern
                    ? match.replace(new RegExp(`(^${element.pattern})|(${element.pattern}$)`, "g"), "")
                    : match);
            });
        });

        return contents;
    }

    /**
     * Create an inline element.
     * Inline elements represent a substring style to apply on any matched occurrence
     * in block contents.
     * Options: {
     *   priority: <Numeric parsing priority (higher -> earlier) to use on ambiguous contexts>
     * }
     * @param {String} tokenName 
     * @param {String|Function} tagNameOrWrapper 
     * @param {RegExp} pattern Occurrence pattern
     * @param {Object} [options] Options object
     */
    constructor(tokenName, tagNameOrWrapper, pattern, options = {}) {
        super(tokenName, tagNameOrWrapper);

        this.pattern = pattern;
        
        this.options = {
            // Defaults:
            priority: 0,

            ...options
        };

        InlineElement.registeredElements.unshift(this);

        InlineElement.registeredElements.sort((a, b) => {
            return b.options.priority - a.options.priority;
        });
    }

}


module.exports = {
    Element,
    BlockElement,
    InlineElement
};
