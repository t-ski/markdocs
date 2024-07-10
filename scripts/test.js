const { readFileSync, readdirSync } = require("fs");
const { resolve, join } = require("path");
const { deepEqual } = require("assert");


global.API = require(resolve("./build/api.js"));

const COUNTER = {
    success: 0,
    failure: 0
};
const TEST_DIR_PATH = resolve("./test/");


readdirSync(TEST_DIR_PATH, { withFileTypes: true })
.filter((dirent) => dirent.isDirectory())
.forEach((directory) => {
    console.log(`\n\x1b[2m\x1b[34m• ${directory.name}:\x1b[0m`);
    const registry = require(join(directory.path, directory.name, "_registry.js"));
    const transpileFunc = (md) => global.API.transpile(md, registry);

    readdirSync(join(directory.path, directory.name), { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .filter((file) => /\.md$/.test(file.name))
    .forEach((file) => {
        console.log(`\n\x1b[34m↳ \x1b[1m${file.name.replace(/\.md$/, "")}:\x1b[0m\n`);
        
        const md = readFileSync(join(file.path, file.name)).toString();
        const html = readFileSync(join(file.path, file.name.replace(/\.md$/, ".html"))).toString();
        try {
            const removeRedundantWhitespace = (str) => str.replace(/\s{2,}/g, " ");
            deepEqual(removeRedundantWhitespace(transpileFunc(md)), removeRedundantWhitespace(html));
            console.log("\x1b[32m✓ Success\x1b[0m");

            COUNTER.success++;
        } catch(err) {
            console.log("\x1b[31m✗ Failure:\x1b[0m");
            console.log("\n\x1b[1m\x1b[2m\x1b[33mEXPECTED:\x1b[0m\n");
            console.log(err.expected);
            console.log("\n\x1b[1m\x1b[2m\x1b[33mACTUAL:\x1b[0m\n");
            console.log(err.actual);

            COUNTER.failure++;
        }
    });
});


console.log(`\x1b[${COUNTER.failure ? 31 : 32}m${
    `→ \x1b[1m${COUNTER.success}/${COUNTER.success + COUNTER.failure}\x1b[22m test cases successful.`
}\x1b[0m`);
COUNTER.failure && process.exit(1);