# Features
- [Basics](#basics)
- [Links](#links)
  - [Hyperlinks](#hyperlinks)
  - [Markdownfiles](#markdownfiles)
  - [Sections](#sections)
- [Images](#images)
- [Tables](#tables)
- [Blockquotes](#blockquotes)
- [Expandable Text](#expandable-text)
- [Math](#math)
- [Codeblocks](#codeblocks)
- [Tips and Tricks](#tips-and-tricks)

## Formatting
### Basics
**Headings**
```markdown
# Heading 1
## Heading 2
### Heading 3
```

**Bold Text**
```markdown
**Bold Text**
__Bold Text__
```

*Italic Text*

```markdown
*Italic Text*
_Italic Text_
```

- Bullet
- Points
```markdown
- Bullet
- Points
```

- [x] Check
- [ ] List
```markdown
- [x] Check
- [ ] Lists
```

This whole Text is all in
one big line despite it being in 
multiple lines in the .md file.

A new line on the website is made via a free line in the markdown


New Paragraph with two free lines 


```markdown
This whole Text is all in
one big line despite it being in 
multiple lines in the .md file.

A new line on the website is made via a free line in the markdown


New Paragraph with two free lines 
```

## Links
### Hyperlinks
[Gitub](https://github.com/thhaase)
```markdown
[Gitub](https://github.com/thhaase)
```
### Markdownfiles
The markdown files need to be on the same level in the Projectfolder as the index.html

[Home](startpage.md)
```markdown
[Home](startpage.md)
```

### Sections 
You can Link sections of the same Markdowndocument

[Links](#links)
```markdown
[Links](#links)
``` 

## Images

Images must be saved in the _media_ directory.

![Image](jupiter.jpg|25)
```markdown
![Image](jupiter.jpg|25)
![description](filename.jpg|scaling)
```

## Tables
| Header1 | Header2 |
|-|----------|
| Cell1 | Cell2   |
| Cell3| Cell4   |

```markdown
| Header1 | Header2 |
|-|---------|
| Cell1 | Cell2   |
| Cell3| Cell4   |
```
## Blockquotes
> Blockquotes

```markdown
> Blockquotes
```

## Expandable Text
![Click to expand]{This text is expandable and hidden by default.}
```markdown
![Click to expand]{This text is expandable and hidden by default.}
```

## Math
### Inline
Here is an Inline Math example $\frac{d}{dt} \left( \frac{\partial L}{\partial \dot{q}_i} \right) - \frac{\partial L}{\partial q_i} = 0$. 
```latex
Here is an Inline Math example $\frac{d}{dt} \left( \frac{\partial L}{\partial \dot{q}_i} \right) - \frac{\partial L}{\partial q_i} = 0$. 
```

### Block
$$
i\hbar\frac{\partial}{\partial t}\Psi = -\frac{\hbar^2}{2m}\Delta\Psi + V\Psi
$$

```latex
$$
i\hbar\frac{\partial}{\partial t}\Psi = -\frac{\hbar^2}{2m}\Delta\Psi + V\Psi
$$
```

## Codeblocks
Syntaxhighlighting is only rudimentary but can be modified easily in _source/markdownParser.js_ right at the bottom of the script
```python
print("Hello World")
```
![](codeblockexample.png|20)

## Tips and Tricks

### Formatted Links
```markdown
// this does not work: 
[**Text**](link.md)

// this works:
**[Text](link.md)**
```

###  Inline Code 
Inline Code is not yet supported, I recommend using the other formatting options to make the Inline-Code stand out.