# markdocs

Simple and fast markdown to HTML translator supporting custom elements.

## Installation

``` bash
npm i t-ski/markdocs
```

``` js
const markdocs = require("t-ski/markdocs");
```

## Translation

### String

``` js
const result = markdocs.translateStr(`
    # Title

    This is a **paragraph**.
`);
```

↳

``` html
<h1>Title</h1>
<p>
    This is a <b>paragraph</b>.
</p>
```

### File

``` js
const result = markdocs.translateStr("./docs/INTRO.md");
```

## Custom Elements

### Block Elements

Indicated with a line prefix followed by a space character.

``` js
new markdocs.BlockElement("Custom Block Element", "q" , "div", "|");
```

### Fenced Block Elements

Indicated with a line prefix followed by a space character. Respectively fencing content until the next prefix occurrence.

``` js
new markdocs.FencedBlockElement("Custom Fenced Block Element", code => {
    return `<div class="custom-fenced">\n\t${code}\n</div>`;
} , null, "|");
```

### Inline Elements

``` js
new markdocs.InlineElement("Custom Inline Element", "span" , null, "::");
```

## Default Elements (markdown syntax)

- [x] Headings {1, ... , 6}
```
# Heading {#optional-id}
```

- [x] Blockquote  
```
> Blockquote...
```

- [x] Ordered List  
```
1. List item
2. List item
```

- [x] Unordered List  
```
- List item
- List item
```

- [x] Horizontal Rule  
```
---
```

- [x] Table  
```
| Table head 1    | Table head 2    |
| --------------- | --------------: |
| Table entry 1.1 | Table entry 2.1 |
| Table entry 1.2 | Table entry 2.2 |
```

- [x] Fenced Code  
```
``` js
alert("Hello world!");
```
```

- [x] Link  
```
[Click here](./link.html)
```

- [x] Image  
```
![Logo](./img/logo.svg)
```

- [x] Bold  
```
**Bold text**
```

- [x] Italic  
```
*Italic text*
```

- [x] Strikethrough  
```
~Strikethrough text~
```

- [x] Highlight  
```
==Highlighted text==
```

- [x] Subscript  
```
A~sub~
```

- [x] Superscript  
```
B^sup^
```

- [x] Inline code  
```
```INLINE CODE```
```