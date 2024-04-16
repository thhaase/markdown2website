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



function parseMarkdown(markdownText) {

    markdownText = parseMarkdownLists(markdownText)
    
    const htmlText = markdownText

        // Code
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/gim, (match, code) => `<pre><code>${highlightSyntax(code)}</code></pre>`)
        
        // Headings
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')

        // Blockquotes
        .replace(/^>(.*)$/gm, '<blockquote>$1</blockquote>')

        // Bold and italic
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')

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
        .replace(/\n\s*\n/g, '<br><br>')

        // Horizontal lines
        .replace(/---+/g, '<hr style="border: 0; height: 1.2px; background: #000;" />')

        
    return htmlText.trim();
}



// 🙏 chatgpt for the function
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
  

// Codeblock highlighting
function highlightSyntax(code) {
    code = code.replace(/"(.*?)"/g, '<span style="color: #df5000;">"$1"</span>'); 
    code = code.replace(/'(.*?)'/g, '<span style="color: #df5000;">\'$1\'</span>');
    code = code.replace(/\b(function|var|let|const|if|else|for|while|return)\b/g, '<span style="color: #795da3; font-weight: bold;">$1</span>'); // Keywords
    return code;
}


// expandable text
function parseExpandableText(markdownText) {
    const expandableTextRegex = /!\[(.*?)\]\s*\{(.*?)\}/gs;
    return markdownText.replace(expandableTextRegex, (match, summaryText, detailsText) => {
      return `<details><summary>${summaryText}</summary>${detailsText}</details>`;
    });
  }
 

/*/ Parse Bulletpoints without whitelines between them

 function parseBulletPoints(markdown) {
   const lines = markdown.split('\n');
    let currentIndent = 0;
    let bulletPointRegex = /^( *)([\*\-\+]) (.*)$/;
    let listLines = lines.map(line => {
        let match = line.match(bulletPointRegex);
        if (match) {
            let indent = match[1].length;
            let content = match[3];
            if (indent > currentIndent) {
                line = '<ul>' + '<li>' + content;
            } else if (indent === currentIndent) {
                line = '</li>' + '<li>' + content;
            } else {
                let outdentCount = (currentIndent - indent) / 2;
                line = '</li>' + '</ul>'.repeat(outdentCount) + '<li>' + content;
            }
            currentIndent = indent;
        }
        return line;
    });
    markdown = listLines.join('\n');
    while (currentIndent > 0) {
        markdown += '</li></ul>';
        currentIndent -= 2;
    }
    return markdown;
}
*/


