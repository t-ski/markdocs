# markdocs

Simple and fast Markdown to HTML translator supporting custom elements.

## Installation

``` bash
npm i @t-ski/markdocs
```

``` js
const markdocs = require("t-ski/markdocs");
```

## Translation

### From string

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

### From file

``` js
const result = markdocs.translateFile("./docs/INTRO.md");
```

#### Overloads

• Invoke callback on translation result:

``` js
const result = markdocs.translateFile("./docs/INTRO.md", result => {
    console.log(`Length of HTML representation: ${result.length}`);
});
```

• Write translation result to file at given path:

``` js
const result = markdocs.translateFile("./docs/INTRO.md", "./web/introduction.html");
```

## Block Elements

Each line in Markdown code represents a block element (a paragraph if not specific). A block element is indicated with a line prefix followed by a space character. The succeeding character sequence is considered its content.

### Declaration syntax

```
new markdocs.BlockElement(tokenName, tagNameOrWrapper, prefix, groupTagName, options)
```

| Parameter | Type | Purpose |
| --------- | ---- | ------- |
| `tokenName` | **String** | *Token name for internal organization* |
| `tagNameOrWrapper` | **String, Function** | *Tag name (automatic) or function for (custom) wrapping* |
| `prefix` | **String, RegExp** | *Prefix to associate with the element (RegExp escaped if given a string)* |
| `groupTagName` | **String** | *Element compound group name to inject surrounding tag upon translation* |
| `options` | **Object** | *Options object* |

### Options

| Property | Type | Purpose |
| -------- | ---- | ------- |
| `type` | **BlockElement.Type** | *Block element type* |
| `inlineStyles` | **Boolean** | *Whether to parse inline elements and apply related styles to the element content* |

### Block element types

| Name | Description |
| ---- | ----------- |
| `FENCED` | *A block is opened until the next occurrence of the prefix (acting as a suffix). The lines in between are representing the respective block content.* |
| `STANDALONE` | *A block does only consist of the prefix and does not allow for content. A standlone block is rendered as an empty tag.* |

### Custom wrapper

A custom wrapper function is getting passed either a content string or – iff associated with a fenced element – a content string array with the indicating line content (index 0), the spanned body contents (index 1, concatenated lines) and the closing line content (index 2). The returned value is used as the wrapped substitute for the raw parsing in the translation.

### Example

``` js
new markdocs.BlockElement("Custom Block Element", "q", "|", "div");
```

``` js
new markdocs.BlockElement("Custom Fenced Block Element", code => {
    return `<div class="custom-fenced">\n${code}\n</div>`;
}, "|", null, {
    inlineStyles: false,
    type: BlockElement.Type.FENCED
});
```

## Inline Elements

Inline elements represent a certain (recurring) pattern occurrence in block contents. They are used for applying generic styles.

### Declaration syntax

```
new markdocs.InlineElement(tokenName, tagNameOrWrapper, pattern, options)
```

| Parameter | Type | Purpose |
| --------- | ---- | ------- |
| `tokenName` | **String** | *Token name for internal organization* |
| `tagNameOrWrapper` | **String, Function** | *Tag name (automatic) or function for (custom) wrapping* |
| `pattern` | **RegExp** | *Occurrence pattern* |
| `options` | **Object** | *Options object* |

### Options

| Property | Type | Purpose |
| -------- | ---- | ------- |
| `priority` | **Number** | *Numeric (increasing) value to manipulate the parsing order (useful for ambiguous contexts)* |

### Example

``` js
new markdocs.InlineElement("Custom Inline Element", "span" , "::");
```
  
---

## Default Elements (supported MD)

### Block elements

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

### Inline elements

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

## 

<sub>© Thassilo Martin Schiepanski</sub>
