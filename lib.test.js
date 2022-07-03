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
# Heading 1 (1)

**Bold text *italic* with nested inline styles** and an unstyled end.
Inline code like a \`\`\`VARIABLE NAME\`\`\` in a new line (break sensitivity).
Also supports extensive syntax like ~~Strikethrough~~, ~sub-~ and ^superscript^.
Highlighting via ==emphasized text==.

# Heading 2 (1)

[Click here](/link-destination.html) to be redirected (link).

## Unordered List (2)

- List item 1
- List item 2

## Ordered List (2)

1. List item 1
2. List item 2
2. List item 3

---

> This is a multiline blockquote.
> Indicated from each line.
`, `
<h1>Heading 1 (1)</h1>
<p>
    <b>Bold text <i>italic</i> with inline styles</b> and an unstyled end.<br>
    Inline code like a <code>VARIABLE NAME</code> in a new line (break sensitivity).<br>
    Also supports extensive syntax like <s>strikethrough</s>, <sub>sub-</sub> and <sup>superscript</sup>.<br>
    Highlighting via <em>emphasized text</em>.
</p>
<h1>Heading 1 (1)</h1>
<h2>Unordered List (2)</h2>
<ul>
    <li>List item 1</li>
    <li>List item 2</li>
</ul>
<h2>Ordered List (2)</h2>
<ol>
    <li>List item 1</li>
    <li>List item 2</li>
    <li>List item 3</li>
</ol>
<hr>
<blockquote>
    This is a multiline blockquote.
    Indicated from each line.
</blockquote>
`);


console.log("\x1b[32mAll tests have successfully passed.\n");