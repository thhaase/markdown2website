function parseMarkdown(markdownText) {
    // Handle expandable text first
    markdownText = parseExpandableText(markdownText);
    // Parse Bulletpoints without whitelines between them
    markdownText = parseBulletPoints(markdownText);

    const htmlText = markdownText
        // Headings
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        // Images, links, line breaks
        .replace(/!\[(.*?)\]\((.*?)(?:\|(.*?))?\)/gim, (match, alt, src, scale) => {
            scale = scale || 100; // default scale is 100 if not provided
            return `<img alt='${alt}' src='../.media/${src}' style='width: ${scale}%;' />`;
        })
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/\n$/gim, '<br />')
        // Horizontal lines
        .replace(/^---+/gim, '<hr style="border: 0; height: 1.2px; background: #000;" />')
        // Tables
        .replace(tableRegex, match => parseTable(match))
        // Blockquotes
        .replace(/^>(.*)$/gm, '<blockquote>$1</blockquote>')
        // Task lists
        .replace(/^- \[(x| )\] (.*)$/gm, (match, checked, text) => {
            checked = checked === 'x' ? 'checked' : '';
            return `<input type='checkbox' ${checked} disabled> ${text}`;
        })
        // Bullet points
        .replace(/^( +)?([\*\-\+]) (.*)$/gm, (match, space, bullet, text) => {
            const indent = space ? space.length / 2 : 0; // Calculate the indentation level based on space length
            const listType = bullet === '*' ? 'ul' : 'ol';
            return `<${listType} style="margin-left:${indent}em;"><li>${text}</li></${listType}>`;
        })
        // Codeblocks
        .replace(/```([\s\S]*?)```/gim, function(match, code) {
            return `<pre><code>${highlightSyntax(code)}</code></pre>`;
        });
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
      // The summaryText is the clickable title of the collapsible section
      // The detailsText is the content that will show when the section is expanded
      return `<details><summary>${summaryText}</summary>${detailsText}</details>`;
    });
  }
 

// Parse Bulletpoints without whitelines between them
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