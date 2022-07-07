const { readFileSync, mkdir, writeFile } = require("fs");
const { join, isAbsolute, basename, dirname } = require("path");

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
 * @overload
 * @param {String} filePath Path to file on local machine (absolute or from CWD)
 * @param {String|Function} [resultOverload] [Overload argument]
 *                                          • None: Retrieve translation result string;
 *                                          • Function: Invoke callback with translation result;
 *                                          • String: Write translation results to file at path
 * @returns {String}                         [Overload return value]
 *                                          • None: Translation result string;
 *                                          • Function: Callback return value;
 *                                          • String: void
 */
function translateFile(filePath, resultOverload = null) {
    filePath = !isAbsolute(filePath) ? join(require.main.path, filePath) : filePath;

    const fileContents = readFileSync(filePath);
    const translationResults = translate(String(fileContents));
    
    if(!resultOverload) {
        return translationResults;                  // None
    }

    if(resultOverload instanceof Function) {
        return resultOverload(translationResults);  // Callback
    }
    
    resultOverload += !/\.html$/i.test(resultOverload)
    ? `/${basename(filePath).toLowerCase().replace(/\.md/i, ".html")}`
    : "";

    resultOverload = !isAbsolute(resultOverload)
    ? join(require.main.path, resultOverload) : resultOverload;
    
    mkdir(dirname(resultOverload), {         // File path
        recursive: true
    }, _ => {
        writeFile(resultOverload, translationResults, _ => {});
    });
}


module.exports = {
    translateStr: translate,
    translateFile
};