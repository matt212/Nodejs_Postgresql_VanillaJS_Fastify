/**
 * ============================================================================
 * SECTION 1: CORE DEPENDENCIES, IMPORTS & SYSTEM CONFIGURATION
 * ============================================================================
 */
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const CONFIG = {
  PATHS: {
    PROJECT_ROOT: path.resolve(__dirname, '../../../../'),
    OUTPUT_RELATIVE_DIR: 'app/utils/appflowgeneratorAI/aiOutput/baseline/',
    TMP_RELATIVE_DIR: 'app/utils/appflowgeneratorAI/promptFile',
    EXPORT_PREFIX: '8.Final-System-Architecture-Blueprint-Graph-'
  },
  MODEL: {
    EXEC_BINARY: 'llama-cli',
    // Resolved: Re-instating high-fidelity Qwen 3.5 9B asset lifecycle parsing variant
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

/**
 * ============================================================================
 * SECTION 2: INGESTION ENGINE & BUSINESS RAG PROCESSOR
 * ============================================================================
 */
class FunctionalArchitectureRAG {
  constructor(dataMatrix, actorMatrix, journeyMatrix, mermaidGraph) {
    this.dataMatrix = dataMatrix;       
    this.actorMatrix = actorMatrix;     
    this.journeyMatrix = journeyMatrix; 
    this.mermaidGraph = mermaidGraph;   
    this.vectorIndex = new Map();
  }

  buildCrossReferenceIndex() {
    this.dataMatrix.forEach(entity => {
      const entityKey = this.normalizeKey(entity.object_name);
      const journeyContext = this.retrieveJourneyChunks(entity.object_name);
      const graphTopology = this.retrieveGraphTopologyChunks(journeyContext.stepIndex);
      const rbacContext = this.retrieveActorClearanceChunks(entity.object_name);

      this.vectorIndex.set(entityKey, {
        rawName: entity.object_name,
        ioSchema: entity,
        chronology: journeyContext,
        topology: graphTopology,
        rbac: rbacContext
      });
    });
  }

  normalizeKey(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  retrieveJourneyChunks(objectName) {
    let stepIndex = "0";
    let textualContext = "Unmapped Timeline Context";
    let groupLayerName = "System Operations Group"; 
    const normalizedTarget = objectName.toLowerCase().trim();

    for (const journey of this.journeyMatrix) {
      if (Array.isArray(journey.chronological_milestones_and_data_inputs)) {
        const structuralMatch = journey.chronological_milestones_and_data_inputs.find(milestone => {
          const contentText = milestone.data_object_layer.toLowerCase();
          return contentText.includes(normalizedTarget);
        });

        if (structuralMatch) {
          stepIndex = structuralMatch.step;
          textualContext = structuralMatch.data_object_layer;
          if (journey.journey_name) {
            groupLayerName = journey.journey_name;
          }
          break; 
        }
      }
    }
    return { stepIndex, textualContext, groupLayerName };
  }

  retrieveGraphTopologyChunks(stepIndex) {
    const graphString = JSON.stringify(this.mermaidGraph);
    const targetToken = `p${stepIndex}_1`;

    return {
      hasSoftFailLoop: graphString.includes(`${targetToken}_degraded`) || graphString.includes('Discrepancy'),
      hasHardFailRollback: graphString.includes(`${targetToken}_reject`) || graphString.includes('Rollback'),
      associatedGate: targetToken
    };
  }

  retrieveActorClearanceChunks(objectName) {
    const permissions = [];
    this.actorMatrix.forEach(actor => {
      const scope = actor.access_authorization_and_scope || {};
      Object.keys(scope).forEach(vectorKey => {
        if (Array.isArray(scope[vectorKey])) {
          if (scope[vectorKey].some(item => item.toLowerCase().includes(objectName.toLowerCase()))) {
            permissions.push({ role: actor.actor_name, vector: vectorKey, policies: scope.Business_Rules_And_Guardrails || {} });
          }
        }
      });
    });
    return permissions;
  }

  compileLifecycleLedger(targetEntityId) {
    const context = this.vectorIndex.get(targetEntityId);
    if (!context) return { error: "Target entity metadata chunk not found." };

    const finalBusinessStages = [];

    finalBusinessStages.push({
      stage: "INITIALIZED / STAGED",
      functionalCriteria: `Asset created via: ${context.ioSchema.input}. Timeline Track: ${context.chronology.textualContext}`
    });

    finalBusinessStages.push({
      stage: "PROCESSING_VALIDATION",
      functionalCriteria: `Executing: ${context.ioSchema.activity}. Outputs schema payload: ${context.ioSchema.output}.`
    });

    if (context.topology.hasSoftFailLoop) {
      finalBusinessStages.push({
        stage: "DEGRADED_REMEDIATION_LOOP",
        functionalCriteria: "Validation discrepancy parsed from graph tracking matrix. Routing control to exception loops."
      });
    }

    const uniqueGuardrails = [...new Set(context.rbac.map(r => JSON.stringify(r.policies)))].map(p => JSON.parse(p));

    finalBusinessStages.push({
      stage: "FINAL_MUTATION_COMMIT",
      functionalCriteria: `Asset state finalized. Governed by structural parameters: ${JSON.stringify(uniqueGuardrails)}`
    });

    return {
      entity: context.rawName,
      compiledAssetLifecycleLedger: finalBusinessStages
    };
  }
  /**
   * ============================================================================
   * SECTION 3: 100% DATA-DRIVEN TARGET MUTATION COMPILER (QWEN 3.5 9B BALANCED)
   * ============================================================================
   */
  generateSemanticBlueprintAI(compiledJsonLedger, finalTargetFilePath, callback) {
    let structuralPayload = "";
    const businessLayersMap = new Map();
    
    // Group entities programmatically by operational timeline tracking zones
    Object.keys(compiledJsonLedger).forEach(key => {
      const entityData = compiledJsonLedger[key];
      const context = this.vectorIndex.get(key);
      if (!context) return;

      const contextualGroupName = context.chronology.groupLayerName || "Operational Specification Layers";

      if (!businessLayersMap.has(contextualGroupName)) {
        businessLayersMap.set(contextualGroupName, []);
      }
      businessLayersMap.get(contextualGroupName).push({ entityData, context });
    });

    // Native Node.js compiler loop formats formatting fences to prevent 9B layout cracking
    businessLayersMap.forEach((assetsList, structuralLayerHeader) => {
      structuralPayload += `\n# {{TRANSLATE_LAYER_HEADER: "${structuralLayerHeader}"}}\n\n`;
      
      assetsList.forEach(({ entityData }) => {
        structuralPayload += `* **${entityData.entity}**\n`;
        
        entityData.compiledAssetLifecycleLedger.forEach(ledgerItem => {
          let operationalCriteria = ledgerItem.functionalCriteria;
          
          if (ledgerItem.stage.includes("FINAL_MUTATION_COMMIT")) {
            operationalCriteria = operationalCriteria.replace(/Governed by structural parameters: \[([\s\S]*?)\]/, (match, p1) => {
              try {
                return "Governed by active business guardrails: " + JSON.parse("[" + p1 + "]").map(policy => 
                  Object.entries(policy).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join("; ")
                ).join(" | ");
              } catch (e) { return operationalCriteria; }
            });
          }
          
          structuralPayload += `  * \`• {{TERM_FOR: "\${operationalCriteria}"}}\`: ${operationalCriteria}\n`;
        });
        structuralPayload += `\n`;
      });
    });

    const promptTmpPath = path.join(CONFIG.PATHS.PROJECT_ROOT, CONFIG.PATHS.TMP_RELATIVE_DIR, `inference_prompt_${Date.now()}.txt`);
    
    // Strict dictionary token map prompt tailored for unsloth Qwen 3.5 context windows
    const instructionPrompt = `[SYSTEM CONSTRAINTS INTERFACE]
You are a precise text mutation engine. Process the document text below line by line.

[MUTATION INSTRUCTIONS]
1. Locate "{{TRANSLATE_LAYER_HEADER: "LAYER_NAME"}}" and replace it with a clean corporate layer tier name containing an appropriate theme emoji (e.g., 🧱 User & Access Objects Group, 🗺️ Context & Curation Objects Group, 💳 Order & Transaction Objects Group, 📦 Supply Chain & Logistics Objects Group, 🛑 Post-Order & Exception Lifecycle Objects Group).
2. Locate "{{TERM_FOR: "CONTEXT_TEXT"}}" and replace the entire double-brace tag container block with a concise, high-fidelity 1-2 word upper-case business domain state keyword (e.g., UNVERIFIED, ACTIVE, SUSPENDED, PROPOSED, INITIALIZED, VALIDATED, OUT_OF_BOUNDS, STAGED, RECONCILED, INVALIDATED, DRAFT, SUBMITTED, AUTHORIZED, APPROVED) deduced solely from the contextual clues inside the quotation marks.
3. CRITICAL: Do not alter, rearrange, delete, or add any markdown asterisks, bullet indents, headers, or criteria details outside the two designated bracket formats.

[TARGET SOURCE TEXT]
${structuralPayload}`;

    fs.mkdirSync(path.dirname(promptTmpPath), { recursive: true });
    fs.writeFileSync(promptTmpPath, instructionPrompt, 'utf8');

    // Context allocation sized precisely to process 9B layers efficiently withoutvirtual swap thrashes
    const execArgs = [
      '-hf', CONFIG.MODEL.IDENTIFIER,
      '-ngl', CONFIG.MODEL.NGL,
      '--single-turn',
      '-c', '8048', 
      '-b', CONFIG.MODEL.BATCH_SIZE, 
      '-t', CONFIG.MODEL.THREADS,     
      '--reasoning', CONFIG.MODEL.REASONING_MODE,
      '--log-disable', 
      '-n', CONFIG.MODEL.MAX_TOKENS,
      '-f', promptTmpPath, 
      '-o', finalTargetFilePath 
    ];

    console.log(`\n🚀 Launching single-turn 9B context mutation sweep pass...`);
    
    execFile(CONFIG.MODEL.EXEC_BINARY, execArgs, { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {
      if (fs.existsSync(promptTmpPath)) fs.unlinkSync(promptTmpPath);
      if (error) return callback(error, null);
      callback(null, finalTargetFilePath);
    });
  }
}
/**
 * ============================================================================
 * SECTION 4: FILE SYSTEM SCANNING & MAIN PIPELINE RUNTIME LOOP
 * ============================================================================
 */
const OUTPUT_DIR = path.join(CONFIG.PATHS.PROJECT_ROOT, CONFIG.PATHS.OUTPUT_RELATIVE_DIR);
const objectsFilePath = resolveLatestStageFile(OUTPUT_DIR, CONFIG.SCANNING_PATTERNS.STAGE_1_OBJECTS);
const actorsFilePath = resolveLatestStageFile(OUTPUT_DIR, CONFIG.SCANNING_PATTERNS.STAGE_2_ACTORS);
const journeysFilePath = resolveLatestStageFile(OUTPUT_DIR, CONFIG.SCANNING_PATTERNS.STAGE_3_JOURNEYS);
const topologyFilePath = resolveLatestStageFile(OUTPUT_DIR, CONFIG.SCANNING_PATTERNS.STAGE_4_TOPOLOGY);

if (!objectsFilePath || !actorsFilePath || !journeysFilePath || !topologyFilePath) {
  throw new Error("Could not automatically locate all four required input source files inside your output directory.");
}

console.log(`\n📂 Reading Input 1: ${path.basename(objectsFilePath)}`);
console.log(`📂 Reading Input 2: ${path.basename(actorsFilePath)}`);
console.log(`📂 Reading Input 3: ${path.basename(journeysFilePath)}`);
console.log(`📂 Reading Input 4: ${path.basename(topologyFilePath)}`);

const objectsMatrixContent = fs.readFileSync(objectsFilePath, 'utf8');
const actorsMatrixContent = fs.readFileSync(actorsFilePath, 'utf8');
const journeysMatrixContent = fs.readFileSync(journeysFilePath, 'utf8');
const topologyGraphContent = fs.readFileSync(topologyFilePath, 'utf8');

const cleanJsonArray1 = JSON.parse(objectsMatrixContent.slice(objectsMatrixContent.lastIndexOf('===') + 3).trim());
const cleanJsonArray2 = JSON.parse(actorsMatrixContent.slice(actorsMatrixContent.lastIndexOf('===') + 3).trim());
const cleanJsonArray3 = JSON.parse(journeysMatrixContent.slice(journeysMatrixContent.lastIndexOf('===') + 3).trim());

const ragEngine = new FunctionalArchitectureRAG(
  cleanJsonArray1,
  cleanJsonArray2,
  cleanJsonArray3,
  topologyGraphContent
);

ragEngine.buildCrossReferenceIndex();

const finalCompleteSpecificationLedger = {};
Object.keys(ragEngine.dataMatrix).forEach(index => {
  const dynamicKey = ragEngine.normalizeKey(ragEngine.dataMatrix[index].object_name);
  finalCompleteSpecificationLedger[dynamicKey] = ragEngine.compileLifecycleLedger(dynamicKey);
});

const now = new Date();
const day = String(now.getDate()).padStart(2, '0');
const month = String(now.getMonth() + 1).padStart(2, '0'); 
const year = String(now.getFullYear()).slice(-2);          
let hours = now.getHours();
const minutes = String(now.getMinutes()).padStart(2, '0');
const ampm = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12; 
const formattedHours = String(hours).padStart(2, '0');

const timestamp = `${day}-${month}-${year}_${formattedHours}:${minutes}${ampm}`;
const finalOutputPath = path.join(OUTPUT_DIR.replace("baseline/",""), `${CONFIG.PATHS.EXPORT_PREFIX}${timestamp}.md`);

ragEngine.generateSemanticBlueprintAI(finalCompleteSpecificationLedger, finalOutputPath, (err, targetSavedPath) => {
  if (err) {
    console.error("❌ CRITICAL_INFERENCE_ERROR: GGUF pipeline compilation failed:", err);
    process.exit(1);
  }
  console.log(`\n🎉 SUCCESS: Dynamic Business Lifecycle Specification compiled and saved via local 9B GGUF to: ${targetSavedPath}`);
});

function resolveLatestStageFile(directory, prefixPattern) {
  if (!fs.existsSync(directory)) return null;
  const files = fs.readdirSync(directory);
  const matchedFiles = files.filter(f => f.startsWith(prefixPattern));
  if (matchedFiles.length === 0) return null;

  matchedFiles.sort((a, b) => fs.statSync(path.join(directory, b)).mtimeMs - fs.statSync(path.join(directory, a)).mtimeMs);
  return path.join(directory, matchedFiles[0]); // Explicit array boundary safe lock
}
