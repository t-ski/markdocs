const { BlockElement, InlineElement } = require("./Element");


// BLOCK ELEMENTS

new BlockElement("Heading 1", "h1", null, "#");
new BlockElement("Heading 2", "h2", null, "##");
new BlockElement("Heading 3", "h3", null, "###");
new BlockElement("Heading 4", "h4", null, "####");
new BlockElement("Heading 5", "h5", null, "#####");
new BlockElement("Heading 6", "h6", null, "######");

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