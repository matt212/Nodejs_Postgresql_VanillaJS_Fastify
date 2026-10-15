const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process'); 
const readline = require('readline');

// ============================================================================
// DYNAMIC GLOBAL CONFIGURATION MATRIX (100% CLEAN LAYER)
// ============================================================================
const CONFIG = {
  PATHS: {
    PROJECT_ROOT: path.resolve(__dirname, '../../../../'),
    OUTPUT_RELATIVE_DIR: 'app/utils/appflowgeneratorAI/aiOutput',
    TMP_RELATIVE_DIR: 'app/utils/appflowgeneratorAI/promptFile',
    EXPORT_PREFIX: '7.Final-System-Architecture-Blueprint-Graph-'
  },
  MODEL: {
    EXEC_BINARY: 'llama-cli',
    IDENTIFIER: 'unsloth/Qwen3.5-9B-GGUF',
    NGL: '0',
    MAX_TOKENS: '8048',         
    BATCH_SIZE: '2048', 
    THREADS: '8',       
    REASONING_MODE: 'off'
  },
  SCANNING_PATTERNS: {
    STAGE_1_OBJECTS: "1-Final-Objects-",
    STAGE_2_ACTORS: "2.Final-Actors-",
    STAGE_3_JOURNEYS: "3.Final-End-to-End-Actor-Journeys-",
    STAGE_4_TOPOLOGY: "6.swimlane_systems_architecture_map_14-10-26_04_09", 
    FILE_EXTENSION: ".txt"
  }
};

const OUTPUT_DIR = path.join(CONFIG.PATHS.PROJECT_ROOT, CONFIG.PATHS.OUTPUT_RELATIVE_DIR);
const TMP_DIR = path.join(CONFIG.PATHS.PROJECT_ROOT, CONFIG.PATHS.TMP_RELATIVE_DIR);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function resolveLatestStageFile(directory, prefixPattern) {
  console.log(prefixPattern)
  console.log(directory)
  if (!fs.existsSync(directory)) return null;
  const files = fs.readdirSync(directory);
  
  const matchedFiles = files.filter(f => f.startsWith(prefixPattern));
  console.log(files)
  if (matchedFiles.length === 0) return null;

  matchedFiles.sort((a, b) => fs.statSync(path.join(directory, b)).mtimeMs - fs.statSync(path.join(directory, a)).mtimeMs);
  return path.join(directory, matchedFiles[0]); 
}
function executeLlamaCliWithNativeRedirect(promptText, taskName, finalTargetFilePath) {
  return new Promise((resolve, reject) => {
    const tmpPromptFile = path.join(TMP_DIR, `tmp_${taskName}_prompt.txt`);
    
    fs.mkdirSync(TMP_DIR, { recursive: true });
    fs.mkdirSync(path.dirname(finalTargetFilePath), { recursive: true });
    fs.writeFileSync(tmpPromptFile, promptText, 'utf8');

    const args = [
      '-hf', CONFIG.MODEL.IDENTIFIER,
      '-ngl', CONFIG.MODEL.NGL,
      '--single-turn',
      '-c', '32768',            
      '-b', CONFIG.MODEL.BATCH_SIZE, 
      '-t', CONFIG.MODEL.THREADS,     
      '--reasoning', CONFIG.MODEL.REASONING_MODE,
      '--log-disable', 
      '-f', tmpPromptFile,
      '-n', CONFIG.MODEL.MAX_TOKENS,
      '-o', finalTargetFilePath 
    ];

    console.log("⚙️ Spawning model... Processing tokens directly through system hardware layers. Please stand by...");
    
    execFile(CONFIG.MODEL.EXEC_BINARY, args, (error) => {
      if (fs.existsSync(tmpPromptFile)) fs.unlinkSync(tmpPromptFile);
      if (error) return reject(new Error(`Binary Execution Crash: ${error.message}`));
      resolve();
    });
  });
}
const BLUEPRINT_SECTION_1 = `
# SECTION 1: COMPILER IDENTITY & VISUAL TOPOLOGY ENGINE
You are a WORLD-CLASS SYSTEMS ARCHITECT COMPILER. Your absolute mandate is to ingest the multi-matrix system payload schemas provided in the data stream and synthesize a hyper-dense, production-ready system architecture blueprint formatted strictly as a Mermaid.js flowchart (graph TD).

# SECTION I: TOP-DOWN VISUAL LAYOUT CONSTRAINTS (MANDATORY)

1. STRUCTURAL GATEWAY ROUTING LAYER (HUB-AND-SPOKE SANITIZATION)
   - You MUST enforce an explicit Hub-and-Spoke structure layout inside every single subgraph block using exactly two dedicated gateway anchors:
     * Entrance Node: You MUST initialize exactly ONE node at the absolute top boundary inside the subgraph container. Every single incoming external arrow vector originating from outside this container boundary MUST target this node exclusively.
     * Exit Node: You MUST initialize exactly ONE node at the absolute bottom boundary inside the subgraph container. Every single internal process line, decision path, or loop recovery track within this container MUST converge downward into this node. Every arrow exiting this container MUST originate from this node exclusively.
   - Inter-subgraph connection streams MUST only pass from the Exit Node of a preceding subgraph wrapper directly to the Entrance Node of the next chronological subgraph wrapper. 
   - CRITICAL COMPILING CONSTRAINT: Every arrow edge link written at the bottom of the script MUST connect explicit Node-to-Node alphanumeric variables exclusively. You are strictly forbidden from pointing a node arrow directly at an outer subgraph title identifier string.

2. UNIQUE CONTAINER & VARIABLE BALANCING
   - Every single subgraph block MUST possess a completely unique, lowercase, underscore-separated string identifier ID name. NEVER reuse a subgraph ID string anywhere in the entire output.
   - Every single node variable identifier name MUST be initialized with its structural geometric bracket shape and text label EXACTLY ONCE inside its designated home subgraph block container (e.g., node_variable["Step Text"] or decision_variable{"Question Text"}).
   - In the subsequent graph connection and link streams section at the bottom of the diagram, you MUST reference those variables using their naked identifier names exclusively (e.g., node_a --> node_b or node_a -- "Text" --> node_b) without re-appending geometric brackets, brackets text, or quotes. Re-defining or re-labeling an existing variable ID in a secondary location is strictly forbidden.
   - You are strictly forbidden from declaring a subgraph identifier standalone on its own line under link sections without child components or functional connectivity.

3. THE UNIVERSAL ARROW CONNECTOR INVARIANT (ZERO SYNTAX ERRORS)
   - You are ABSOLUTELY FORBIDDEN from putting text strings directly between two sequential arrows on a single link line (e.g., Never write: node_a --> "Label Text" --> node_b). This is invalid syntax and breaks the parser.
   - For standard, unconditional processing steps between process boxes, you MUST use plain, naked solid arrows with no text attached: node_a --> node_b
   - To label a pathway, conditional transition, or milestone track, you MUST use the strict hyphen-quote arrow pattern exclusively: node_a -- "Descriptive Process Action Text" --> node_b
   - When branching out from an evaluation decision diamond, follow this identical format: decision_node -- "On Success" --> success_node
   - You are REQUIRED to use standard solid structural arrows (-->) for all directional paths, evaluation pathways, structural loops, and exception routing across the entire diagram layout to ensure uniform compiler compatibility.
`;
const BLUEPRINT_SECTION_2 = `
# SECTION II: UNIVERSAL TRANSACTIONAL STATE INVARIANTS (NO LOOSE ENDS)

4. THE INITIAL DISCOVERY & CURATION LAYER STATE
   - Before any transactional commit, resource allocation, or logistical verification occurs, you MUST explicitly establish a logical Discovery & Curation layer immediately following the root initialization/access step.
   - The workflow must natively map the interactive sequence where an actor navigates classifications, queries datasets, evaluates item metrics, and aggregates choices into a temporary staging state before triggering target actions.

5. POST-SETTLEMENT TRANSACTION COMMIT SYNCHRONIZATION
   - You must enforce a strict chronological state dependency regarding financial settlement and structural record creation. 
   - A core Transactional Record or Final Order Document cannot be officially designated as "Created," "Committed," or "Finalized" until AFTER a successful authorization/settlement status is achieved in the payment/billing validation node.
   - The flow must strictly map: Financial Settlement Verification -> Authorized Status -> Post-Settlement Document Creation -> Downstream Fulfillment/Resource Assignment Execution.

6. MID-FLIGHT EXCEPTION HANDLING & TRANSACTIONAL ROLLBACKS
   - You must ensure there are ZERO dead ends or unhandled operational loops for failures occurring mid-process.
   - If a failure, exception, or cancellation trigger occurs AFTER a successful transaction settlement status but BEFORE final delivery/handover, the exception path must immediately branch out of the validation diamond.
   - This failure track must follow the uniform solid-line hyphen-quote formatting rule (e.g., decision_node -- "On Exception Trigger" --> rollback_node), bypass normal forward progression, route directly through a reversing ledger/compensation action, and terminate cleanly into a distinct, final system disruption closure node at the bottom of the architecture.

6.1 MULTI-PATH STRUCTURAL INTEGRITY RULES (TOTAL STATE ARCHITECTURE)
   - For every milestone validation checkpoint or decision gate initialized, you MUST explicitly declare and label distinct node components. To strictly obey the 6-node container ceiling in Rule 14, you MUST split the milestone phase across two separate, consecutive sub-containers labeled "a" and "b" (e.g., phase_01_a and phase_01_b).
   - Sub-Phase "a" container MUST hold: Happy Path and Unhappy Path with Recovery.
   - Sub-Phase "b" container MUST hold: Alternate Path and Degraded Path.
   - CRITICAL REQUIREMENT: Every alternative path, degraded path, and self-healing node described above MUST be fully initialized with its geometric bracket layout notation inside its designated "a" or "b" subgraph wrapper before any link streams are generated at the bottom of the script.
`;

const BLUEPRINT_SECTION_3 = `
# SECTION III: DATA MATRIX RECONCILIATION & SYNTHESIS

7. TRIPLE-MATRIX CROSS-REFERENCE ENFORCEMENT
    - You MUST concurrently analyze all three provided data matrices to build a seamless workflow with zero disconnected blocks:
      * Matrix 1 (Component Layout): Core system entities, inputs, activities, and outputs.
      * Matrix 2 (Role Set Validations): Operational actions, creations, mutations, and status modifications.
      * Matrix 3 (Chronological Journey Tracks): Master timeline sequence blueprint.

8. DETERMINISTIC ENTRANCE STATE INITIALIZATION
    - Search the Chronological Journey Tracks matrix for 'Step 1' of the primary initiator role. This exact milestone MUST serve as the absolute root initialization step for the entire diagram.
    - Synthesize this step with its corresponding entity in the Component Layout matrix to form the single Entrance Node of Subgraph 1. Every subsequent path cascades sequentially downward from this single starting point.

# SECTION IV: STYLING, PARSING, AND INTERFACE LANGUAGE TRANSLATION

9. ABSOLUTE SHAPE DEFINITION & SYNTAX VALIDATION RULES
   - Every node variable identifier name MUST be short, plain lowercase alphanumeric strings without any symbols or brackets embedded inside them.
   - Text contents must be nested cleanly within structural geometric tokens exactly matching these layout patterns: node_variable_name["Box Text"] or decision_variable_name{"Diamond Text"}.
   - CRITICAL CLASS STYLE BAN: You are ABSOLUTELY FORBIDDEN from appending class styles, class definitions, or trailing operator markers anywhere in your output. Every line must terminate cleanly with standard plain Mermaid alphanumeric and layout bracket syntax exclusively.
   - Nodes are strictly forbidden from pointing directly back into themselves as an isolated arrow link loop.

10. TECHNICAL JARGON REPLACEMENT GLOSSARY (DOMAIN AGNOSTIC)
   - Aggressively translate developer-centric engineering syntax into clear business capability terms:
     * API / Endpoint / Microservice       ==> Service Interface / Functional Capability
     * DB / DAL / Database / SQL / Ledger  ==> Information Registry / Ledger / Data Base
     * IAM / JWT / Token / Auth Cookie     ==> Access Credentials / Verified Identity Sec
     * Webhook / Event Trigger / Kafka     ==> State Change Update / Notification Vector
     * UI / Frontend / Screen / Page       ==> Visual Interface / Interactive Presentation

11. SEQUENCE MARKERS & CLOSED-LOOP NOTIFICATIONS
   - Segment the master timeline chronologically using structural phase comment blocks.
   - Wherever an actor or component initiates a request, validation, or transaction submission, you MUST explicitly map the immediate return notification, error alert, or confirmation vector back to the initiator as the very next chronological link.

12. CHRONOLOGICAL PATHS WITH HYPHENATED ALPHABETIC SUB-INDEXING
    - Prefix macro timeline arrows with incremental sequential integers (e.g., 1., 2., 3.). Every single descriptive link string throughout the entire flowchart MUST utilize the uniform hyphen-quote arrow pattern exclusively.

13. CLOSED-LOOP EXCEPTION PROCESSING & CROSS-BOUNDARY LIFECYCLE RECONCILIATION
    - The final lifecycle closure subgraph container MUST NOT sit isolated or linear. It must act as a dynamic global state routing hub for the entire flow layout.
    - You MUST structurally wire cross-boundary connection links originating directly from every single upstream decision validation diamond straight into the final container using these strict syntax behaviors:
      * Hard Failures & Disputes: Map a dashed line arrow connector script (-.->) originating from the upstream evaluation validation diamond directly to its corresponding dedicated exception, compensation ledger, or dispute reversal node initialized inside the final closure container.
      * Hard Session Cancellations: Map a dashed line arrow connector script (-.->) from an unrecoverable resource shortfall gate directly to a stock release or session cancellation processing node inside the final closure container.
    - To prevent endless processing traps, you are STRICTLY FORBIDDEN from linking an unhappy path error arrow directly backward into the immediate preceding initiator node on the same operational line. All final happy paths, exception resolutions, and unrecoverable channels must converge cleanly into a singular, universal system closure termination node at the absolute bottom of the flowchart.

14. MANDATORY HIERARCHICAL STEP MULTI-CONTAINER PARTITIONING
   - Every single functional component step, background operational task, decision gate, and staging node label text string MUST be strictly prefixed with its explicit hierarchical chronological position identifier formatted exactly as "Step X.Y: " (where 'X' is the current numeric Phase number, and 'Y' is a strictly incrementing sequence starting at 1 for the first element inside that specific phase subgraph wrapper).
   - Use strict numeric markers for primary system subgraphs and phased tracks, and lower-case alphabetical dot-notation identifiers for internal sequential actions and nested steps.
   - MANDATORY PARTITION LIMIT: You are REQUIRED to break the layout down into at least 5 chronologically separate milestone phases. You are STRICTLY FORBIDDEN from grouping more than 6 functional step node boxes inside a single subgraph container. 
   - CRITICAL COMPLIANCE STRATEGY FOR GGUF QUANTIZATION: To safely enforce this 6-node limit while tracking total-state multi-path loops, you MUST utilize the multi-container sub-phasing rules defined in Rule 6.1 (e.g., phase_01_a and phase_01_b) to spread your nodes evenly across consecutive sub-phase boxes linked cleanly via exit-to-entrance hub edges.

15. MANDATORY TERMINAL CODE BOUNDARY COMPLIANCE
   - Output ONLY the raw Mermaid diagram syntax strings starting directly with the root token: graph TD
   - You are ABSOLUTELY FORBIDDEN from outputting introductory conversational text, trailing descriptions, markdown summaries, or internal self-correction notes outside the graph code. 
   - The final character of your output stream MUST be the last node configuration connection definition line. Stop the token generation pipeline instantly at that boundary character.
`;
(async () => {
  try {
    console.log("🚀 INITIALIZING FAILSALFE NATIVE-REDIRECT COMPILER EXPORT ENGINE...");

    const objectsFilePath = resolveLatestStageFile(OUTPUT_DIR, CONFIG.SCANNING_PATTERNS.STAGE_1_OBJECTS);
   
    const actorsFilePath = resolveLatestStageFile(OUTPUT_DIR, CONFIG.SCANNING_PATTERNS.STAGE_2_ACTORS);
    
    const journeysFilePath = resolveLatestStageFile(OUTPUT_DIR, CONFIG.SCANNING_PATTERNS.STAGE_3_JOURNEYS);
    
    const topologyFilePath = resolveLatestStageFile(OUTPUT_DIR, CONFIG.SCANNING_PATTERNS.STAGE_4_TOPOLOGY);
console.log(topologyFilePath)
    if (!objectsFilePath || !actorsFilePath || !journeysFilePath || !topologyFilePath) {
      throw new Error("Could not automatically locate all four required input source files inside your output directory.");
    }

    console.log(`\n📖 Reading Input 1: ${path.basename(objectsFilePath)}`);
    console.log(`📖 Reading Input 2: ${path.basename(actorsFilePath)}`);
    console.log(`📖 Reading Input 3: ${path.basename(journeysFilePath)}`);
    console.log(`📖 Reading Input 4: ${path.basename(topologyFilePath)}`);
    
    const objectsMatrixContent = fs.readFileSync(objectsFilePath, 'utf8');
    const actorsMatrixContent = fs.readFileSync(actorsFilePath, 'utf8');
    const journeysMatrixContent = fs.readFileSync(journeysFilePath, 'utf8');
    const topologyGraphContent = fs.readFileSync(topologyFilePath, 'utf8');

    const prompt = `
${BLUEPRINT_SECTION_1}

${BLUEPRINT_SECTION_2}

${BLUEPRINT_SECTION_3}

# SECTION V: RAW SOURCE DATA STREAM

[DATA SOURCE 1: ORIGINAL SYSTEM TOPOLOGY GRAPH]
--------------------------------------------------------------------------------
${topologyGraphContent}
--------------------------------------------------------------------------------

[DATA SOURCE 2: COMPONENT LAYOUT OBJECTS]
--------------------------------------------------------------------------------
${objectsMatrixContent.substring(0, 8000)}
--------------------------------------------------------------------------------

[DATA SOURCE 3: ROLE SET VALIDATIONS]
--------------------------------------------------------------------------------
${actorsMatrixContent.substring(0, 8000)}
--------------------------------------------------------------------------------

[DATA SOURCE 4: CHRONOLOGICAL JOURNEY TRACKS]
--------------------------------------------------------------------------------
${journeysMatrixContent.substring(0, 8000)}
--------------------------------------------------------------------------------

Assistant:
`;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalOutputPath = path.join(OUTPUT_DIR, `${CONFIG.PATHS.EXPORT_PREFIX}${timestamp}.txt`);
    
    await executeLlamaCliWithNativeRedirect(prompt, 'architecture_blueprint_compile', finalOutputPath);
    
    console.log(`\n\n\x1b[32m✔ Success! The model execution completed successfully.\x1b[0m`);
    console.log(`👉 Verified output blueprint created at: ${finalOutputPath}\n`);
    cleanAndExtractMermaid(finalOutputPath); 
  } catch (err) {
    console.error(`\n\x1b[31m✕ Pipeline Run Failure:\x1b[0m`, err.message);
  } finally {
    rl.close();
  }
})();
function cleanAndExtractMermaid(inputFilePath) {
      try {
          // 1. Verify file exists
          if (!fs.existsSync(inputFilePath)) {
              console.error(`❌ [ERROR] Source file not found at: \${inputFilePath}`);
              return;
          }
  
          // 2. Read the source text content
          const rawContent = fs.readFileSync(inputFilePath, 'utf8');
  
          // 3. Split the file using the "Assistant:" delimiter case-sensitively
          // const marker = "Assistant:";
          // const segments = rawContent.split(marker);
  
          // // Crucial validation: Ensure there are at least two "Assistant:" markers present (creating 3 parts)
          // if (segments.length < 2) {
          //     console.error(`❌ [ERROR] Aborting code execution: Could not locate the second "\${marker}" token block in the file.`);
          //     return;
          // }
  
          // 4. Extract everything following the second "Assistant:" block
          // segments[0] = before 1st Assistant
          // segments[1] = between 1st and 2nd Assistant
          // segments[2...] = everything after the 2nd Assistant (rejoined in case the string appears in the code text)
         // let coreContent = segments.slice(1).join(marker).trim();
  const coreContent = extractAfterLastAssistant(rawContent);
          // 5. Wrap inside clean markdown code fence backticks blocks
          const finalOutput = `\`\`\`mermaid\n${coreContent}\n\`\`\``;
  
          // 6. Generate precise execution timestamp filename string (Format: YYYYMMDD_HHMMSS)
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
  
  
          const outputFileName = `mermaid_diagram_${timestamp}.md`;
          const outputFilePath = path.join(path.dirname(inputFilePath), outputFileName);
  
          // 7. Commit write configuration array output directly onto physical hardware disk
          await fs.writeFileSync(outputFilePath, finalOutput, 'utf8');
          console.log(`🎉 [SUCCESS] File cleanly processed and exported!`);
          console.log(`📁 Saved to location: ${outputFilePath}`);
          
      } catch (error) {
          console.error("💥 [CRITICAL CRASH] Redirection exception caught within file pipeline processing loop:", error);
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