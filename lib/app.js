
require("./element-registry");

const { BlockElement, InlineElement } = require("./Element");


function arrayLast(arr) {
    return arr[arr.length - 1];
};


function translateBlock(line) {
    const prefix = (line.match(/^[^ ]+/) || [""])[0];
        
    for(const element of BlockElement.registeredElements) {
        const bareLine = line.slice(prefix.length).trim();

        if(element.standalone && bareLine.length > 0) {
            continue;
        }
        
        if((element.prefix instanceof RegExp)
        ? (new RegExp(`^${element.prefix.source}$`)).test(prefix)
        : element.prefix === prefix) {
            return {
                translatedLine: element.wrap(bareLine),
                groupTagName: element.groupTagName,
                noInlineStyles: element.noInlineStyles
            };
        }
    }

    return {
        translatedLine: line,
        groupTagName: "p"
    };
}

function translateInline(line) {
    InlineElement.registeredElements.forEach(element => {
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

    return line;
}


module.exports.translate = function(code) {
    const translatedLines = [];

    code.trim().split(/\n/g)
    .forEach(line => {
        const result = translateBlock(line);
        result.translatedLine = !result.noInlineStyles
        ? translateInline(result.translatedLine)
        : result.translatedLine;

        translatedLines.push(result);
    });

    const preparedLines = [];
    let lastGroupTagName;
    translatedLines.forEach(translationObj => {
        if(lastGroupTagName === "p" && translationObj.groupTagName === "p") {
            preparedLines[preparedLines.length - 1] += "<br>"; // Intentional paragraph line breaks
        }

        if(lastGroupTagName && (translationObj.groupTagName !== lastGroupTagName)) {
            (arrayLast(preparedLines).trim().length === 0)
            && preparedLines.pop();

            (arrayLast(preparedLines) === `<${lastGroupTagName}>`)
            ? preparedLines.pop()
            : preparedLines.push(`</${lastGroupTagName}>`);
        }

        // TODO: No empty lines around paragraph contents

        (translationObj.groupTagName && translationObj.groupTagName !== lastGroupTagName)
        && preparedLines.push(`<${translationObj.groupTagName}>`);
        
        preparedLines.push(`${translationObj.groupTagName ? "    " : ""}${translationObj.translatedLine}`);

        lastGroupTagName = translationObj.groupTagName;
    });
    lastGroupTagName
    && preparedLines.push(`</${lastGroupTagName}>`);
    
    return preparedLines.join("\n");
}