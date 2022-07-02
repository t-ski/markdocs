const { BlockElement, InlineElement } = require("./Element");


// BLOCK ELEMENTS

new BlockElement("Heading 1", "h1", null, null, "#");
new BlockElement("Heading 2", "h2", null, null, "##");
new BlockElement("Heading 3", "h3", null, null, "###");
new BlockElement("Heading 4", "h4", null, null, "####");
new BlockElement("Heading 5", "h5", null, null, "#####");
new BlockElement("Heading 6", "h6", null, null, "######");

new BlockElement("Blockquote", null, "blockquote", null, ">");

new BlockElement("Horizontal rule", "hr", null, null, "---", false, true); // TODO: More convenient construction

/* new BlockElement("Table Head", "th", "table");
new BlockElement("Table Separator", "null", "table");
new BlockElement("Table Row", "tr", "table"); */ // TODO: Full line pattern match; introduce fenced block element type

// INLINE ELEMENTS

new InlineElement("Bold", "b", null, null, "(\\*\\*|__)", 1);
new InlineElement("Italic", "i", null, null, "(\\*|_)");

new InlineElement("Code", "code", null, null, "```");

new InlineElement("Strikethrough", "s", null, null, "~~", 1);
new InlineElement("Subscript", "sub", null, null, "~");
new InlineElement("Superscript", "sup", null, null, "\\^");
new InlineElement("Highlight", "em", null, null, "==");

new InlineElement("Link", "a", null, result => {
    return result;  // TODO: Implement (consider paradigm change first)
}, /\[[^\]]+\]\([^\)]+\)/); // TODO: Allow for escape sequences?