const lib = require("./lib/api");


let testCounter = 0;


function test(code, expectedTranslation) {
    const unifyCode = code => {
        return code.replace(/\s*(<)|(>|\n)\s*/g, "$1$2");
    };

    const actualTranslation = lib.translate(code);

    testCounter++;
    
    if(unifyCode(actualTranslation) === unifyCode(expectedTranslation)) {
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
Also supports extensive syntax like ~~strikethrough~~, ~sub-~ and ^superscript^.
Highlighting via ==emphasized text==.

# Heading 2 (1) {#custom-id}

[Click here](/link-destination.html) to be redirected (link).

![An image](/image.png)

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

### Table and Fenced Code (special blocks) (3)

| Table head 1 | Table head 2 | Table head 3 |
| ------------ | ---: | --- |
| Entry 1.1 | Entry 2.1 |
| Entry 1.2 | Entry 2.2 | Entry 3.2 | Entry 4.2 (ignore) |

Malformed table:

| Table head 1 | Table head 2 | Table head 3 |
| ------------ | --- |
| Entry 1.1 | Entry 2.1 |

\`\`\` js
const a = 1;

alert(a);
\`\`\`
`, `
<h1>Heading 1 (1)</h1>
<p>
    <b>Bold text <i>italic</i> with nested inline styles</b> and an unstyled end.<br>
    Inline code like a <code>VARIABLE NAME</code> in a new line (break sensitivity).<br>
    Also supports extensive syntax like <s>strikethrough</s>, <sub>sub-</sub> and <sup>superscript</sup>.<br>
    Highlighting via <em>emphasized text</em>.<br>
</p>
<h1 id="custom-id">Heading 2 (1)</h1>
<p>
    <a href="/link-destination.html">Click here</a> to be redirected (link).<br>
    <br>
    <img src="/image.png" alt="An image"><br>
</p>
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
    This is a multiline blockquote.<br>
    Indicated from each line.
</blockquote>
<h3>Table and Fenced Code (special blocks) (3)</h3>
<table>
    <tr>
        <th>Table head 1</th>
        <th align="right">Table head 2</th>
        <th>Table head 3</th>
    </tr>
    <tr>
        <td>Entry 1.1</td>
        <td align="right">Entry 2.1</td>
    </tr>
    <tr>
        <td>Entry 1.2</td>
        <td align="right">Entry 2.2</td>
        <td>Entry 3.2</td>
    </tr>
</table>
<p>
    Malformed table:<br>
    <br>
    | Table head 1 | Table head 2 | Table head 3 |<br>
    | ------------ | --- |<br>
    | Entry 1.1 | Entry 2.1 |<br>
</p>
<code>js
    const a = 1;

    alert(a);
</code>
`);


console.log(`\x1b[32mAll tests (${testCounter}) have successfully passed.\n`);