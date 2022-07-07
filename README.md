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
const result = markdocs.translateFile("./docs/INTRO.md");
```

## Custom Elements

### Block Elements

Indicated with a line prefix followed by a space character.

``` js
new markdocs.BlockElement("Custom Block Element", "q", "|" , "div");
```

With options:

``` js
new markdocs.BlockElement("Custom Fenced Block Element", code => {
    return `<div class="custom-fenced">\n\t${code}\n</div>`;
} , null, "|", {
    fenced: true,
    inlineStyles: false
});
```

#### Syntax

` new markdocs.BlockElement(tokenName, tagNameOrWrapper, prefix, groupTagName, options) `

| Parameter | Type | Purpose |
| --------- | ---- | ------- |
| `tokenName` | **String** |  *Token name for internal organization* |
| `tagNameOrWrapper` | **String, Function** | *Tag name (automatic) or function for (custom) wrapping* |
| `prefix` | **String, RegExp** | *Prefix to associate with the element (RegExp escaped if given a string)* |
| `groupTagName` | **String** | *Element compound group name to inject surrounding tag upon translation* |
| `options` | **Object** | *Options object* |

#### Options

| Property | Type | Purpose |
| -------- | ---- | ------- |
| `fenced` | **Boolean** | *Whether to have the element span content between an opening and a closing prefix (suffix)* |
| `inlineStyles` | **Boolean** | *Whether to parse inline elements and apply related styles to the element content* |
| `standalone` | **Boolean** | *Whether to only allow for the prefix and no content* |

### Inline Elements

``` js
new markdocs.InlineElement("Custom Inline Element", "span" , null, "::");
```

#### Syntax

` new markdocs.BlockElement(tokenName, tagNameOrWrapper, pattern, options) `

| Parameter | Type | Purpose |
| --------- | ---- | ------- |
| `tokenName` | **String** | *Token name for internal organization* |
| `tagNameOrWrapper` | **String, Function** | *Tag name (automatic) or function for (custom) wrapping* |
| `pattern` | **RegExp** | *Occurrence pattern* |
| `options` | **Object** | *Options object* |

#### Options

| Property | Type | Purpose |
| -------- | ---- | ------- |
| `priority` | **Number** | *Numeric (increasing) value to manipulate the parsing order (useful for ambiguous contexts)* |

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
<pre>
``` js
alert("Hello world!");
```
</pre>

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
<pre>
`INLINE CODE`
</pre>