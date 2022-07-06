const { BlockElement, InlineElement } = require("./Element");


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

new BlockElement("Horizontal Rule", "hr", null, "---", {
    standalone: true
}); // TODO: More convenient construction

new BlockElement("Fenced Code", "code", null, "```", {
    fenced: true,
    inlineStyles: false
});

// Preapred irregularly (see translation routine)
new BlockElement("Table Row", "tr", "table", config.artificialTableRowPrefix);

// INLINE ELEMENTS

new InlineElement("Bold", "b", "(\\*\\*|__)", {
    priority: 1
});
new InlineElement("Italic", "i", "(\\*|_)");

new InlineElement("Inline Code", "code", "`(``)?");

new InlineElement("Strikethrough", "s", "~~", {
    priority: 1
});
new InlineElement("Subscript", "sub", "~");
new InlineElement("Superscript", "sup", "\\^");
new InlineElement("Highlight", "em", "==");

new InlineElement("Link", code => {
    const parts = code.slice(1, -1).split("](", 2).map(p => p.trim());
    return `<a href="${parts[1]}">${parts[0]}</a>`;
}, /\[[^\]]+\]\([^\)]+\)/); // TODO: Allow for escape sequences?

new InlineElement("Image", code => {
    const parts = code.slice(2, -1).split("](", 2).map(p => p.trim());
    return `<img src="${parts[1]}" alt="${parts[0]}">`;
}, /!\[[^\]]+\]\([^\)]+\)/, {
    priority: 1
});