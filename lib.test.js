const lib = require("./lib/app");


let testCounter = 1;


function test(code, expectedTranslation) {
    const actualTranslation = lib.translate(code);

    if(actualTranslation === expectedTranslation) {
        testCounter++;

        return;
    }

    console.log(`Test ${testCounter} has failed:\n`);
    console.log(`––– CODE:\n${code}`);
    console.log(`––– EXPECTED:\n${expectedTranslation}`);
    console.log(`––– ACTAUL:\n${actualTranslation}`);

    process.exit(1);
}


test(`
# Heading 1
Text text text.

## Heading 2
`, `
<h1>Title 1</h1>
<p>Text Text Text</p>
<h2>Heading 2</h2>
`);


console.log("All tests have successfully passed.");