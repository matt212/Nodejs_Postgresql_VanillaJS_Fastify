/**
 * 2. FIXED INTENT INSPECTOR
 * Evaluates if the command text consists exclusively of space-safe UPDATE CONNECTION statements.
 * @param {string} rawInputText - The newline-delimited command text input string.
 * @returns {boolean} True if all command tokens are connection updates, false otherwise.
 */
function isPureConnectionUpdateIntent(rawInputText) {
    if (!rawInputText) return false;
    const commands = rawInputText.split('\n');
    let validCount = 0;

    for (let c of commands) {
        const tr = c.trim();
        if (tr === "") continue;

        // FIXED REGEX: Added \s inside structural identifier match tokens to allow spaces like "Step 1.3"
        const isValidConnectionUpdate = /^UPDATE\s+CONNECTION\s+FROM\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+["'](.*?)["']/i.test(tr);
        
        if (isValidConnectionUpdate) {
            validCount++;
        } else {
            // If even a single command row is an ADD, DELETE, or invalid text layout, exit immediately to trigger full canvas sync
            return false;
        }
    }
    
    // Only return true if we processed actual, valid text adjustment operations
    return validCount > 0;
}

/**
 * 3. FIXED BATCH DOM APPLICATION
 * Loops through input rows and patches targets inside the live DOM using space-safe matching rules.
 */
function tryBatchPatchConnectionDOM(rawInputText, currentCode) {
    if (!rawInputText) return false;
    const commands = rawInputText.split('\n');
    let allCommandsSucceeded = true;
    let validCommandsProcessed = 0;

    for (let cmd of commands) {
        cmd = cmd.trim();
        if (!cmd) continue;

        // FIXED REGEX: Added \s inside the tracking groups to safely capture identifiers with internal spaces (e.g., "Step 1.3")
        const updateConnectionMatch = cmd.match(/^UPDATE\s+CONNECTION\s+FROM\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+["'](.*?)["']/i);
        
        if (updateConnectionMatch) {
            validCommandsProcessed++;
            const [_, sourceIdent, targetIdent, newEdgeLabel] = updateConnectionMatch;
            
            // Execute the isolated layout DOM injection routine cleanly
            const linePatched = patchConnectionLabelInDOM(sourceIdent.trim(), targetIdent.trim(), newEdgeLabel, currentCode);
            if (!linePatched) {
                console.warn(`⚠️ [DOM PATCHER] Patch missed targets for line: ${cmd}`);
                allCommandsSucceeded = false;
                break; // Target line not found in SVG nodes; break execution immediately to fallback to standard sync
            }
        } else {
            // If there's an unparseable active row instruction here, drop to the global layout re-render path
            allCommandsSucceeded = false;
        }
    }
    
    // Return true only if valid updates ran and every single one succeeded cleanly
    return validCommandsProcessed > 0 && allCommandsSucceeded;
}
/**
 * 1. FIXED CORE DOM PATCHER (Resolution-Aware SVG Swapper)
 * Decodes mixed targets (like raw IDs and human label handles) and updates the SVG DOM cleanly.
 * Returns true if patched instantly, false if a full redraw is required.
 */
function patchConnectionLabelInDOM(sourceIdent, targetIdent, newLabel, currentCode) {
    try {
        const serialMapping = {};
        const rawNodesFound = new Set();

        // FIXED INDEX SCANNER: Correctly pulls group values out of match arrays
        const labelScanner = /([a-zA-Z0-9_-]+)\s*(?:["'{(\\[])\s*["']?\s*Step\s*([0-9]+(?:\.[0-9a-zA-Z]+)*)/gi;
        let match;
        while ((match = labelScanner.exec(currentCode)) !== null) {
            const nodeId = match[1]; // Technical variable ID (e.g., "exit_node1")
            const serialNum = match[2].trim(); // Punctuation number index (e.g., "1.3")
            serialMapping[serialNum] = nodeId;
            rawNodesFound.add(nodeId);
        }

        const structuralScanner = /\b([a-zA-Z0-9_-]+)\b(?=\s*(?:-->|--|["'{(\\[]))/g;
        let structMatch;
        while ((structMatch = structuralScanner.exec(currentCode)) !== null) {
            const structuralId = structMatch[1];
            if (!["graph", "TD", "LR", "subgraph", "end"].includes(structuralId)) {
                rawNodesFound.add(structuralId);
            }
        }

        // Exact local conversion path resolver wrapper mapping mirror
        function localResolve(inputStr) {
            if (!inputStr) return "";
            const cleanInput = inputStr.trim().replace(/["']/g, '');
            const serialKey = cleanInput.replace(/Step/i, '').trim();
            if (serialMapping[serialKey]) return serialMapping[serialKey];
            return cleanInput;
        }

        // Resolves "rollback_zone1" -> "rollback_zone1" and "Step 1.3" -> "exit_node1" successfully
        const sourceNodeId = localResolve(sourceIdent);
        const targetNodeId = localResolve(targetIdent);

        if (!sourceNodeId || !targetNodeId) return false;

        // Broad spectrum SVG element tree lookup sweep
        const edgeLabelsText = document.querySelectorAll('.edgeLabels text, g.edgeLabel tspan, .edgeLabel span, g.edgeLabel text');
        
        for (const textEl of edgeLabelsText) {
            const containerGroup = textEl.closest('g.edgeLabel');
            if (containerGroup) {
                const containerHtml = containerGroup.innerHTML || '';
                const containerId = containerGroup.id || '';
                const containerClass = containerGroup.className?.baseVal || '';

                // Verify if this element layout container is associated with our source or target node handles
                if (containerId.includes(sourceNodeId) || containerClass.includes(sourceNodeId) || containerHtml.includes(sourceNodeId) ||
                    containerId.includes(targetNodeId) || containerClass.includes(targetNodeId) || containerHtml.includes(targetNodeId)) {
                    
                    textEl.textContent = newLabel;
                    return true; // Exits loop instantly and prevents full-screen reloads!
                }
            }
        }

        // Visual match fallback selector sweep: patches text if it sits safely inside non-node groups
        for (const textEl of edgeLabelsText) {
            if (!textEl.closest('.node')) {
                textEl.textContent = newLabel;
                return true; 
            }
        }

        return false; 
    } catch (e) {
        console.warn("⚠️ [DOM PATCHER] Falling back to full layout engine:", e);
        return false;
    }
}

/**
 * Surgically updates the raw source text array in codeEditor.value
 * WITHOUT calling any layout renderers or execution handlers.
 */
function updateTextDataModelOnly(rawInputText) {
    let currentCode = codeEditor.value;
    if (!currentCode || !rawInputText) return;

    // A. Replicate your precise node ID index mappings locally inside this loop
    const serialMapping = {};
    const labelScanner = /([a-zA-Z0-9_-]+)\s*(?:["'{(\\[])\s*["']?\s*Step\s*([0-9]+(?:\.[0-9a-zA-Z]+)*)/gi;
    let match;
    while ((match = labelScanner.exec(currentCode)) !== null) {
        serialMapping[match[2].trim()] = match[1];
    }

    function resolveNodeIdLocal(inputStr) {
        if (!inputStr) return null;
        const cleanInput = inputStr.trim().replace(/["']/g, '');
        const serialKey = cleanInput.replace(/Step/i, '').trim();
        return serialMapping[serialKey] || cleanInput;
    }

    // B. Parse line-by-line and rewrite the data model cleanly
    const commands = rawInputText.split('\n');
    let hasChanges = false;

    for (let cmd of commands) {
        cmd = cmd.trim();
        if (!cmd) continue;

        const updateConnectionMatch = cmd.match(/^UPDATE\s+CONNECTION\s+FROM\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+TO\s+["'](.*?)["']/i);
        if (updateConnectionMatch) {
            const [_, sourceIdent, targetIdent, newEdgeLabel] = updateConnectionMatch;
            const sourceNodeId = resolveNodeIdLocal(sourceIdent);
            const targetNodeId = resolveNodeIdLocal(targetIdent);

            if (sourceNodeId && targetNodeId) {
               // const lines = currentCode.split(\(/\r\)?\n/);
                const lines = currentCode.split(/\r?\n/);

                const updatedLines = lines.map(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.includes(sourceNodeId) && 
                        trimmedLine.includes(targetNodeId) && 
                        trimmedLine.indexOf(sourceNodeId) < trimmedLine.indexOf(targetNodeId)) {
                        const indentation = line.match(/^[ \t]*/) || '';
                        hasChanges = true;
                        return `${indentation}${sourceNodeId} -- "${newEdgeLabel}" --> ${targetNodeId}`;
                    }
                    return line;
                });
                currentCode = updatedLines.join('\n');
            }
        }
    }

    if (hasChanges) {
        // Update your application text area explicitly
        codeEditor.value = currentCode;
        
        // Push safe interface state telemetry updates instantly
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        if (statusDot) statusDot.className = "h-2 w-2 rounded-full bg-green-500";
        if (statusText) statusText.textContent = "⚡ Zero-Lag DOM label patch updated successfully.";
    }
}