# Overview
This project is a lightweight and simple tool that converts markdown files into a minimalist webpages.

It's build with a minimalist mindset wich makes it highly flexible and easy to use:

- 1. copy the `source` folder and index.html in a folder
 - 2. add all markdownfiles you are interested in
 - 3. create a startpage.md wich will act as a homepage. link all your other markdownfiles there
  - 4. for further customization (titles,...) edit the index.html file 

✨Voliá✨ that's it!

To create a public Website upload your folder to Github and activate GithubPages with `main/root`.



# Features

Besides casual things like Headings, **bold text** and *italic text* there are many more functions supported.

- Link to Websites: [Gitub](https://github.com/thhaase)
- Link to other Markdownfiles: [Markdownfile](another_file.md)

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
