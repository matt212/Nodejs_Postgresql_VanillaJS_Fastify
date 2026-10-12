async function executeSerialMermaidCommand(commandText) {
    let currentCode = codeEditor.value;
    if (!currentCode || !commandText) return;
    // --- PHASE 1: GENERATE TELEMETRY INDEX MAPPING SYSTEMS ---
    const serialMapping = {}; // Index directory tracker for numbers: {"1.1": "entrance_node1"}
    const rawNodesFound = new Set(); // Directory tracker for raw node names: ["rollback_zone1"]
    // 1. Scan and parse step serial structures: node_id["Step 1.1: Text"]
    const labelScanner = /([a-zA-Z0-9_-]+)\s*(?:["'{(\\[])\s*["']?\s*Step\s*([0-9]+(?:\.[0-9a-zA-Z]+)*)/gi;
    let match;
    while ((match = labelScanner.exec(currentCode)) !== null) {
        const nodeId = match[1];
        const serialNum = match[2].trim();
        serialMapping[serialNum] = nodeId;
        rawNodesFound.add(nodeId);
    }
    // 2. Scan and discover raw node IDs that do not have Step labels (e.g., rollback_zone1)
    // Matches standalone words pointing to shapes or arrows inside subgraphs
    const structuralScanner = /\b([a-zA-Z0-9_-]+)\b(?=\s*(?:-->|--|["'{(\\[]))/g;
    let structMatch;
    while ((structMatch = structuralScanner.exec(currentCode)) !== null) {
        const structuralId = structMatch[1];
        // Skip common syntax definitions
        if (!["graph", "TD", "LR", "subgraph", "end"].includes(structuralId)) {
            rawNodesFound.add(structuralId);
        }
    }
    // 💡 THE UPGRADED AGNOSTIC RESOLVER HELPER:
    // This looks up the target element by serial prefix or fallback native name
    function resolveNodeId(inputStr) {
        if (!inputStr) return null;
        const cleanInput = inputStr.trim().replace(/["']/g, '');
        // Strategy A: Clean out word prefixes to extract serial key (e.g., "Step 1.2" -> "1.2")
        const serialKey = cleanInput.replace(/Step/i, '').trim();
        if (serialMapping[serialKey]) {
            return serialMapping[serialKey];
        }
        // Strategy B: Direct match check for raw node IDs (e.g., "rollback_zone1")
        if (rawNodesFound.has(cleanInput)) {
            return cleanInput;
        }
        // Strategy C: If it's a completely new node being declared in a CONNECT track, return it raw
        return cleanInput;
    }
    // --- PHASE 2: PARSE AND SURGICALLY COMMIT CHANGES ---
    const commands = commandText.split('\n');
    let hasChanges = false;
    for (let cmd of commands) {
        cmd = cmd.trim();
        if (!cmd) continue;
        // ==========================================================================
        // 1. OPERATION: CONNECT (Flexible Line Varieties & Text Links)
        // Format: CONNECT Step 1.2 TO Step 1.1 WITH "Valid Request Link text"
        // Supports variants: CONNECT_THICK, CONNECT_DOTTED, CONNECT_MUTUAL, etc.
        // ==========================================================================
        // const connectMatch = cmd.match(/^(CONNECT|CONNECT_THICK|CONNECT_DOTTED|CONNECT_MUTUAL|CONNECT_UNARROWED|CONNECT_INVISIBLE)\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._-]+)(?:\s+WITH\s+["']([\s\(\S\)]*?)["'])?/i);
        // if (connectMatch) {
        //     const [fullCmd, type, targetA, targetB, linkLabel] = connectMatch;
        //     const nodeA = resolveNodeId(targetA);
        //     const nodeB = resolveNodeId(targetB);
        //     if (nodeA && nodeB) {
        //         let arrowSymbol = "-->"; // Default connection arrow routing
        //         const cmdUpper = type.toUpperCase();
        //         if (cmdUpper === "CONNECT_THICK") arrowSymbol = "==>";
        //         else if (cmdUpper === "CONNECT_DOTTED") arrowSymbol = "-.->";
        //         else if (cmdUpper === "CONNECT_MUTUAL") arrowSymbol = "<-->";
        //         else if (cmdUpper === "CONNECT_UNARROWED") arrowSymbol = "---";
        //         else if (cmdUpper === "CONNECT_INVISIBLE") arrowSymbol = "~~~";
        //         const arrowStr = linkLabel 
        //             ? `    ${nodeA} -- "${linkLabel}" ${arrowSymbol} ${nodeB}\n` 
        //             : `    ${nodeA} ${arrowSymbol} ${nodeB}\n`;
        //         currentCode = currentCode.trim() + `\n${arrowStr}`;
        //         hasChanges = true;
        //     } else {
        //         console.warn(`Routing Failure: Could not track structural match for ${targetA} or ${targetB}`);
        //     }
        //     continue;
        // }
        // ==========================================================================
        // 1. OPERATION: CONNECT (Flexible Line Varieties & Text Links)
        // Format: CONNECT_THICK Step 1.2 TO Step 1.1 WITH "Invalid Credentials"
        // ==========================================================================
        const connectMatch = cmd.match(/^(CONNECT_THICK|CONNECT_DOTTED|CONNECT_MUTUAL|CONNECT_UNARROWED|CONNECT_INVISIBLE|CONNECT)\b\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._-]+)(?:\s+WITH\s+["']([\s\(\S\)]*?)["'])?/i);
        if (connectMatch) {
            const [fullCmd, type, targetA, targetB, linkLabel] = connectMatch;
            const nodeA = resolveNodeId(targetA) || targetA;
            const nodeB = resolveNodeId(targetB) || targetB;
            if (nodeA && nodeB) {
                let openSymbol = "--"; // Default open connector wrapper
                let closeSymbol = "-->"; // Default close connector wrapper
                const cmdUpper = type.toUpperCase();
                // ⚡ FIX: Sync both the opening and closing syntax strings for each line type
                if (cmdUpper === "CONNECT_THICK") {
                    openSymbol = "==";
                    closeSymbol = "==>";
                } else if (cmdUpper === "CONNECT_DOTTED") {
                    openSymbol = "-.";
                    closeSymbol = ".->";
                } else if (cmdUpper === "CONNECT_MUTUAL") {
                    openSymbol = "<--";
                    closeSymbol = "-->";
                } else if (cmdUpper === "CONNECT_UNARROWED") {
                    openSymbol = "--";
                    closeSymbol = "---";
                } else if (cmdUpper === "CONNECT_INVISIBLE") {
                    openSymbol = "~~~"; // Note: Invisible lines do not support link text labels
                    closeSymbol = "";
                }
                // Construct structurally legal Mermaid layout syntax paths
                let arrowStr;
                if (linkLabel && cmdUpper !== "CONNECT_INVISIBLE") {
                    if (cmdUpper === "CONNECT_UNARROWED") {
                        arrowStr = `    ${nodeA} ---|"${linkLabel}"| ${nodeB}\n`;
                    } else if (cmdUpper === "CONNECT_MUTUAL") {
                        arrowStr = `    ${nodeA} <-- "${linkLabel}" --> ${nodeB}\n`;
                    } else {
                        // Correctly pairs == "Text" ==> and -. "Text" .->
                        arrowStr = `    ${nodeA} ${openSymbol} "${linkLabel}" ${closeSymbol} ${nodeB}\n`;
                    }
                } else {
                    // Handles unlabeled raw connections seamlessly (e.g., A ==> B or A ~~~ B)
                    arrowStr = cmdUpper === "CONNECT_INVISIBLE" ? `    ${nodeA} ${openSymbol} ${nodeB}\n` : `    ${nodeA} ${closeSymbol} ${nodeB}\n`;
                }
                currentCode = currentCode.trim() + `\n${arrowStr}`;
                hasChanges = true;
                console.log(`🎉 [SUCCESS] Generated clean Mermaid edge: ${arrowStr.trim()}`);
            } else {
                console.warn(`Routing Failure: Could not track structural match for ${targetA} or ${targetB}`);
            }
            continue;
        }
        // ==========================================================================
        // 2. OPERATION: DISCONNECT (Removes specific arrow lines cleanly)
        // Format: DISCONNECT Step 1.2 FROM Step 1.1
        // ==========================================================================
        const disconnectMatch = cmd.match(/^DISCONNECT\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+FROM\s+(?:Step\s+)?([a-zA-Z0-9._-]+)/i);
        if (disconnectMatch) {
            const [_, targetA, targetB] = disconnectMatch;
            const nodeA = resolveNodeId(targetA);
            const nodeB = resolveNodeId(targetB);
            if (nodeA && nodeB) {
                // Wipes out labeled or flat path strings connecting these exact two keys
                const genericArrowRegex = new RegExp(`^[ \\t]*${nodeA}\\s*(?:-->|==>|-\\.-?->|<-->|---|~~~)\\s*${nodeB}\\r?\\n?`, 'gm');
                const labeledArrowRegex = new RegExp(`^[ \\t]*${nodeA}\\s*--.*?-->\\s*${nodeB}\\r?\\n?`, 'gm');
                if (genericArrowRegex.test(currentCode) || labeledArrowRegex.test(currentCode)) {
                    currentCode = currentCode.replace(genericArrowRegex, '').replace(labeledArrowRegex, '');
                    hasChanges = true;
                }
            }
            continue;
        }
        // ==========================================================================
        // 3. OPERATION: UPDATE NODE TEXT (Preserves custom geometry shapes automatically)
        // Format: UPDATE NODE Step 1.2 TO "Custom Updated Validation Process"
        // ==========================================================================
        const updateMatch = cmd.match(/^UPDATE\s+NODE\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+TO\s+["']([\s\(\S\)]*?)["']/i);
        if (updateMatch) {
            console.group(`🚀 [MERMAID AGENT] Processing UPDATE NODE Command`);
            const [fullMatch, targetIdent, newFullLabel] = updateMatch;
            const targetNodeId = resolveNodeId(targetIdent);
            if (targetNodeId) {
                const nodeLabelRegex = new RegExp(`\\b(${targetNodeId})\\s*([\\[\\(\\{"']+.*?[\\s\\S]*?[\\]\\)\\}'"]+)`, 'g');
                const containsExistingLabel = nodeLabelRegex.test(currentCode);
                nodeLabelRegex.lastIndex = 0;
                if (containsExistingLabel) {
                    // Dynamically detects open/close brackets to keep existing geometric node forms intact
                    currentCode = currentCode.replace(nodeLabelRegex, (match, id, wrappers) => {
                        let openShape = '[',
                            closeShape = ']';
                        if (wrappers.includes('((')) {
                            openShape = '((';
                            closeShape = '))';
                        } else if (wrappers.includes('([')) {
                            openShape = '([';
                            closeShape = '])';
                        } else if (wrappers.includes('[[')) {
                            openShape = '[[';
                            closeShape = ']]';
                        } else if (wrappers.includes('[(')) {
                            openShape = '[(';
                            closeShape = ')]';
                        } else if (wrappers.includes('>')) {
                            openShape = '>';
                            closeShape = ']';
                        } else if (wrappers.includes('{{')) {
                            openShape = '{{';
                            closeShape = '}}';
                        } else if (wrappers.includes('[\\')) {
                            openShape = '[\\';
                            closeShape = '/]';
                        } else if (wrappers.includes('[/')) {
                            openShape = '[/';
                            closeShape = '\\]';
                        } else if (wrappers.includes('{')) {
                            openShape = '{';
                            closeShape = '}';
                        } else if (wrappers.includes('(')) {
                            openShape = '(';
                            closeShape = ')';
                        }
                        return `${id}${openShape}"${newFullLabel}"${closeShape}`;
                    });
                    hasChanges = true;
                    console.log(`🎉 [SUCCESS] Inline text updated while keeping structure shapes intact.`);
                } else {
                    const rawNodeRegex = new RegExp(`^[ \\t]*\\b(${targetNodeId})\\b\\s*$`, 'gm');
                    if (rawNodeRegex.test(currentCode)) {
                        currentCode = currentCode.replace(rawNodeRegex, `    $1["${newFullLabel}"]`);
                    } else {
                        currentCode = currentCode.trim() + `\n    ${targetNodeId}["${newFullLabel}"]\n`;
                    }
                    hasChanges = true;
                }
            } else {
                console.error(`❌ [FAILURE] Engine could not map target "${targetIdent}" to a valid ID.`);
            }
            console.groupEnd();
            continue;
        }
        // 3. OPERATION: UPDATE Phase TEXT (Preserves custom geometry shapes automatically)
        //Format:UPDATE phase phase07 TO "phase7 : new updated content"
        // or
        //Format: UPDATE phase phase_07 TO "phase7 : new updated content"
        const updateSubgraphMatch = cmd.match(/^UPDATE\s+(?:SUBGRAPH|phase)\s+(?:["']?Phase\s*[_0]*(\d+):?\s*.*?["']?|([a-zA-Z0-9_-]+))\s+TO\s+["']([\s\(\S\)]*?)["']/i);
        if (updateSubgraphMatch) {
            console.group(`🚀 [MERMAID AGENT] Processing UPDATE SUBGRAPH Command`);
            const [fullMatch, phaseNum, manualId, newTitleLabel] = updateSubgraphMatch;
            // Normalize target identifier to standard zero-padded format: "phase_07"
            let targetSubgraphId;
            if (phaseNum) {
                targetSubgraphId = `phase_${phaseNum.padStart(2, '0')}`;
            } else {
                const cleanManualId = manualId.toLowerCase();
                // If they type "phase07" or "phase_7", parse out the digits and enforce "phase_07"
                if (cleanManualId.startsWith('phase')) {
                    const numPart = cleanManualId.replace(/[^0-9]/g, '');
                    targetSubgraphId = numPart ? `phase_${numPart.padStart(2, '0')}` : manualId;
                } else {
                    targetSubgraphId = manualId;
                }
            }
            // Matches 'subgraph phase_07 ["Old Title"]' or 'subgraph phase_07'
            const subgraphRegex = new RegExp(`(subgraph\\s+${targetSubgraphId}\\b)(?:\\s*\\[.*?\\])?`, 'i');
            if (subgraphRegex.test(currentCode)) {
                currentCode = currentCode.replace(subgraphRegex, `$1 ["${newTitleLabel}"]`);
                hasChanges = true;
                console.log(`🎉 [SUCCESS] Subgraph "${targetSubgraphId}" title updated successfully.`);
            } else {
                console.error(`❌ [FAILURE] Engine could not find subgraph "${targetSubgraphId}" in the code.`);
            }
            console.groupEnd();
            continue;
        }
        //Format: UPDATE CONNECTION FROM Step 1.2 TO Step 1.3 TO "Approved Credentials"
        const updateConnectionMatch = cmd.match(/^UPDATE\s+CONNECTION\s+FROM\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+TO\s+["'](.*?)["']/i);
        if (updateConnectionMatch) {
            console.group(`🔗 [MERMAID AGENT] Processing UPDATE CONNECTION Command`);
            const [_, sourceIdent, targetIdent, newEdgeLabel] = updateConnectionMatch;
            // 1. Resolve technical Node IDs from human label handles (e.g., "Step 1.1" -> "entrance_node1")
            const sourceNodeId = resolveNodeId(sourceIdent.trim());
            const targetNodeId = resolveNodeId(targetIdent.trim());
            if (!sourceNodeId || !targetNodeId) {
                console.error(`❌ [FAILURE] Engine could not resolve steps: "${sourceIdent}" or "${targetIdent}"`);
                console.groupEnd();
                continue;
            }
            // 2. Loop through rows line-by-line to find the connection route entry
            const lines = currentCode.split(/\r?\n/);
            let updated = false;
            const updatedLines = lines.map(line => {
                const trimmedLine = line.trim();
                // Target lines containing both matching node IDs in the correct flow direction
                // Handles multiple formats: "node1 --> node2" or "node1 -- text --> node2"
                if (trimmedLine.includes(sourceNodeId) && trimmedLine.includes(targetNodeId) && trimmedLine.indexOf(sourceNodeId) < trimmedLine.indexOf(targetNodeId)) {
                    // Extract the original leading indentation spaces
                    const indentation = line.match(/^[ \t]*/) || '';
                    // Standardise the connection layout syntax while injecting the fresh description text
                    updated = true;
                    return `${indentation}${sourceNodeId} -- "${newEdgeLabel}" --> ${targetNodeId}`;
                }
                return line;
            });
            if (updated) {
                currentCode = updatedLines.join('\n');
                hasChanges = true;
                console.log(`🎉 [SUCCESS] Updated transition text between "${sourceIdent}" and "${targetIdent}" to "${newEdgeLabel}".`);
            } else {
                console.warn(`⚠️ [WARNING] No matching active route line found connecting ${sourceNodeId} to ${targetNodeId}.`);
            }
            console.groupEnd();
            continue;
        }
        // ==========================================================================
        // 4. OPERATION: DELETE NODE (Surgically purges node elements & link arrays)
        // Format: DELETE NODE Step 1.3
        // ==========================================================================
        const deleteMatch = cmd.match(/^DELETE\s+NODE\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)/i);
        if (deleteMatch) {
            console.group(`🗑️ [MERMAID AGENT] Processing DELETE NODE Command`);
            const [_, targetIdent] = deleteMatch;
            const trimmedIdent = targetIdent.trim(); // e.g., "1.4" or "1.3"
            // 1. Fetch the corresponding machine node ID (e.g., "step1_4" or "exit_node1")
            const targetNodeId = resolveNodeId(trimmedIdent);
            // 2. Process line-by-line using a pure structural array filter
            const lines = currentCode.split(/\r?\n/);
            const cleanLines = lines.filter(line => {
                const trimmedLine = line.trim();
                // Rule A: Skip empty lines
                if (!trimmedLine) return true;
                // Rule B: Protect subgraphs and global structure keywords
                if (trimmedLine.startsWith('graph ') || trimmedLine.startsWith('subgraph ') || trimmedLine === 'end') {
                    return true;
                }
                // Rule C: Catch any broken structural artifacts (Zero Hardcoding)
                // If a line starts directly with punctuation like ':' or '"', it's a corrupted orphan line. Nuke it.
                if (/^[:"'\])}]/.test(trimmedLine)) {
                    return false;
                }
                // Rule D: If the line explicitly contains the step number string (e.g., "1.4" or "Step 1.4"), nuke it
                if (trimmedLine.includes(trimmedIdent)) {
                    return false;
                }
                // Rule E: If we have the resolved machine Node ID, drop its definitions and connections
                if (targetNodeId) {
                    // Drop definition lines starting with the ID
                    if (trimmedLine.startsWith(targetNodeId)) {
                        return false;
                    }
                    // Drop connections where this ID is a source or target
                    if (trimmedLine.includes(` ${targetNodeId} `) || trimmedLine.endsWith(` ${targetNodeId}`) || trimmedLine.startsWith(`${targetNodeId} `)) {
                        return false;
                    }
                }
                return true; // Keep all other healthy nodes and connections
            });
            // 3. Re-assemble the clean code array
            currentCode = cleanLines.join('\n');
            hasChanges = true;
            console.log(`🎉 [SUCCESS] Structurally cleaned all node tracking lines matching "${trimmedIdent}".`);
            console.groupEnd();
            continue;
        }
        // ==========================================================================
        // 5. OPERATION: ADD SHAPE NODE TO SUBGRAPH (Encapsulates layout string options)
        // Format variants: ADD NODE, ADD ROUND_NODE, ADD STADIUM_NODE, ADD CYLINDER_NODE,
        //                  ADD CIRCLE_NODE, ADD ASYMMETRIC_NODE, ADD HEXAGON_NODE,
        //                  ADD PARALLELOGRAM_NODE, ADD TRAPEZOID_NODE, ADD DIAMOND.
        // Format input example: ADD DIAMOND route_opt1 "Verify Zip Bounds" TO phase_02
        // ==========================================================================
        // Updated regex to capture commands missing the explicit ID, as well as standard ones
        //const addCustomShapeMatch = cmd.match(/^ADD\s+(NODE|ROUND_NODE|STADIUM_NODE|SUBROUTINE_NODE|CYLINDER_NODE|CIRCLE_NODE|ASYMMETRIC_NODE|HEXAGON_NODE|PARALLELOGRAM_NODE|TRAPEZOID_NODE|DIAMOND)\s+["'](Step\s+(\d+(?:\.\d+)*):?\s*.*?)["']\s+TO\s+(?:["']([a-zA-Z0-9_\s-]+)["']|([a-zA-Z0-9_-]+))/i);
        const addCustomShapeMatch = cmd.match(/^ADD\s+(NODE|ROUND_NODE|STADIUM_NODE|SUBROUTINE_NODE|CYLINDER_NODE|CIRCLE_NODE|ASYMMETRIC_NODE|HEXAGON_NODE|PARALLELOGRAM_NODE|TRAPEZOID_NODE|DIAMOND)\s+["'](Step\s+(\d+(?:\.\d+)*):?\s*.*?)["']\s+TO\s+(?:["']([a-zA-Z0-9_\s-]+)["']|([a-zA-Z0-9_-]+))/i);
        if (addCustomShapeMatch) {
            const [_, shapeType, fullLabel, stepNumbers, quotedPhaseId, unquotedPhaseId] = addCustomShapeMatch;
            const phaseId = quotedPhaseId || unquotedPhaseId;
            // Automatically generate the unique identifier (e.g., "Step 1.4" -> "step1_4")
            const cleanStepNumber = stepNumbers.replace(/\./g, '_');
            const newId = `step${cleanStepNumber}`;
            let openBrack = '["',
                closeBrack = '"]';
            const shapeUpper = shapeType.toUpperCase();
            if (shapeUpper === "ROUND_NODE") {
                openBrack = '("';
                closeBrack = '")';
            } else if (shapeUpper === "STADIUM_NODE") {
                openBrack = '(["';
                closeBrack = '"])';
            } else if (shapeUpper === "SUBROUTINE_NODE") {
                openBrack = '[["';
                closeBrack = '"]]';
            } else if (shapeUpper === "CYLINDER_NODE") {
                openBrack = '[("';
                closeBrack = '")]';
            } else if (shapeUpper === "CIRCLE_NODE") {
                openBrack = '(("';
                closeBrack = '"))';
            } else if (shapeUpper === "ASYMMETRIC_NODE") {
                openBrack = '>';
                closeBrack = '"]';
            } else if (shapeUpper === "HEXAGON_NODE") {
                openBrack = '{{\"';
                closeBrack = '"}}';
            } else if (shapeUpper === "PARALLELOGRAM_NODE") {
                openBrack = '[\\\"';
                closeBrack = '"/]';
            } else if (shapeUpper === "TRAPEZOID_NODE") {
                openBrack = '[/\"';
                closeBrack = '"\\]';
            } else if (shapeUpper === "DIAMOND") {
                openBrack = '{"';
                closeBrack = '"}';
            }
            // Outputs perfectly safe Mermaid syntax: step1_4["Step 1.4: Reset Account"]
            const nodeDeclaration = `        ${newId}${openBrack}${fullLabel}${closeBrack}`;
            // --- NEW FUZZY NORMALIZATION FIX APPLIED HERE ---
            const collapsedTarget = phaseId.trim().toLowerCase().replace(/[\s_]/g, ''); // "phase01"
            const lines = currentCode.split(/\r?\n/);
            let matchedLineIndex = -1;
            for (let i = 0; i < lines.length; i++) {
                const lowerLine = lines[i].toLowerCase().trim();
                if (lowerLine.startsWith('subgraph ')) {
                    const collapsedLine = lowerLine.replace(/[\s_]/g, ''); // "subgraphphase01"
                    if (collapsedLine.includes(collapsedTarget)) {
                        matchedLineIndex = i;
                        break;
                    }
                }
            }
            if (matchedLineIndex !== -1) {
                // Safely insert the new node line directly below the subgraph declaration row
                lines.splice(matchedLineIndex + 1, 0, nodeDeclaration);
                currentCode = lines.join('\n');
                hasChanges = true;
            }
            continue;
        }
        // ==========================================================================
        // 6. OPERATION: MANAGE SUBGRAPHS (Add & Remove Frame Bounds)
        // Format: ADD SUBGRAPH phase_05 "Phase 5 text description header"
        // Format: DELETE SUBGRAPH phase_05
        // ==========================================================================
        // const addSubgraphMatch = cmd.match(/^ADD\s+SUBGRAPH\s+([a-zA-Z0-9_-]+)\s+["']([\s\(\S\)]*?)["']/i);
        // if (addSubgraphMatch) {
        //     const [_, subgraphId, titleLabel] = addSubgraphMatch;
        //     const newSubgraphBlock = `\n    subgraph ${subgraphId} ["${titleLabel}"]\n    end\n`;
        //     currentCode = currentCode.trim() + newSubgraphBlock;
        //     hasChanges = true;
        //     continue;
        // }
        // 6. OPERATION: MANAGE SUBGRAPHS (Add & Remove Frame Bounds)
        // Format: ADD SUBGRAPH "Phase 5: text description header"
        // Updated regex to catch both formats: the auto-converting single-string format and the manual ID format
        //const addSubgraphMatch = cmd.match(/^ADD\s+SUBGRAPH\s+(?:["'](Phase\s+(\d+):?\s*(.*?))["']|([a-zA-Z0-9_-]+)\s+["']([\s\(\S\)]*?)["'])/i);
        const addSubgraphMatch = cmd.match(/^ADD\s+(?:SUBGRAPH|PHASE)\s+(?:["'](Phase\s+(\d+):?\s*(.*?))["']|([a-zA-Z0-9_-]+)\s+["']([\s\(\S\)]*?)["'])/i);
        if (addSubgraphMatch) {
            const [_, fullStringFormat, phaseNum, phaseLabelText, manualId, manualLabel] = addSubgraphMatch;
            let subgraphId, titleLabel;
            if (fullStringFormat) {
                // Auto-convert mode: "Phase 5: text description header"
                // Pad single digits with a leading zero (e.g., "5" becomes "05", "12" stays "12")
                const paddedNum = phaseNum.padStart(2, '0');
                subgraphId = `phase_${paddedNum}`;
                titleLabel = fullStringFormat; // Keeps the full string as the header title
            } else {
                // Manual mode backup: phase_05 "Phase 5..."
                subgraphId = manualId;
                titleLabel = manualLabel;
            }
            const newSubgraphBlock = `\n    subgraph ${subgraphId} ["${titleLabel}"]\n    end\n`;
            currentCode = currentCode.trim() + newSubgraphBlock;
            hasChanges = true;
            continue;
        }
        const deletePhaseMatch = cmd.match(/^DELETE\s+PHASE\s+([a-zA-Z0-9._\s-]+)/i);
        if (deletePhaseMatch) {
            console.group(`🗑️ [MERMAID AGENT] Processing DELETE PHASE Command`);
            const [_, targetIdent] = deletePhaseMatch;
            const trimmedIdent = targetIdent.trim().toLowerCase(); // e.g., "phase 1", "phase01", "phase_01"
            // Create normalized versions without spaces or underscores to guarantee a match
            const collapsedIdent = trimmedIdent.replace(/[\s_]/g, ''); // "phase1" or "phase01"
            const lines = currentCode.split(/\r?\n/);
            let inTargetSubgraph = false;
            let openSubgraphsCount = 0;
            const cleanLines = lines.filter(line => {
                const trimmedLine = line.trim();
                const lowerLine = trimmedLine.toLowerCase();
                // 1. Detect any subgraph declaration opening line
                if (lowerLine.startsWith('subgraph ')) {
                    openSubgraphsCount++;
                    // Collapse spaces and underscores on the line text to see if it matches the target phase identification
                    const collapsedLine = lowerLine.replace(/[\s_]/g, '');
                    if (lowerLine.includes(trimmedIdent) || collapsedLine.includes(collapsedIdent)) {
                        inTargetSubgraph = true;
                        // Delete ONLY the opening wrapper line
                        return false;
                    }
                }
                // 2. Detect the end of subgraphs
                if (trimmedLine === 'end') {
                    if (inTargetSubgraph && openSubgraphsCount === 1) {
                        // Found the matching end line for our target phase wrapper!
                        inTargetSubgraph = false;
                        openSubgraphsCount--;
                        // Delete ONLY the closing wrapper line
                        return false;
                    }
                    if (openSubgraphsCount > 0) {
                        openSubgraphsCount--;
                    }
                }
                // Return true to keep everything else (including nodes inside the phase) completely untouched
                return true;
            });
            currentCode = cleanLines.join('\n');
            hasChanges = true;
            console.log(`🎉 [SUCCESS] Dissolved phase wrapper layout for "${targetIdent}".`);
            console.groupEnd();
            continue;
        }
        // ==========================================================================
        // 7. OPERATION: INJECT COMPONENT CSS STYLING CLASSES
        // Format: STYLE NODE Step 1.2 FILL #111827, STROKE #3b82f6, STROKE-WIDTH 2px
        // ==========================================================================
        const styleMatch = cmd.match(/^STYLE\s+NODE\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+([\s\(\S\)]+)\$/i);
        if (styleMatch) {
            const [_, targetIdent, styleDirectives] = styleMatch;
            const targetNodeId = resolveNodeId(targetIdent);
            if (targetNodeId) {
                const styleDeclaration = `    style ${targetNodeId} ${styleDirectives.trim()}\n`;
                currentCode = currentCode.trim() + `\n${styleDeclaration}`;
                hasChanges = true;
            }
            continue;
        }
    } // Final exit bracket for loop parser thread execution mapping
    console.log(currentCode.trim())
    // --- PHASE 3: PARSE AND RE-RENDER ENGINE RECONCILIATION ---
    if (hasChanges) {
        await initializeFreshCanvas(currentCode.trim());
        statusDot.className = "h-2 w-2 rounded-full bg-green-500";
        statusText.textContent = "Deterministic layout modification tracking completed successfully.";
    } else {
        statusDot.className = "h-2 w-2 rounded-full bg-orange-500";
        statusText.textContent = "Command processed, but no structural nodes or labels matched.";
    }
}