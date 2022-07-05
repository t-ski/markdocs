const { BlockElement, FencedBlockElement, InlineElement } = require("./Element");


const config = require("./config.json");


// BLOCK ELEMENTS

new BlockElement("Paragraph", null, "p"); // Will always check positively (default element); is used last due to reverse strategy of loop

function wrapHeading(number) {
    return result => {
        const customId = result.match(/\s*\{\s*#([a-zA-Z0-9_-]+)\s*\}\s*$/i);

        return `<h${number}${customId ? ` id="${customId[1]}"` : ""}>${result.slice(0, customId ? -customId[0].length : result.length)}</h${number}>`;
    };
}

new BlockElement("Heading 1", wrapHeading(1), null, "#");
new BlockElement("Heading 2", wrapHeading(2), null, "##");
new BlockElement("Heading 3", wrapHeading(3), null, "###");
new BlockElement("Heading 4", wrapHeading(4), null, "####");
new BlockElement("Heading 5", wrapHeading(5), null, "#####");
new BlockElement("Heading 6", wrapHeading(6), null, "######");

new BlockElement("Blockquote", null, "blockquote", ">");

new BlockElement("Unordered List", "li", "ul", /(-|\*)/);    // TODO: Min 2?
new BlockElement("Unordered List", "li", "ol", /[0-9]\./);

new BlockElement("Horizontal Rule", "hr", null, "---", false, true); // TODO: More convenient construction

new FencedBlockElement("Fenced Code", "code", null, "```", true, false, true);

new BlockElement("Table Row", "tr", "table", config.artificialTableRowPrefix);

// INLINE ELEMENTS

new InlineElement("Bold", "b", null, "(\\*\\*|__)", 1);
new InlineElement("Italic", "i", null, "(\\*|_)");

new InlineElement("Inline Code", "code", null, "```");

new InlineElement("Strikethrough", "s", null, "~~", 1);
new InlineElement("Subscript", "sub", null, "~");
new InlineElement("Superscript", "sup", null, "\\^");
new InlineElement("Highlight", "em", null, "==");

new InlineElement("Link", code => {
    const parts = code.slice(1, -1).split("](", 2).map(p => p.trim());
    return `<a href="${parts[1]}">${parts[0]}</a>`;
}, null, /\[[^\]]+\]\([^\)]+\)/); // TODO: Allow for escape sequences?

new InlineElement("Image", code => {
    const parts = code.slice(2, -1).split("](", 2).map(p => p.trim());
    return `<img src="${parts[1]}" alt="${parts[0]}">`;
}, null, /!\[[^\]]+\]\([^\)]+\)/, 2);