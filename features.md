# Features

Besides casual things like Headings, **bold text** and *italic text* there are many more functions supported.

- Link to Websites: [Gitub](https://github.com/thhaase)
- Link to other Markdownfiles: [hahalala](how_to_use.md)


![Image](jupiter.jpg|25)

- Intuitive Linebreaks
- Codeblocks and `inline code`
- Horizontal lines 
- Tables


```markdown
# markdown
![Image](jupiter.jpg|25)
$a^2 + b^2 = c^2$
```


| Header1 | Header2 |
|---------|---------|
| Cell1   | Cell2   |
| Cell3   | Cell4   |


> Blockquotes

- Tasklist  

- [x] Checked item
- [ ] Unchecked item

---

![Click to expand]{This text is expandable and hidden by default.}


- Math $a^2 + b^2 = c^2$ and \( x^2 \)


$$
i\hbar\frac{\partial}{\partial t}\Psi = -\frac{\hbar^2}{2m}\Delta\Psi + V\Psi
$$




## Warnings

### formatted links
```markdown
// this does not work: 
[**Text**](link.md)

// this works:
**[Text](link.md)**
```