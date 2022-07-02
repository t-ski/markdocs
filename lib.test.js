const lib = require("./lib/app");


let testCounter = 1;


function test(code, expectedTranslation) {
    const unifyCode = code => {
        return code.replace(/\s*(<)|(>)\s*/g, "$1$2");
    };

    const actualTranslation = lib.translate(code);

    if(unifyCode(actualTranslation) === unifyCode(expectedTranslation)) {
        testCounter++;

        return;
    }

    const displayCode = (caption, code) => {
        console.log(`\x1b[1m\x1b[33m––– ${caption}:\x1b[0m\x1b[2m\x1b[3m\x1b[37m\n${code}\x1b[0m`);
    };

    console.log(`\n\x1b[31mTest ${testCounter} has failed:\n`);
    displayCode("CODE", code);
    displayCode("EXPECTED", expectedTranslation);
    displayCode("ACTAUL", actualTranslation);

    process.exit(1);
}


test(`
# Heading 1

Text Text Text.

## Heading 2

--- awdwa
`, `
<h1>Heading 1</h1>
<p>
    Text Text Text.
</p>
<h2>Heading 2</h2>
<hr>
`);


console.log("\x1b[32mAll tests have successfully passed.");