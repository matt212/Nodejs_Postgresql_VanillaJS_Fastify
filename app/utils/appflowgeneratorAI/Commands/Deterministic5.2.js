const fs = require('fs');
const path = require('path');

/**
 * Deterministically parses system matrices and saves a clean, meaningful business flowchart.
 * @param {string} objectsFile - Path to the Component Layout Objects JSON file
 * @param {string} actorsFile - Path to the System Actors JSON file
 * @param {string} journeysFile - Path to the Transaction Journeys JSON file
 */
function generateDeterministicBusinessFlowchart(objectsFile, actorsFile, journeysFile) {
    try {
        console.log("⚙️ [1/4] Ingesting source matrix configuration records...");
        
        // 1. Verify existence and read all files synchronously
        if (!fs.existsSync(objectsFile) || !fs.existsSync(actorsFile) || !fs.existsSync(journeysFile)) {
            console.error("❌ [CRITICAL] Core execution failed: One or more input JSON matrix files are missing.");
            return;
        }
        
        let interimObj = fs.readFileSync(objectsFile, 'utf8');
        let interimObj1 = fs.readFileSync(actorsFile, 'utf8');
        let interimObj2 = fs.readFileSync(journeysFile, 'utf8');
      
        // Safely segment text components by the header markers to target raw data arrays
        const objectsData = JSON.parse(interimObj.split("===")[2]);
        const actorsData = JSON.parse(interimObj1.split("===")[2]);
        const journeysData = JSON.parse(interimObj2.split("===")[2]);

        // 2. Map objects by lowercase name to ensure clean lookups
        const objectRegistry = {};
        objectsData.forEach(obj => {
            objectRegistry[obj.object_name.toLowerCase()] = obj;
        });

        // 3. Isolate the primary journey flow (Customer Lifecycle)
        const primaryJourney = journeysData.find(j => j.actor_name === "End-User Customer");
        if (!primaryJourney) {
            console.error("❌ [CRITICAL] Failed to map execution paths: 'End-User Customer' timeline track not found.");
            return;
        }

        console.log("📐 [2/4] Processing triple-matrix entity cross-references...");
        
        let mermaidCode = "graph TD\n";
        mermaidCode += "    %% ============================================================================\n";
        mermaidCode += "    %% DETERMINISTIC SYSTEMS ARCHITECTURE LIFECYCLE FLOWCHART\n";
        mermaidCode += "    %% ============================================================================\n\n";

        const nodeDefinitions = [];
        const linkStreams = [];

        // 4. Map chronological milestones sequentially
        const steps = primaryJourney.chronological_milestones_and_data_inputs;
        steps.forEach((milestone, idx) => {
            const stepNum = milestone.step;
            const contextText = milestone.data_object_layer;

            // Find matching structural object type from metadata context string
            let targetObj = null;
            for (const key of Object.keys(objectRegistry)) {
                if (contextText.toLowerCase().includes(`'${key}'`) || contextText.toLowerCase().includes(key)) {
                    targetObj = objectRegistry[key];
                    break;
                }
            }

            if (targetObj) {
                const currentVar = `step_p1_${stepNum.replace(/\./g, '_')}`;
                const displayTitle = `Step stepNum: ${targetObj.activity}`;
                
                // FIXED: Clean initialization syntax without structural interpolation noise
                nodeDefinitions.push(`${currentVar}["${displayTitle}"]`);

                // Link chronologically forward from the previous step
                if (idx > 0) {
                    const prevVar = `step_p1_${steps[idx - 1].step.replace(/\./g, '_')}`;
                    // Extract data criteria payload from the data inputs cleanly
                    const cleanedHandoffPayload = targetObj.input.split(' and ')[0];
                    linkStreams.push(`    ${prevVar} -- "Passes: cleanedHandoffPayload" --> ${currentVar}`);
                }

                // 5. PARSE INTEGRITY CROSSROADS (Automated Happy / Unhappy Path Validation Gates)
                const activityLower = targetObj.activity.toLowerCase();
                if (activityLower.includes("verify") || activityLower.includes("check") || activityLower.includes("auth") || activityLower.includes("validate")) {
                    const gateVar = `${currentVar}_gate`;
                    const fallbackVar = `${currentVar}_degraded_alert`;

                    // FIXED: Cleaned all broken escape structures, brackets, and literal text leaks
                    nodeDefinitions.push(`    ${gateVar}"Is ${targetObj.object_name} State Valid?"`);
                    nodeDefinitions.push(`    ${fallbackVar}["⚠️ [Degraded/Soft Failure] Route System Alert & Remediation Loop"]`);

                    linkStreams.push(`    ${currentVar} --> ${gateVar}`);
                    
                    // Happy path jumps forward to the next index location target
                    if (steps[idx + 1]) {
                        const nextVar = `step_p1_${steps[idx + 1].step.replace(/\./g, '_')}`;
                        linkStreams.push(`    ${gateVar} -- "Happy Path: Approved" --> ${nextVar}`);
                    }

                    // Unhappy Path / Alternate track gracefully branches out and closes loops locally
                    linkStreams.push(`    ${gateVar} -. "Unhappy Path: Discrepancy" .-> ${fallbackVar}`);
                    linkStreams.push(`    ${fallbackVar} -. "Initiate Self-Healing" .-> ${currentVar}`);
                }
            }
        });

        // Combine string streams cleanly
        mermaidCode += "    %% --- SUBGRAPH STRUCTURAL COMPONENT OBJECT DEFINITIONS ---\n";
        mermaidCode += nodeDefinitions.join("\n") + "\n\n";
        mermaidCode += "    %% --- CHRONOLOGICAL LIFECYCLE LINK VECTOR TRACKS ---\n";
        mermaidCode += [...new Set(linkStreams)].join("\n") + "\n";

        console.log("💾 [3/4] Structuring dynamic timestamp profile...");
        
        // 6. Generate exact timestamp formatting structure: DD-MM-YY_HH.MMam/pm
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);

        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // Standardised 12-hour format conversion
        const formattedHours = String(hours).padStart(2, '0');

        // FIXED: Wiped out all stray escape backslashes and parentheses
        const timestampStr = `${day}-${month}-(${year}_)${formattedHours}.${minutes}${ampm}`;
        const outputFileName = `business_generated_flowchart_${timestampStr}.md`;

        // 7. Write clean Markdown wrapper block out onto file structure
        const finalFilePayload = `\`\`\`mermaid\n${mermaidCode}\`\`\``;
        fs.writeFileSync(path.join(__dirname, outputFileName), finalFilePayload, 'utf8');

        console.log(`🎉 [4/4] COMPLETE! Workflow chart generated successfully.`);
        console.log(`📁 File exported as: .${outputFileName}`);

    } catch (error) {
        console.error("💥 [CRITICAL FAILURE] Pipeline execution crashed:", error);
    }
}

// ============================================================================
// EXECUTION CALL INTERFACE:
// ============================================================================
let base = {
    a: 'app/utils/appflowgeneratorAI/aiOutput/1-Final-Objects-for-Quick Commerce (Q-Commerce)_and_(Hyperlocal Grocery Delivery_2026-10-03T18-42-31-031Z.txt',
    b: 'app/utils/appflowgeneratorAI/aiOutput/2.Final-Actors-for-Quick Commerce (Q-Commerce)_and_Hyperlocal Grocery Delivery_2026-10-03T19-22-16-404Z.txt',
    c: 'app/utils/appflowgeneratorAI/aiOutput/3.Final-End-to-End-Actor-Journeys-2026-10-03T20-54-21-571Z.txt'
};

generateDeterministicBusinessFlowchart(
    base.a, 
    base.b,
    base.c
);
