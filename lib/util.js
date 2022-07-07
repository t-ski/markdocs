module.exports.openTag = function(tagName, attributes = {}) {
    let attrStr = [];

    for(const attr in attributes) {
        attrStr.push(`${attr}="${attributes[attr]}"`);
    }

    return `<${tagName}${(attrStr.length > 0) ? ` ${attrStr.join(" ")}` : ""}>`;
}

module.exports.closeTag = function(tagName) {
    return `</${tagName}>`;
}