const fs = require('fs');
const path = require('path');

function extractAfterLastAssistant(rawContent) {
  const marker = "Assistant:";
  const lastIndex = rawContent.lastIndexOf(marker);

  // If the marker isn't found at all, return an empty string or handle gracefully
  if (lastIndex === -1) {
    return ""; 
  }

  // Slice everything after the marker index + the length of "Assistant:"
  return rawContent.slice(lastIndex + marker.length).trim();
}

let base = {
    a: 'app/utils/appflowgeneratorAI/aiOutput/8.6.3.Final-System-Architecture-Blueprint-Graph-.18-10-26_07:20pm.md',
}
 const extract = (filePath) => {
            const raw = fs.readFileSync(filePath, 'utf8');
            return raw.trim();
        };

        const objectsData = extract(base.a);
        
let interim=JSON.parse(extractAfterLastAssistant(objectsData)).replacements
//console.log(interim)

const contentChanges = interim.map(item => {
  const match = item.existing_content.match(/\[Step\s([\d.]+)/);
  const step = match ? match[1] : null;

  return {
    step,
    from: item.existing_content,
    to: item.replacement_content,
    statement: `UPDATE NODE Step ${step} TO "${item.replacement_content}"`,
  };
});

const finalScript = contentChanges
  .map(item => item.statement)
  .join('\n')

console.log(finalScript);
