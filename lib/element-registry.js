const { BlockElement, InlineElement } = require("./Element");


// BLOCK ELEMENTS

new BlockElement("Heading 1", "h1", null, null, "#");
new BlockElement("Heading 2", "h2", null, null, "##");
new BlockElement("Heading 3", "h3", null, null, "###");
new BlockElement("Heading 4", "h4", null, null, "####");
new BlockElement("Heading 5", "h5", null, null, "#####");
new BlockElement("Heading 6", "h6", null, null, "######");

new BlockElement("Blockquote", null, null, "blockquote", ">");

new BlockElement("Horizontal rule", "hr", null, null, "---", true); // TODO: More convenient construction