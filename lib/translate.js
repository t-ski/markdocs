const { readFileSync } = require("fs");
const { isAbsolute, join } = require("path");

const util = require("./util");

require("./element-registry");
const { Element } = require("./Element");


const config = require("./config.json");


/**
 * Translate raw markdown code.
 * Prepare tables in code in order to work with normal block parsing mechanism.
 * Substitute for line unique artifially prefixed block elements.
 * @param {String} code MD code
 * @returns {String} HTML code
 */
function translate(code) {
    // TABLE PREPARATION:
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
                    
                    return `${util.openTag(tagName, align ? {
                        "align": align
                    } : null)}${cell}${util.closeTag(tagName)}`;
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

    // APPLIED TRANSLATION:
    return Element.translate(code);
}


/**
 * Translate a supported markdown code containing plain text file.
 * @param {String} filePath Path to file on local machine (absolute or from CWD)
 * @returns {String} Translation
 */
function translateFile(filePath) {  // TODO: Write to .HTML?
    filePath = !isAbsolute(filePath) ? join(require.main.path, filePath) : filePath;

    const fileContents = readFileSync(filePath);
    
    return translate(String(fileContents));
}


module.exports = {
    translateStr: translate,
    translateFile
};