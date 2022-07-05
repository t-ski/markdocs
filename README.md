# markdocs

Simple and fast markdown to HTML translator supporting custom elements.

## Installation

``` bash
npm i t-ski/markdocs
```

``` js
const markdocs = require("t-ski/markdocs");
```

## Usage

### Translation

#### String Sequence

``` js
const result = markdocs.translateStr(`
    # Title

    This is a **paragraph**.
`);
```

> <h1>Title</h1>
> <p>
>     This is a <b>paragraph</b>.
> </p>

#### From File

``` js
const result = markdocs.translateStr("./docs/INTRO.md");
```

### Custom Elements

#### Block Elements

Indicated with a line prefix followed by a space character.

``` js
new markdocs.BlockElement("Custom Block Element", "q" , "div", "|");
```

#### Fenced Block Elements

Indicated with a line prefix followed by a space character. Respectively fencing content until the next prefix occurrence.

``` js
new markdocs.FencedBlockElement("Custom Fenced Block Element", code => {
    return `<div class="custom-fenced">\n\t${code}\n</div>`;
} , null, "|");
```

#### Inline Elements

``` js
new markdocs.InlineElement("Custom Inline Element", "span" , null, "::");
```