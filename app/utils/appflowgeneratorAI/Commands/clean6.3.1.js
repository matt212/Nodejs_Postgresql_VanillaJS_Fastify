const fs = require('fs');
const path = require('path');



let base = {
    a: 'app/utils/appflowgeneratorAI/aiOutput/8.6.3.Final-System-Architecture-Blueprint-Graph-.18-10-26_07:20pm.md',
}
loadclean(base);
function loadclean(base) {
    let CONFIG1 = {
        PATHS: {
            PROJECT_ROOT: path.resolve(__dirname, '../../../../'),
            OUTPUT_RELATIVE_DIR: 'app/utils/appflowgeneratorAI/aiOutput/',
        }
    }

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
    const extract = (filePath) => {
        const raw = fs.readFileSync(filePath, 'utf8');
        return raw.trim();
    };
    const objectsData = extract(base.a);
    let interim = JSON.parse(extractAfterLastAssistant(objectsData)).replacements
    //console.log(interim)
    const contentChanges = interim.map(item => {
        const match = item.existing_content.match(/\[Step\s([\d.]+)/);
        const step = match ? match[1] : null;
        return {
            step,
            from: item.existing_content,
            to: item.replacement_content,
            statement: `UPDATE NODE Step ${step} TO  "${item.replacement_content}"`,
        };
    });
    const finalScript = contentChanges.map(item => item.statement).join('\n')
    console.log(finalScript);
    const now = new Date();
    // 1. Extract date components (DD-MM-YY)
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    // 2. Extract 12-hour time components (HH:MMam/pm)
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // Formats 0 to 12
    const formattedHours = String(hours).padStart(2, '0');
    // 3. Assemble with dashes and colons intact
    const timestamp = `${day}-${month}-${year}_${formattedHours}:${minutes}${ampm}`;
    // Result Example: "13-10-26_07:57pm"
    const outputFileName = `clean6.3.1_cleanup_${timestamp}.md`;
    const OUTPUT_DIR = path.join(CONFIG1.PATHS.PROJECT_ROOT, CONFIG1.PATHS.OUTPUT_RELATIVE_DIR);
    const outputFilePath = path.join(OUTPUT_DIR, outputFileName);
    // 7. Commit write configuration array output directly onto physical hardware disk
   fs.writeFileSync(outputFilePath, finalScript, 'utf8');
}
 
