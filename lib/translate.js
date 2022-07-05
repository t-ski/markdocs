require("./element-registry");

const { BlockElement, FencedBlockElement, InlineElement } = require("./Element");


const config = require("./config.json");


function openTag(tagName, attributes = {}) {
    let attrStr = [];

    for(const attr in attributes) {
        attrStr.push(`${attr}="${attributes[attr]}"`);
    }

    return `<${tagName}${(attrStr.length > 0) ? ` ${attrStr.join(" ")}` : ""}>`;
}

function closeTag(tagName) {
    return `</${tagName}>`;
}


module.exports = function(code) {

    // Prepare tables in code in order to work with normal block parsing mechanism
    // Substitute for line unique artifially prefixed block elements
    let index = 0;
    while(table = /(^|\n)(\|([^|\n]+\| *)+)\n(\|(( *(:?-+:?) *)\| *)+)\n(((\|([^|\n]+\| *)+)(\n|$))+)/.exec(code.slice(index))) {
        code = code.replace(table[0], _ => {
            const retrieveRow = row => {
                return row.trim().slice(1, -2).split(/\|/g)
                .map(c => c.trim())
            };

            index += code.slice(index).indexOf(table[0] + table[0].length);

            let headRow = retrieveRow(table[2]);
            const separatorRow = retrieveRow(table[4]);
            if(headRow.length !== separatorRow.length) {
                return table[0];
            }

            const alignment = separatorRow.map(cell => {
                return (cell.charAt(0) == ":")
                ? ((cell.slice(-1) == ":")
                    ? "center"
                    : "left")
                :((cell.slice(-1) == ":")
                    ? "right"
                    : null);
            });

            const wrapCells = (row, tagName) => {
                let colIndex = 0;

                return row
                .map(cell => {
                    const align = alignment[colIndex++];
    
                    return `${openTag(tagName, align ? {
                        "align": align
                    } : null)}${cell}${closeTag(tagName)}`;
                })
                .join("");
            };

            let dataRows = table[8].trim().split(/\n/g)
            .map(row => {
                return wrapCells(retrieveRow(row).slice(0, headRow.length), "td");
            });

            headRow = wrapCells(headRow, "th");
            
            dataRows.unshift(headRow);

            return dataRows
            .map(row => {
                return `${config.artificialTableRowPrefix} ${row}`;
            })
            .join("\n");
        });
    }


    const translatedLines = [];
    const openFence = {
        element: null,
        lines: null
    };

    let lastGroupTagName;

    // TODO: Multiline list item

    code.trim().split(/\n/g)
    .forEach(line => {
        const prefix = (line.match(/^[^ ]+/) || [""])[0];

        if(openFence.element) {
            if(prefix === (openFence.element || {}).prefix) {
                if(!(openFence.element.tagName instanceof Function)) {
                    translatedLines.push(openFence.element.wrap(openFence.lines.join("\n")));
                }

                openFence.element = null;
                openFence.lines = null;
            } else {
                openFence.lines.push(line);
            }

            return;
        }

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

                if(curBlockElement instanceof FencedBlockElement) {
                    openFence.element = curBlockElement;
                    openFence.lines = [bareLine];

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

            translatedLines.push(closeTag(lastGroupTagName));
        }
        
        if(curBlockElement.groupTagName && !isOpenGroup) {
            if(line.trim().length === 0) {
                lastGroupTagName = null;

                return;
            }

            translatedLines.push(openTag(curBlockElement.groupTagName));
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
        
        !openFence.element
        && translatedLines.push(`${curBlockElement.groupTagName ? "    " : ""}${line}`);
    });

    lastGroupTagName
    && translatedLines.push(closeTag(lastGroupTagName));
    
    return translatedLines.join("\n");
}