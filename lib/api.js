const { readFileSync } = require("fs");
const { isAbsolute, join } = require("path");

const translate = require("./translate");


function translateFile(filePath) {
    filePath = !isAbsolute(filePath) ? join(require.main.path, filePath) : filePath;

    const fileContents = readFileSync(filePath);
    
    return translate(String(fileContents));
}


module.exports = {
    ...require("./Element"),
    
    translateStr: translate,
    translateFile: translateFile
}

// TODO: Use table element artificial block prefixes that are not used by custom elements too