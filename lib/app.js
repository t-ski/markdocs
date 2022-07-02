

module.exports.translate = function(code) {
    const lines = code.split(/\n/g);
    
    lines.forEach(line => {
        console.log(line)
    });

    return code;
}