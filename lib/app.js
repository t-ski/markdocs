
require("./element-registry");

const { Element, BlockElement, InlineElement } = require("./Element");


module.exports.translate = function(code) {
    const lines = code.trim().split(/\n/g);
    
    lines.forEach(line => {
        BlockElement.translate(line);
    });

    return Element.produceTranslation();
}