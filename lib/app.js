
require("./element-registry");

const { BlockElement, InlineElement } = require("./Element");


function arrayLast(arr) {
    return arr[arr.length - 1];
};


module.exports.translate = function(code) {
    const translatedLines = [];

    let lastGroupTagName;

    code.trim().split(/\n/g)
    .forEach(line => {
        const prefix = (line.match(/^[^ ]+/) || [""])[0];

        let curBlockElement;
        
        for(const element of BlockElement.registeredElements) {
            const bareLine = line.slice(prefix.length).trim();

            if(element.standalone && bareLine.length > 0) {
                continue;
            }
            
            if((element.prefix instanceof RegExp)    // p check initially
            ? (new RegExp(`^${element.prefix.source}$`)).test(prefix)
            : element.prefix === prefix) {
                curBlockElement = element;

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

            translatedLines.push(`</${lastGroupTagName}>`);
        }
        
        if(curBlockElement.groupTagName && !isOpenGroup) {
            if(line.trim().length === 0) {
                lastGroupTagName = null;

                return;
            }

            translatedLines.push(`<${curBlockElement.groupTagName}>`);
        }

        if(!curBlockElement.tagName && isOpenGroup) {
            translatedLines[translatedLines.length - 1] += "<br>"; // Intentional line breaks
        }
        
        curBlockElement.inlineStyles
        && InlineElement.registeredElements.forEach(element => {
            const isTrivialPattern = !(element.pattern instanceof RegExp);

            line = line.replace(new RegExp(
                isTrivialPattern
                ? `${element.pattern}.*${element.pattern}`
                : element.pattern.source
            , "g"), match => {
                return element.wrap(isTrivialPattern
                    ? match.replace(new RegExp(`(^${element.pattern})|(${element.pattern}$)`, "g"), "")
                    : match);
            });
        });
        
        lastGroupTagName = curBlockElement.groupTagName;
        
        translatedLines.push(`${curBlockElement.groupTagName ? "    " : ""}${line}`);
    });

    lastGroupTagName
    && translatedLines.push(`</${lastGroupTagName}>`);
    
    return translatedLines.join("\n");
}