function parseMarkdown(markdownText) {

    // Parse code before anything else
    const blocks = [];

        markdownText = markdownText.replace(/```(\w*)\n([\s\S]*?)```/gim, (match, lang, code) => {
            const highlightedCode = highlightSyntax(escapeHTML(code), lang); 
            blocks.push(`<pre><code>${highlightedCode}</code></pre>`);
            return `@@@CODEBLOCK-${blocks.length - 1}@@@`;
        });

    // Extract and replace URLs
    const urls = [];
    markdownText = markdownText.replace(/\[(.*?)\]\((.*?)\)/gim, (match, text, link) => {
        urls.push({text, link});
        return `@@@URL-${urls.length - 1}@@@`;
    });

    // Detect BLOCK math expressions and store them in the inlineMath array
    const blockMath = [];
    markdownText = markdownText.replace(/\$\$(.+?)\$\$/g, (match, math) => {
        blockMath.push(math);
        return `@@@BLOCKMATH-${blockMath.length - 1}@@@`;
    });

    // Detect inline math expressions and store them in the inlineMath array
    const inlineMath = [];
    markdownText = markdownText.replace(/\$(.+?)\$/g, (match, math) => {
        inlineMath.push(math);
        return `@@@INLINEMATH-${inlineMath.length - 1}@@@`;
    });

    // Bulletpoints and Checklist  
    markdownText = parseMarkdownLists(markdownText)
    

    const htmlText = markdownText
        
        // Headings
        .replace(/^###### (.*$)/gim, (match, content) => `<h6 id="${generateId(content)}">${content}</h6>`)
        .replace(/^##### (.*$)/gim, (match, content) => `<h5 id="${generateId(content)}">${content}</h5>`)
        .replace(/^#### (.*$)/gim, (match, content) => `<h4 id="${generateId(content)}">${content}</h4>`)
        .replace(/^### (.*$)/gim, (match, content) => `<h3 id="${generateId(content)}">${content}</h3>`)
        .replace(/^## (.*$)/gim, (match, content) => `<h2 id="${generateId(content)}">${content}</h2>`)
        .replace(/^# (.*$)/gim, (match, content) => `<h1 id="${generateId(content)}">${content}</h1>`)

        // Blockquotes
        .replace(/^>(.*)$/gm, '<blockquote>$1</blockquote>')

        // Bold and italic
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\_\_(.*?)\_\_/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/\_(.*?)\_/gim, '<em>$1</em>')

        // Images, links
        .replace(/!\[(.*?)\]\((.*?)(?:\|(.*?))?\)/gim, (match, alt, src, scale) => {
            scale = scale || 100; // default scale is 100 if not provided
            return `<img alt='${alt}' src='../media/${src}' style='width: ${scale}%;' />`;
        })
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")

        
        //expandable text
        .replace(/!\[(.*?)\]\s*\{(.*?)\}/gs, (match, summaryText, detailsText) => {
            return `<details><summary>${summaryText}</summary>${detailsText}</details>`;
        })

        // Tables
        .replace(tableRegex, match => parseTable(match))

        // Linebreaks
        .replace(/\n\s*\n\s*\n/g, '<br><br>')
        .replace(/\n\s*\n/g, '<br>')


        // Horizontal lines
        .replace(/---+/g, '<hr style="border: 0; height: 1.2px; background: #000;" />')

        .replace(/@@@BLOCKMATH-(\d+)@@@/g, (match, index) => {
                    return `<span class="katex-display">\$${blockMath[index]}\$</span>`;
                })

        .replace(/@@@INLINEMATH-(\d+)@@@/g, (match, index) => {
            // The 'katex' class is important here to make sure KaTeX will render this math
            return `<span class="katex-inline">\$${inlineMath[index]}\$</span>`;
        })

        //for codeblocks
        .replace(/@@@CODEBLOCK-(\d+)@@@/g, (match, index) => blocks[index])
        
        // URLS
       .replace(/@@@URL-(\d+)@@@/g, (match, index) => {
            const { text, link } = urls[index];
            return `<a href='${link}'>${text}</a>`;
        });
    
    return htmlText.trim();
}



//=== Table 
const tableRegex = /\|(.+)\n\|([ -:|]+)\n((\|.*\n?)+)/gim;
function parseTable(markdownTable) {
    // Normalize line endings and split into rows
    const rows = markdownTable.trim().split('\n');
  
    // Extract headers using the first row
    const headers = rows[0].split('|').map(text => text.trim());
    let htmlTable = '<table><thead><tr>';
    headers.forEach(header => {
      if(header) htmlTable += `<th>${header}</th>`;
    });
    htmlTable += '</tr></thead><tbody>';
  
    // Process the rest of the rows
    rows.slice(2).forEach(row => {
      const cells = row.split('|').map(text => text.trim());
      htmlTable += '<tr>';
      cells.forEach(cell => {
        if(cell) htmlTable += `<td>${cell}</td>`;
      });
      htmlTable += '</tr>';
    });
    htmlTable += '</tbody></table>';
  
    return htmlTable;
  }
  

//=== Basic Codeblock Highlighting
function highlightSyntax(code) {
    code = code.replace(/"(.*?)"/g, '<span style="color: #df5000;">"$1"</span>'); 
    code = code.replace(/'(.*?)'/g, '<span style="color: #df5000;">\'$1\'</span>');
    code = code.replace(/\b(function|var|let|const|if|else|for|while|return)\b/g, '<span style="color: #795da3; font-weight: bold;">$1</span>'); // Keywords
    return code;
}


//=== Expandable Text
function parseExpandableText(markdownText) {
    const expandableTextRegex = /!\[(.*?)\]\s*\{(.*?)\}/gs;
    return markdownText.replace(expandableTextRegex, (match, summaryText, detailsText) => {
      return `<details><summary>${summaryText}</summary>${detailsText}</details>`;
    });
  }
 
//=== Bulletpoints and Checklists
function parseMarkdownLists(markdown) {
    const lines = markdown.split('\n');
    const result = [];
    const stack = [];
    let currentIndent = 0;

    lines.forEach(line => {
        const listMatch = line.match(/^( *)([\*\-\+]) (.*)$/);
        const checklistMatch = line.match(/^( *)([\*\-\+]) \[([ x])\] (.*)$/); // Match checklist items

        if (checklistMatch) {
            const indent = checklistMatch[1].length;
            const checked = checklistMatch[3].trim() === 'x'; // Check if the box should be checked
            const content = checklistMatch[4];
            while (stack.length > 0 && indent < stack[stack.length - 1]) {
                result.push('</ul>');
                stack.pop();
            }
            if (stack.length === 0 || indent > stack[stack.length - 1]) {
                stack.push(indent);
                result.push('<ul>');
            }
            result.push(`<li><input type="checkbox" ${checked ? 'checked' : ''} disabled>${content}</li>`);
        } else if (listMatch) {
            const indent = listMatch[1].length;
            const content = listMatch[3];
            while (stack.length > 0 && indent < stack[stack.length - 1]) {
                result.push('</ul>');
                stack.pop();
            }
            if (stack.length === 0 || indent > stack[stack.length - 1]) {
                stack.push(indent);
                result.push('<ul>');
            }
            result.push(`<li>${content}</li>`);
        } else {
            while (stack.length > 0) {
                result.push('</ul>');
                stack.pop();
            }
            result.push(line); // Add non-list content
        }
    });

    while (stack.length > 0) {
        result.push('</ul>');
        stack.pop();
    }

    return result.join('\n');
}

//=== Linking Headings with IDs
function generateId(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
}











//=== Codeblocks
function escapeHTML(code) {
    return code.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#039;');
}



//== Syntax highlighting based on language
function highlightSyntax(code, language) {
    switch (language.toLowerCase()) {
        case 'javascript':
            return highlightJavaScript(code);
        case 'python':
            return highlightPython(code);
        case 'html':
            return highlightHTML(code);
        case 'r':
            return highlightR(code);
        case 'markdown':
            return highlightMarkdown(code);
        case 'latex':
            return highlightLatex(code);
        default:
            return code; // No highlighting if language not supported
    }
}

//= JavaScript
function highlightJavaScript(code) {
    return code.replace(/"(.*?)"/g, '<span style="color: #ce9178;">"$1"</span>')
               .replace(/'(.*?)'/g, '<span style="color: #ce9178;">\'$1\'</span>')
               .replace(/\b(function|var|let|const|if|else|for|while|return)\b/g, '<span style="color: #569cd6;">$1</span>');
}

//= Python
function highlightPython(code) {
    return code.replace(/"(.*?)"/g, '<span style="color: #ce9178;">"$1"</span>')
               .replace(/'(.*?)'/g, '<span style="color: #ce9178;">\'$1\'</span>')
               .replace(/\b(def|class|if|else|elif|for|while|return)\b/g, '<span style="color: #569cd6;">$1</span>');
}

//= HTML
function highlightHTML(code) {
    return code.replace(/<([^>]+)>/g, '<span style="color: #d7ba7d;">&lt;$1&gt;</span>');
}

//= R
function highlightR(code) {
    code = code.replace(/"(.*?)"/g, '<span style="color: #ce9178;">"$1"</span>');
    code = code.replace(/\b(function|if|else|for|while|repeat|in)\b/g, '<span style="color: #569cd6;">$1</span>');
    code = code.replace(/(\(|\))/g, '<span style="color: #4ec9b0;">$1</span>');
    code = code.replace(/(\[|\])/g, '<span style="color: #4ec9b0;">$1</span>');
    code = code.replace(/(<-)/g, '<span style="color: #d16969;">$1</span>');
    return code;
}

//= Markdown
function highlightMarkdown(code) {
    // Highlight headers
    code = code.replace(/^# (.*$)/gm, '<span style="color: #569cd6;"># $1</span>'); // H1
    code = code.replace(/^## (.*$)/gm, '<span style="color: #569cd6;">## $1</span>'); // H2
    code = code.replace(/^### (.*$)/gm, '<span style="color: #569cd6;">### $1</span>'); // H3
    code = code.replace(/^#### (.*$)/gm, '<span style="color: #569cd6;">#### $1</span>'); // H4
    code = code.replace(/^##### (.*$)/gm, '<span style="color: #569cd6;">##### $1</span>'); // H5
    code = code.replace(/^###### (.*$)/gm, '<span style="color: #569cd6;">###### $1</span>'); // H6

    // Highlight bold and italic
    code = code.replace(/\*\*(.*?)\*\*/g, '<span style="color: #ce9178;">**$1**</span>'); // Bold
    code = code.replace(/__(.*?)__/g, '<span style="color: #ce9178;">__$1__</span>'); // Bold
    code = code.replace(/\*(.*?)\*/g, '<span style="color: #b5cea8;">*$1*</span>'); // Italic
    code = code.replace(/_(.*?)_/g, '<span style="color: #b5cea8;">_$1_</span>'); // Italic

    // Highlight inline code
    code = code.replace(/`(.*?)`/g, '<span style="color: #d7ba7d;">`$1`</span>');

    // Highlight images with optional scale
    code = code.replace(/!\[(.*?)\]\((.*?)\|(\d+)%\)/g, '<span style="color: #9cdcfe;">![$1]($2|$3%)</span>'); // Image with scale

    return code;
}


//= LaTeX
function highlightLatex(code) {
    return code.replace(/\\([a-zA-Z]+)/g, '<span style="color: #569cd6;">\\$1</span>')
               .replace(/(\{.*?\})/g, '<span style="color: #ce9178;">$1</span>');
}
