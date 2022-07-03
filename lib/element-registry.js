const { BlockElement, InlineElement } = require("./Element");


// BLOCK ELEMENTS

function wrapHeading(number) {
    return result => {
        const customId = result.match(/\s*\{\s*#([a-zA-Z0-9_-]+)\s*\}$/i);
        return `<h${number}${customId ? ` id="${customId[1]}"` : ""}>${result.slice(0, (customId ? -customId[0] : result).length)}</h${number}>`;
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

//new BlockElement("Fenced Code", "code", null, "```", true);

/* new BlockElement("Table Head", "th", "table");
new BlockElement("Table Separator", "null", "table");
new BlockElement("Table Row", "tr", "table"); */ // TODO: Full line pattern match; introduce fenced block element type

// INLINE ELEMENTS

new InlineElement("Bold", "b", null, "(\\*\\*|__)", 1);
new InlineElement("Italic", "i", null, "(\\*|_)");

new InlineElement("Inline Code", "code", null, "```");

new InlineElement("Strikethrough", "s", null, "~~", 1);
new InlineElement("Subscript", "sub", null, "~");
new InlineElement("Superscript", "sup", null, "\\^");
new InlineElement("Highlight", "em", null, "==");

new InlineElement("Link", result => {
    const parts = result.slice(1, -1).split("](", 2).map(p => p.trim());
    return `<a href="${parts[1]}">${parts[0]}</a>`;  // TODO: Implement (consider paradigm change first)
}, null, /\[[^\]]+\]\([^\)]+\)/); // TODO: Allow for escape sequences?

new InlineElement("Image", result => {
    const parts = result.slice(1, -1).split("](", 2).map(p => p.trim());
    return `<img src="${parts[1]}" alt="${parts[0]}">`;  // TODO: Implement (consider paradigm change first)
}, null, /!\[[^\]]+\]\([^\)]+\)/, 2); // TODO: Allow for escape sequences?