/**
 * ============================================================================
 * SECTION 1: CORE DEPENDENCIES, IMPORTS & SYSTEM CONFIGURATION
 * ============================================================================
 */
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { config } = require('process');

let CONFIG = {
  PATHS: {
    PROJECT_ROOT: path.resolve(__dirname, '../../../../'),
    OUTPUT_RELATIVE_DIR: 'app/utils/appflowgeneratorAI/aiOutput/baseline/',
    TMP_RELATIVE_DIR: 'app/utils/appflowgeneratorAI/promptFile',
    EXPORT_PREFIX: '8.6.2.Final-System-Architecture-Blueprint-Graph-'
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

    // Pass the raw data chunks directly so the 9B model can derive domain-specific stages
    const uniqueGuardrails = [...new Set(context.rbac.map(r => JSON.stringify(r.policies)))].map(p => JSON.parse(p));

    return {
      entity: context.rawName,
      inputContext: context.ioSchema.input || "No initial inputs defined",
      activityContext: context.ioSchema.activity || "No core processing activity defined",
      outputContext: context.ioSchema.output || "No output payloads defined",
      timelineContext: context.chronology.textualContext || "Unmapped timeline track",
      step: context.chronology.stepIndex || "0",
      hasExceptionLoop: context.topology.hasSoftFailLoop,
      guardrails: uniqueGuardrails
    };
  }

  

  /**
   * ============================================================================
   * UPDATED SECTION 3: DOMAIN-CENTRIC LIYECYCLE BLUEPRINT GENERATOR
   * ============================================================================
   */
    /**
   * ============================================================================
   * COMPLETELY AGNOSTIC SECTION 3: ZERO HARDCODED COGNITIVE BIAS
   * ============================================================================
   */
   /**
   * ============================================================================
   * TWO-PASS STRUCTURED COMPILER (AGNOSTIC & HIGH-VELOCITY)
   * ============================================================================
   */
  generateSemanticBlueprintAI(compiledJsonLedger, finalTargetFilePath, callback) {
    const promptTmpPath1 = path.join(CONFIG.PATHS.PROJECT_ROOT, CONFIG.PATHS.TMP_RELATIVE_DIR, `pass1_discovery_${Date.now()}.txt`);
    const promptTmpPath2 = path.join(CONFIG.PATHS.PROJECT_ROOT, CONFIG.PATHS.TMP_RELATIVE_DIR, `pass2_serialization_${Date.now()}.txt`);

    
        // ------------------------------------------------------------------------
    // PASS 1: FULL DATA MATRIX INGESTION (EXPOSING ALL RICH CONTEXT)
    // ------------------------------------------------------------------------
        // ------------------------------------------------------------------------
    // HARDENED PASS 1 PAYLOAD INGESTION (STRUCTURALLY FORCING EXCEPTION SLOTS)
    // ------------------------------------------------------------------------
    let pass1Payload = "{\n";
    Object.keys(compiledJsonLedger).forEach(key => {
      const entityData = compiledJsonLedger[key];
      pass1Payload += `  "${entityData.entity}": {\n`;
      pass1Payload += `    "ingestion_inputs": "${entityData.inputContext}",\n`;
      pass1Payload += `    "core_processing_activity": "${entityData.activityContext}",\n`;
      pass1Payload += `    "output_payload_schema": "${entityData.outputContext}",\n`;
      pass1Payload += `    "has_degraded_exception_loop": ${entityData.hasExceptionLoop},\n`;
      pass1Payload += `    "governing_guardrail_policies": ${JSON.stringify(entityData.guardrails)},\n`;
      // CRITICAL SKELETON FORCE: The model is forced to fill these out dynamically
      pass1Payload += `    "REQUIRED_OUTPUT_STAGES": {\n`;
      pass1Payload += `      "HAPPY_PATH_CHRONOLOGY": ["DEDUCE_START_STATE", "DEDUCE_MID_STATE", "DEDUCE_FINAL_STATE"],\n`;
      pass1Payload += `      "SYSTEM_EXCEPTION_AND_REMEDIATION_POSTURES": ${entityData.hasExceptionLoop ? '["DEDUCE_ACTIVE_VULNERABILITY_OR_DEGRADED_STATE"]' : '[]'},\n`;
      pass1Payload += `      "GUARDRAIL_RESTRICTION_AND_SAFETY_LOCKOUTS": ["DEDUCE_SECURITY_OR_IMMUTABILITY_STATE"]\n`;
      pass1Payload += `    }\n`;
      pass1Payload += `  },\n`;
    });
    pass1Payload = pass1Payload.slice(0, -2) + "\n}";

    const pass1Prompt = `[SYSTEM INTERFACE: ENTERPRISE STATE DISCOVERY]
You are a Principal Business Systems Architect running a strict JSON structure mutation pass. 
Your sole task is to analyze the data parameters provided inside each object and overwrite the placeholder strings inside the "REQUIRED_OUTPUT_STAGES" block with high-fidelity, upper-case business state keywords.

[BUSINESS CONTEXT ENVIRONMENT]
- Core Domain: ${CONFIG.DOMAIN_CONTEXT.NAME}
- Industry Niche: ${CONFIG.DOMAIN_CONTEXT.NICHE}

[MUTATION DIRECTIONS]
1. For every business object, process its data fields and completely replace the dummy strings ("DEDUCE_...") with real, domain-specific passive past-participle adjectives (ending in _ED, _LOCKED, _HELD, _SETTLED).
2. "HAPPY_PATH_CHRONOLOGY": Extract 3 progressive operational milestones from the inputs, activities, and schema outputs.
3. "SYSTEM_EXCEPTION_AND_REMEDIATION_POSTURES": If "has_degraded_exception_loop" is true, write a highly custom state keyword reflecting the asset's condition when stuck in an active degradation or failure loop. 
4. "GUARDRAIL_RESTRICTION_AND_SAFETY_LOCKOUTS": Analyze "governing_guardrail_policies" (including security constraints, credential rules, fraud overrides, and immutability parameters). Write a custom state representing when the asset is administratively frozen, locked out, or completely restricted.
5. CRITICAL LINGUISTIC RESTRAINTS: 
   * Maximum 1-3 words per state keyword. No active system verbs (e.g., do not use terms ending in _CALCULATED, _CHECKING).
   * Do not reuse the exact same word (like LOCKED or SUSPENDED) everywhere. Custom-tailor the words to match the access, financial, or logistical nature of the asset payload.
   * ANTI-LEAKAGE RULE: Do not use terms like MASKED, ENCRYPTED, or ANONYMIZED across all arrays. 

[OUTPUT FORMAT SKELETON]
Output must be a valid, flat JSON map matching this structure exactly:
{
  "Object Name": ["STATE_1", "STATE_2", "STATE_3", "STATE_4"]
}

[TARGET SOURCE TEXT]
${pass1Payload}`;









    fs.mkdirSync(path.dirname(promptTmpPath1), { recursive: true });
    fs.writeFileSync(promptTmpPath1, pass1Prompt, 'utf8');

    const execArgsPass1 = [
      '-hf', CONFIG.MODEL.IDENTIFIER,
      '-ngl', CONFIG.MODEL.NGL,
      '--single-turn',
      '-c', '4096', // Tight context for speed
      '-b', CONFIG.MODEL.BATCH_SIZE, 
      '-t', CONFIG.MODEL.THREADS,     
      '--reasoning', CONFIG.MODEL.REASONING_MODE,
      '--log-disable', 
      '-n', '2048',
      '-f', promptTmpPath1
    ];

    console.log(`\n⚡ Running Pass 1: Blazing-fast dynamic state name discovery...`);
    
    // Execute Pass 1 to discover state names
    execFile(CONFIG.MODEL.EXEC_BINARY, execArgsPass1, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
      if (fs.existsSync(promptTmpPath1)) fs.unlinkSync(promptTmpPath1);
      if (error) return callback(error, null);

      let discoveredStatesMap = {};
      try {
        // Strip any accidental text wrapping the model might output
        const jsonStart = stdout.indexOf('{');
        const jsonEnd = stdout.lastIndexOf('}') + 1;
        discoveredStatesMap = JSON.parse(stdout.slice(jsonStart, jsonEnd));
      } catch (parseErr) {
        console.warn("⚠️ Pass 1 JSON parsing split-edge warning, recovering via fallback maps.");
        discoveredStatesMap = {};
      }

      // ------------------------------------------------------------------------
      // PASS 2: DETERMINISTIC BLUEPRINT SERIALIZATION
      // ------------------------------------------------------------------------
      let structuralPayload = "";
      const businessLayersMap = new Map();
      
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

      businessLayersMap.forEach((assetsList, structuralLayerHeader) => {
        structuralPayload += `\n# TARGET_LAYER: "${structuralLayerHeader}"\n\n`;
        
        assetsList.forEach(({ entityData }) => {
          // Pull the dynamically generated states from our Pass 1 Map
          const assignedStates = discoveredStatesMap[entityData.entity] || ["STAGED", "PROCESSING", "FINALIZED"];
          
          structuralPayload += `* **${entityData.entity}**\n`;
          structuralPayload += `  [OBJECT_CONTEXT_START]\n`;
          structuralPayload += `  - Operational Context: ${entityData.timelineContext} handling ${entityData.activityContext}.\n`;
          structuralPayload += `  - Active Guardrails: ${JSON.stringify(entityData.guardrails)}\n`;
          structuralPayload += `  [OBJECT_CONTEXT_END]\n`;
          
          // Print out the exact skeletal states for the model to define
          assignedStates.forEach(state => {
            structuralPayload += `  * \`• \${state}\`: [WRITE_DEFINITION_FOR_${state}]\n`;
          });
          structuralPayload += `\n`;
        });
      });

      const pass2Prompt = `[SYSTEM INTERFACE: COMPILER TIER]
You are an enterprise architecture blueprint engine. Your task is to fill out definitions inside the provided blueprint text.

[MUTATION INSTRUCTIONS]
1. Replace '# TARGET_LAYER: "LAYER_NAME"' with a corporate group header, prepending a highly relevant visual theme emoji matching the scope.
2. Locate each tag formatted like '[WRITE_DEFINITION_FOR_STATE]'. Replace that specific token with a single high-fidelity corporate description sentence explaining how that specific state operates under the provided '[OBJECT_CONTEXT_START]' parameters.
3. Clean the blueprint: Remove all '[OBJECT_CONTEXT_START]' and '[OBJECT_CONTEXT_END]' tags and their interior contents from the final output file.
4. Do not alter, rearrange, or delete any markdown bullet indents, bold markings, or state names.

[TARGET SOURCE TEXT]
${structuralPayload}`;

      fs.writeFileSync(promptTmpPath2, pass2Prompt, 'utf8');

      const execArgsPass2 = [
        '-hf', CONFIG.MODEL.IDENTIFIER,
        '-ngl', CONFIG.MODEL.NGL,
        '--single-turn',
        '-c', '8048', 
        '-b', CONFIG.MODEL.BATCH_SIZE, 
        '-t', CONFIG.MODEL.THREADS,     
        '--reasoning', CONFIG.MODEL.REASONING_MODE,
        '--log-disable', 
        '-n', CONFIG.MODEL.MAX_TOKENS,
        '-f', promptTmpPath2, 
        '-o', finalTargetFilePath 
      ];

      console.log(`🚀 Running Pass 2: Generating definitions for discovered states...`);
      
      execFile(CONFIG.MODEL.EXEC_BINARY, execArgsPass2, { maxBuffer: 1024 * 1024 * 100 }, (err2, stdout2, stderr2) => {
        if (fs.existsSync(promptTmpPath2)) fs.unlinkSync(promptTmpPath2);
        if (err2) return callback(err2, null);
        callback(null, finalTargetFilePath);
      });
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


const interim =objectsMatrixContent.split('===')[1]
const match = interim.match(/domain\s*:\s*(?<domain>.*?)\s*and\s*niche\s*:\s*(?<niche>.*?)\s*$/);

if (match && match.groups) {
  const domainName = match.groups.domain.trim();
  const nicheName = match.groups.niche.trim();

  CONFIG.DOMAIN_CONTEXT = {
    NAME: domainName,
    NICHE: nicheName
  };

  
  
  // Output: Hyperlocal Grocery Delivery
}


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
