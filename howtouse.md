# How To Use

In these instructions, I assume that a folder with markdown notes already exists

Jump to the big picture outline of how the project works:

- [How does it work](#how-does-it-work)

## Step 1

Download the ZIP File

![](howtouse1.png|80)

## Step 2

After unzipping copy the following the folder with your markdownfiles

- "source" (folder)
- "index.html" (file)

## Step 3

Create new files/folders with the following names: 

- "media" (folder)
- "startpage.md" (file)

Your projectfolder should look similar to this:

```markdown
.
├── media
├── source
├── index.html
├── startpage.md
├── note1.md
├── note2.md
└── note3.md
```

## Step 4

- Link all the Markdown Notes in the startpage.md file as you would in a normal Markdownfile. 
  - [Features](features.md)

- Customize the header and navigationbar in the _index.html_ and _source/page.html_
  - Line 6: "Tab-Title in Browser"
  - Line 13: "Title"
  - Line 14-21: Navigation Bar (delete or change as you like)



# How does it work

```markdown
.
├── media
├── source
│   ├── katex
│   ├── markdownParser.js
│   ├── page.html
│   ├── second
│   ├── second.css
│   ├── standard
│   ├── standard.css
│   └── themeswitcher.js
├── index.html
└── startpage.md
```

_index.html_ and _page.html_ contain scripts that produces the website via markdownfiles. _Index.html_ is essentially the same as _page.html_ with the difference that _index.html_ only produces a webpage out of startmage.md. 



_page.html_ on the other hand uses the "pageName" variable to create webpages out of all the other markdownfiles. These other markdownfiles will act as subpages, once linked to _startpage.md_.

```javascript
// ... (line 53)
const queryParams = new URLSearchParams(window.location.search);
const pageName = queryParams.get('name');

	if (pageName) {
      fetch(`../${pageName}.md`) //<-- this makes the big difference
        .then(response => response.text())
//...
```



Some scripts are saved as extra Files: 

- _themeswitcher.js_ 
- _markdownParser.js_. 

The themeswitcher can only partly be "outsourced" because different relative positions of the _index.html_ and the _page.html_ to the .css files need to be considered. The set theme is stored in the sessionstorage of the browser, this way it can directly be applied to the html of newly opened markdownfiles.  



Most of the Magic happens in the Markdownparser, the backbone is the big function _parseMarkdown_ from line 1-76 wich  replaces .md formatting with equivalent .html formatting aswell as treating codeblocks and math a little different because those should not get manipulated by the _parseMarkdown_ function. Mathblocks get rendered by Katex, wich I downloaded to make the project work selfcontaining. Codeblocks shouldnt get altered at all - despite styling them, wich happens right at the end of the Parser (~line 200 and following)




For styling there are 2 .css files. All necessary Fonts are loaded from the corresponding folders with the same name as the .css files have.  