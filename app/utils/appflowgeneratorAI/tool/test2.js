function executeMasterZeroReloadPipeline(rawInputText, currentCode) {
    try {
        const commands = rawInputText.split(/\r?\n/);
        console.log(`🎬 [MASTER OPTIMIZER] Slicing ${commands.length} rows.`);
        console.group(`🔍 [SCANNER ENGINE] Initializing Graph Directory Re-Indexing`);
        const serialMapping = {};
        const rawNodesFound = new Set();
        // --- LAYER 1: LABEL SCANNING ---
        const labelScanner = /([a-zA-Z0-9_-]+)\s*(?:["'{(\\[])\s*["']?\s*Step\s*([0-9]+(?:\.[0-9a-zA-Z]+)*)/gi;
        let match;
        let labelMatchCount = 0;
        console.log("📄 [SCANNING] Scanning source markdown for Step-to-NodeID bindings...");
        while ((match = labelScanner.exec(currentCode)) !== null) {
            const nodeId = match[1];
            const serialNum = match[2].trim();
            serialMapping[serialNum] = nodeId;
            rawNodesFound.add(nodeId);
            labelMatchCount++;
            console.log(`   🏷️ [MAP FOUND] Punctuation index "${serialNum}" ----> Technical Node ID "${nodeId}"`);
        }
        console.log(`✅ [SCANNING COMPLETE] Indexed ${labelMatchCount} semantic Step number handles.`);
        // --- LAYER 2: STRUCTURAL SCANNING ---
        const structuralScanner = /\b([a-zA-Z0-9_-]+)\b(?=\s*(?:-->|--|["'{(\\[]))/g;
        let structMatch;
        let structuralMatchCount = 0;
        console.log("📐 [SCANNING] Sweeping directional vector lanes for raw structural variables...");
        while ((structMatch = structuralScanner.exec(currentCode)) !== null) {
            const foundId = structMatch[1];
            if (!["graph", "TD", "LR", "subgraph", "end"].includes(foundId)) {
                rawNodesFound.add(foundId);
                structuralMatchCount++;
            }
        }
        console.log(`✅ [SCANNING COMPLETE] Discovered ${structuralMatchCount} functional connectivity components.`);
        console.log(`📦 [TOTAL TRACKED COMPONENTS] Unique nodes in active set context:`, Array.from(rawNodesFound));
        console.groupEnd(); // Closes the scanner setup block safely
        // --- LAYER 3: THE RESOLVER FUNCTION ---
        /**
         * Resolves human label keys or step numbering indices back into technical engine node handles.
         */
        function resolveId(inputStr) {
            if (!inputStr) {
                console.warn("🔍 [RESOLVER] Aborted execution: Passed an empty or undefined string lookup key.");
                return "";
            }
            const clean = inputStr.trim().replace(/["']/g, '');
            const key = clean.replace(/Step/i, '').trim();
            const resolved = serialMapping[key] || clean;
            console.log(`🔍 [RESOLVER ENGINE] Input handle: "${inputStr}" | Cleaned matching key: "${key}" ====> Resolved True NodeID: "${resolved}"`);
            return resolved;
        }
        // 💡 CRITICAL ALIAS: Securely maps the local scope function pointer to avoid ReferenceErrors inside loop sections
        const resolveIdHelper = resolveId;
        let workingCode = currentCode;
        let hasChanges = false;
        // ==========================================================================
        // SECTION 3: PHASE CORE PROCESSES (1, 2, 3)
        // ==========================================================================
        for (let cmd of commands) {
            cmd = cmd.trim();
            if (!cmd) continue;
            // --- PROCESS 1: ADD PHASE ---
            const matchAddPhase = cmd.match(/^ADD\s+(?:SUBGRAPH|PHASE)\s+(?:["'](Phase\s+(\d+):?\s*(.*?))["']|([a-zA-Z0-9_-]+)\s+["']([\s\(\S\)]*?)["'])/i);
            if (matchAddPhase) {
                const [_, fullStr, phaseNum, labelTxt, manualId, manualLabel] = matchAddPhase;
                let subId = fullStr ? `phase_${phaseNum.padStart(2, '0')}` : manualId;
                let title = fullStr ? fullStr : manualLabel;
                // DOM Mutation: Append the new phase visual element to the main chart element wrapper
                const svgCanvas = document.querySelector('.mermaid svg, #mermaid-svg') || document.querySelector('svg');
                if (svgCanvas) {
                    // 1. DYNAMIC MATH: Scan all existing phase boxes to find the lowest y-coordinate
                    let lowestY = 0;
                    const existingRects = svgCanvas.querySelectorAll('g.subgraph rect, g.cluster rect');
                    existingRects.forEach(rect => {
                        // Read the current position and height of each bounding box
                        const rectY = parseFloat(rect.getAttribute('y')) || 0;
                        const rectHeight = parseFloat(rect.getAttribute('height')) || 0;
                        const bottomEdge = rectY + rectHeight;
                        if (bottomEdge > lowestY) {
                            lowestY = bottomEdge;
                        }
                    });
                    // If no boxes are found, fall back to a standard baseline position
                    if (lowestY === 0) lowestY = 50;
                    const targetY = lowestY + 40;
                    const blockHeight = 180;
                    const totalRequiredDepth = targetY + blockHeight + 50; // Add an outer layout margin buffer
                    // 2. 💡 CRITICAL CHANGE: DYNAMICALLY EXPAND THE SVG VIEWBOX WINDOW LIMITS
                    // Read the current viewBox string layout array values (e.g., "0 0 3215 3334")
                    const currentViewBox = svgCanvas.getAttribute('viewBox');
                    if (currentViewBox) {
                        const parts = currentViewBox.split(/\s+/);
                        if (parts.length === 4) {
                            const currentVBHeight = parseFloat(parts[3]);
                            // If our new element spills past the current view frame edge, expand the window limits
                            if (totalRequiredDepth > currentVBHeight) {
                                // Update the viewBox height index value parameter
                                parts[3] = totalRequiredDepth.toString();
                                svgCanvas.setAttribute('viewBox', parts.join(' '));
                                // Synchronize the physical presentation height styling tags on the DOM tree container
                                svgCanvas.setAttribute('height', `${totalRequiredDepth}px`);
                                if (svgCanvas.style) {
                                    svgCanvas.style.height = `${totalRequiredDepth}px`;
                                }
                                console.log(`📏 [VIEWBOX EXPANDED] Stretched canvas boundary to accommodate size: ${totalRequiredDepth}px`);
                            }
                        }
                    }
                    const newPhaseG = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    newPhaseG.setAttribute("id", subId);
                    newPhaseG.setAttribute("class", "subgraph cluster");
                    //newPhaseG.innerHTML = `<rect x="10" y="10" width="200" height="150" fill="#2d2d2d" stroke="#474747"/><text x="20" y="30" fill="#fff" class="subgraphLabel">${title}</text>`;
                    newPhaseG.innerHTML = `
                <rect x="20" y="${targetY}" width="350" height="${blockHeight}" fill="#2d2d2d" stroke="#474747" stroke-width="2" rx="8"/>
                <text x="40" y="${targetY + 35}" fill="#ffffff" font-family="sans-serif" font-size="16px" font-weight="bold" class="subgraphLabel">${title}</text>
                `;
                    svgCanvas.appendChild(newPhaseG);
                }
                workingCode = workingCode.trim() + `\n    subgraph ${subId} ["${title}"]\n    end\n`;
                hasChanges = true;
                continue;
            } // This is just a sample script. Paste your real code (javascript or HTML) here.
            if ('this_is' == /an_example/) {
                of_beautifier();
            } else {
                //var a = b ? (c % d) : e[f];
            }
            // --- PROCESS 2: UPDATE PHASE TEXT ---
            const matchUpdatePhase = cmd.match(/^UPDATE\s+(?:SUBGRAPH|phase)\s+(?:["']?Phase\s*[_0]*(\d+):?\s*.*?["']?|([a-zA-Z0-9_-]+))\s+TO\s+["']([\s\(\S\)]*?)["']/i);
            if (matchUpdatePhase) {
                const [_, phaseNum, manualId, newTitle] = matchUpdatePhase;
                let subId = phaseNum ? `phase_${phaseNum.padStart(2, '0')}` : manualId;
                const allLabels = document.querySelectorAll('.subgraphLabel, .subgraph-title, text');
                allLabels.forEach(label => {
                    const cluster = label.closest('g.subgraph, g.cluster');
                    if (cluster && (cluster.id?.includes(subId) || cluster.className?.baseVal?.includes(subId))) {
                        label.textContent = newTitle;
                    }
                });
                const subRegex = new RegExp(`(subgraph\\s+${subId}\\b)(?:\\s*\\[.*?\\\])?`, 'i');
                if (subRegex.test(workingCode)) {
                    workingCode = workingCode.replace(subRegex, `$1 ["${newTitle}"]`);
                    hasChanges = true;
                }
                continue;
            }
            // --- PROCESS 3: DELETE PHASE ---
            const matchDeletePhase = cmd.match(/^DELETE\s+PHASE\s+([a-zA-Z0-9._\s-]+)/i);
            if (matchDeletePhase) {
                const [_, targetIdent] = matchDeletePhase;
                const trIdent = targetIdent.trim().toLowerCase();
                const collIdent = trIdent.replace(/[\s_]/g, '');
                const targetG = document.getElementById(collIdent) || document.querySelector(`[id*="${collIdent}"]`);
                if (targetG) targetG.remove(); // Drop structural frame from DOM instantly
                const lines = workingCode.split(/\r?\n/);
                let inTarget = false,
                    count = 0;
                const cleanLines = lines.filter(line => {
                    const trLine = line.trim().toLowerCase();
                    if (trLine.startsWith('subgraph ') && (trLine.includes(trIdent) || trLine.replace(/[\s_]/g, '').includes(collapsedIdent))) {
                        inTarget = true;
                        count++;
                        return false;
                    }
                    if (trLine === 'end' && inTarget && count === 1) {
                        inTarget = false;
                        count--;
                        return false;
                    }
                    if (trLine === 'end' && count > 0) count--;
                    return true;
                });
                workingCode = cleanLines.join('\n');
                hasChanges = true;
                continue;
            }
            // ==========================================================================
            // SECTION 4: NODE CORE PROCESSES (4, 5, 6)
            // ==========================================================================
            // --- PROCESS 4: ADD NODE (All 11 Geometric Shapes) ---
            // ==========================================================================
            // SECTION 4: NODE CORE PROCESSES (4 - REPAIRED ADD NODE)
            // ==========================================================================
            // ==========================================================================
            // SECTION 4: NODE CORE PROCESSES (4 - REPAIRED ADD NODE)
            // ==========================================================================
            // FIXED: Escaped the internal quotes inside the RegExp literal to prevent string parsing engine reference drops
            const matchAddNode = cmd.match(/^ADD\s+(NODE|ROUND_NODE|STADIUM_NODE|SUBROUTINE_NODE|CYLINDER_NODE|CIRCLE_NODE|ASYMMETRIC_NODE|HEXAGON_NODE|PARALLELOGRAM_NODE|TRAPEZOID_NODE|DIAMOND)\s+["'](Step\s+(\d+(?:\.\d+)*):?\s*.*?)["']\s+TO\s+(?:["']([a-zA-Z0-9_\s-]+)["']|([a-zA-Z0-9_-]+))/i);
            if (matchAddNode) {
                console.group(`🚀 [NODE OPTIMIZER] Processing ADD NODE Command`);
                const [_, type, fullLabel, stepNums, qPhase, unqPhase] = matchAddNode;
                const phaseId = qPhase || unqPhase;
                const cleanStep = stepNums.replace(/\./g, '_');
                const newId = `step${cleanStep}`;
                console.log(`📋 [PARSED DATA] Shape Type: "${type}" | Handle Label: "${fullLabel}" | Target Phase String: "${phaseId}"`);
                console.log(`🆔 [GENERATED ID] Unique structural variable index token: "${newId}"`);
                let op = '["',
                    cl = '"]';
                const shapeUpper = type.toUpperCase();
                if (shapeUpper === "ROUND_NODE") {
                    op = '("';
                    cl = '")';
                } else if (shapeUpper === "STADIUM_NODE") {
                    op = '(["';
                    cl = '"])';
                } else if (shapeUpper === "SUBROUTINE_NODE") {
                    op = '[["';
                    cl = '"]]';
                } else if (shapeUpper === "CYLINDER_NODE") {
                    op = '[("';
                    cl = '")]';
                } else if (shapeUpper === "CIRCLE_NODE") {
                    op = '(("';
                    cl = '"))';
                } else if (shapeUpper === "ASYMMETRIC_NODE") {
                    op = '>';
                    cl = '"]';
                } else if (shapeUpper === "HEXAGON_NODE") {
                    op = '{{\"';
                    cl = '"}}';
                } else if (shapeUpper === "PARALLELOGRAM_NODE") {
                    op = '[\\\"';
                    cl = '"/]';
                } else if (shapeUpper === "TRAPEZOID_NODE") {
                    op = '[/\"';
                    cl = '"\\]';
                } else if (shapeUpper === "DIAMOND") {
                    op = '{"';
                    cl = '"}';
                }
                // Resolves ID securely using your active functional routing dictionary reference
                console.log(`🔍 [RESOLVER] Sending "${phaseId}" to resolveIdHelper...`);
                const targetNodePhaseId = resolveIdHelper(phaseId);
                console.log(`🔍 [RESOLVER] Output true structural target ID: "${targetNodePhaseId}"`);
                const selectorStr = `[id*="${phaseId.replace(/[\s_]/g, '').toLowerCase()}"]`;
                const targetPhaseG = document.getElementById(targetNodePhaseId) || document.querySelector(`[id*="${targetNodePhaseId}"]`) || document.querySelector(selectorStr) || document.querySelector(`g.cluster[id*="${cleanPhaseKey.replace(/[\s_]/g, '')}"]`);
                if (targetPhaseG) {
                    console.log(`🎯 [DOM HIT] Successfully localized matching live SVG group element layer:`, targetPhaseG);
                    // Enforces standard W3C SVG specifications to make layout elements instantly visible on canvas
                    const nodeG = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    nodeG.setAttribute("id", newId);
                    nodeG.setAttribute("class", "node default flowchart-node custom-injected-node");
                    nodeG.style.opacity = "1";
                    nodeG.style.visibility = "visible";
                    nodeG.style.pointerEvents = "all";
                    nodeG.style.cursor = "pointer";
                    const customNodesCount = targetPhaseG.querySelectorAll('.custom-injected-node').length;
                    const verticalStaggerOffset = customNodesCount * 60;
                    const parentRect = targetPhaseG.querySelector('rect');
                    let injectX = 50;
                    let injectY = 50;
                    if (parentRect) {
                        injectX = (parseFloat(parentRect.getAttribute('x')) || 0) + 30;
                        injectY = (parseFloat(parentRect.getAttribute('y')) || 0) + 60 + verticalStaggerOffset;
                        const currentRectHeight = parseFloat(parentRect.getAttribute('height')) || 0;
                        if ((injectY + 60) > ((parseFloat(parentRect.getAttribute('y')) || 0) + currentRectHeight)) {
                            parentRect.setAttribute('height', currentRectHeight + 65);
                        }
                    }
                    // 2. SAFE INJECTION: Render using high-contrast themes matching your dark node layouts
                    // 💡 UPDATED: Set the styles explicitly to handle clean text contrast overrides
                    let internimStyle = `
                    fill: #ffffff !important;
                    color: #ffffff !important; 
                    font-family: sans-serif; 
                    font-size: 14px; 
                    font-weight: normal;
                    text-align: center;
                    box-sizing: border-box;
                    white-space: nowrap;
                    opacity: 1 !important;
                    visibility: visible !important;
                `.trim();
                    // 💡 UPDATED innerHTML: Forces the rect to a solid black background using forced vector fill attributes
                    nodeG.innerHTML = `
                    <rect x="${injectX}" y="${injectY}" width="180" height="45" rx="5" 
                            fill="#000000" 
                            stroke="#555566" 
                            stroke-width="2" 
                            style="fill: #000000 !important; background-color: #000000 !important; opacity: 1 !important; visibility: visible !important;"></rect>
                    <text x="${injectX + 15}" y="${injectY + 26}" 
                            style="${internimStyle}" 
                            class="nodeLabel" 
                            fill="#ffffff" 
                            font-family="sans-serif" 
                            font-size="12px" 
                            font-weight="bold">${fullLabel}</text>
                `;
                    targetPhaseG.appendChild(nodeG);
                    console.log(`🎉 [SUCCESS] Instantly injected visual block element "${newId}" into live SVG layout view.`);
                    if (targetPhaseG.style) {
                        const originalDisplay = targetPhaseG.style.display;
                        targetPhaseG.style.display = 'none';
                        targetPhaseG.offsetHeight; // Triggers immediate document element layout recalculation
                        targetPhaseG.style.display = originalDisplay || '';
                    }
                } else {
                    console.warn(`❌ [DOM MISS] Failed to locate visual element container in DOM using ID: "${targetNodePhaseId}" or Selector: "${selectorStr}"`);
                }
                console.log("💾 [SYNC SEQUENCE] Re-indexing raw markdown lines to append code model background arrays...");
                const lines = workingCode.split(/\r?\n/);
                const collTarget = phaseId.trim().toLowerCase().replace(/[\s_]/g, '');
                let codeInjected = false;
                for (let i = 0; i < lines.length; i++) {
                    const lowerLine = lines[i].toLowerCase().trim();
                    if (lowerLine.startsWith('subgraph ') && lowerLine.replace(/[\s_]/g, '').includes(collTarget)) {
                        const codeString = `        ${newId}${op}${fullLabel}${cl}`;
                        lines.splice(i + 1, 0, codeString);
                        console.log(`📝 [SYNC SUCCESS] Appended raw code row on line index ${i + 1}: -> "${codeString}"`);
                        codeInjected = true;
                        break;
                    }
                }
                if (!codeInjected) {
                    console.error(`❌ [SYNC FAILURE] Could not find a matching "subgraph" line marker inside the source file for target: "${collTarget}"`);
                }
                workingCode = lines.join('\n');
                hasChanges = true;
                console.groupEnd();
                continue;
            }
            // --- PROCESS 5: UPDATE NODE TEXT ---
            const matchUpdateNode = cmd.match(/^UPDATE\s+NODE\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+["'](.*?)["']/i);
            if (matchUpdateNode) {
                console.group(`📝 [NODE OPTIMIZER] Processing UPDATE NODE Command`);
                const [_, targetIdent, newFullLabel] = matchUpdateNode;
                console.log(`📋 [PARSED DATA] Target Input Handle: "${targetIdent}" | New Target Text: "${newFullLabel}"`);
                // Resolve the human tracking handle back into the machine variable name
                console.log(`🔍 [RESOLVER] Sending "${targetIdent}" to resolveId...`);
                const targetNodeId = resolveId(targetIdent);
                console.log(`🔍 [RESOLVER] Output true structural target ID: "${targetNodeId}"`);
                // --- STEP 1: LIVE CANVASES VISUAL DOM UPDATES ---
                const strictNodeSelector = `g.node[id*="${targetNodeId}"], .node[id^="${targetNodeId}"], [id*="flowchart-${targetNodeId}"].node`;
                const nodeGroup = document.querySelector(strictNodeSelector) || document.getElementById(targetNodeId);
                if (nodeGroup) {
                    console.log(`🎯 [DOM HIT] Successfully localized matching live node container group:`, nodeGroup);
                    const labelTarget = nodeGroup.querySelector('.nodeLabel, p, span, text') || nodeGroup;
                    console.log(`🏷️ [DOM UPDATE] Swapping visible text characters: "${labelTarget.textContent.trim()}" ====> "${newFullLabel}"`);
                    labelTarget.textContent = newFullLabel;
                    // Ensure nesting span labels mirror the exact text updates cleanly
                    const innerSubElements = nodeGroup.querySelectorAll('span, p');
                    if (innerSubElements.length > 0) {
                        console.log(`🔗 [DOM CHILD UPDATE] Synchronizing text layers across ${innerSubElements.length} nested child components.`);
                        innerSubElements.forEach(el => el.textContent = newFullLabel);
                    }
                } else {
                    console.warn(`❌ [DOM MISS] Failed to locate visual element container in DOM using ID: "${targetNodeId}" or Selector: "${selectorStr}"`);
                }
                // --- STEP 2: CODE DATA MODEL SYNC ---
                const regexNode = new RegExp(`\\b(${targetNodeId})\\s*([\\[\\(\\{"']+.*?[\\s\\S]*?[\\]\\)\\}'"]+)`, 'g');
                if (regexNode.test(workingCode)) {
                    console.log(`💾 [SYNC SEQUENCE] Target identifier matched inside text data model configuration arrays.`);
                    workingCode = workingCode.replace(regexNode, (m, id, wrappers) => {
                        let op = '[',
                            cl = ']';
                        if (wrappers.includes('((')) {
                            op = '((';
                            cl = '))';
                        } else if (wrappers.includes('([')) {
                            op = '([';
                            cl = '])';
                        } else if (wrappers.includes('[[')) {
                            op = '[[';
                            cl = ']]';
                        } else if (wrappers.includes('[(')) {
                            op = '[(';
                            cl = ')]';
                        } else if (wrappers.includes('>')) {
                            op = '>';
                            cl = ']';
                        } else if (wrappers.includes('{{')) {
                            op = '{{';
                            cl = '}}';
                        } else if (wrappers.includes('[\\')) {
                            op = '[\\';
                            cl = '/]';
                        } else if (wrappers.includes('[/')) {
                            op = '[/';
                            cl = '\\]';
                        } else if (wrappers.includes('{')) {
                            op = '{';
                            cl = '}';
                        }
                        const generatedModelString = `${id}${op}"${newFullLabel}"${cl}`;
                        console.log(`📝 [SYNC SUCCESS] Replaced markdown layout strings with wrappers: "${wrappers}" ====> -> "${generatedModelString}"`);
                        return generatedModelString;
                    });
                    hasChanges = true;
                } else {
                    console.error(`❌ [SYNC FAILURE] Could not find the declaration row for node variable key "${targetNodeId}" inside currentCode source metadata strings.`);
                }
                console.groupEnd();
                continue;
            }
            // --- PROCESS 6: DELETE NODE & LINKS ---
            const matchDeleteNode = cmd.match(/^DELETE\s+NODE\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)/i);
            if (matchDeleteNode) {
                const [_, targetIdent] = matchDeleteNode;
                const trIdent = targetIdent.trim();
                const targetNodeId = resolveId(trIdent);
                const nodeG = document.getElementById(targetNodeId) || document.querySelector(`[id*="${targetNodeId}"]`);
                if (nodeG) nodeG.remove();
                const lines = workingCode.split(/\r?\n/);
                const cleanLines = lines.filter(line => {
                    const trLine = line.trim();
                    if (!trLine || trLine.startsWith('graph ') || trLine.startsWith('subgraph ') || trLine === 'end') return true;
                    if (/^[:"'\])}]/.test(trLine) && trLine.includes(trIdent)) return false;
                    if (trLine.includes(trIdent)) return false;
                    if (targetNodeId) {
                        if (trLine.startsWith(targetNodeId)) return false;
                        if (trLine.includes(` ${targetNodeId} `) || trLine.endsWith(` ${targetNodeId}`) || trLine.startsWith(`${targetNodeId} `)) return false;
                    }
                    return true;
                });
                workingCode = cleanLines.join('\n');
                hasChanges = true;
                continue;
            }
            // ==========================================================================
            // SECTION 5: ROUTING CORE PROCESSES (7 - CONNECT, DISCONNECT, UPDATE)
            // ==========================================================================
            // --- PROCESS 7A: UPDATE CONNECTION TEXT ---
            const matchUpdateConn = cmd.match(/^UPDATE\s+CONNECTION\s+FROM\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+["'](.*?)["']/i);
            if (matchUpdateConn) {
                const [_, srcIdent, tgtIdent, newLabel] = matchUpdateConn;
                const srcNodeId = resolveId(srcIdent);
                const tgtNodeId = resolveId(tgtIdent);
                let oldLabel = "";
                const lines = workingCode.split(/\r?\n/);
                for (let line of lines) {
                    if (line.includes(srcNodeId) && line.includes(tgtNodeId)) {
                        const ext = line.match(/--\s*["'](.*?)["']/);
                        if (ext) oldLabel = ext[1].trim();
                    }
                }
                const textElements = document.querySelectorAll('.edgeLabels text, g.edgeLabel tspan, .edgeLabel span, g.edgeLabel text, .edgeLabel, g.edgeLabel p');
                for (const textEl of textElements) {
                    const containerGroup = textEl.closest('g.edgeLabel') || textEl;
                    const baseId = containerGroup.id || '';
                    const baseClass = containerGroup.className?.baseVal || '';
                    const currentText = textEl.textContent ? textEl.textContent.trim() : "";
                    const hasPath = (baseId.includes(srcNodeId) && baseId.includes(tgtNodeId)) || (baseClass.includes(srcNodeId) && baseClass.includes(tgtNodeId));
                    const hasText = oldLabel !== "" && currentText.toLowerCase() === oldLabel.toLowerCase();
                    if ((hasPath || hasText) && !textEl.closest('.node')) {
                        const innerTarget = textEl.querySelector('p, span') || textEl;
                        innerTarget.textContent = newLabel;
                        const foreignObj = containerGroup.querySelector('foreignObject');
                        const labelBkgDiv = containerGroup.querySelector('div.labelBkg');
                        if (foreignObj) {
                            const maxWrapWidth = 150;
                            foreignObj.setAttribute('width', maxWrapWidth);
                            foreignObj.setAttribute('height', 60);
                            if (labelBkgDiv) {
                                labelBkgDiv.style.width = `${maxWrapWidth}px`;
                                labelBkgDiv.style.height = "auto";
                                labelBkgDiv.style.whiteSpace = "normal";
                                labelBkgDiv.style.wordBreak = "break-word";
                                labelBkgDiv.style.display = "block";
                                labelBkgDiv.style.backgroundColor = "#474747";
                                labelBkgDiv.style.background = "#474747";
                            }
                            containerGroup.querySelectorAll('p, span').forEach(el => {
                                el.style.whiteSpace = "normal";
                                el.style.backgroundColor = "#474747";
                                el.style.background = "#474747";
                            });
                            const currentTransform = containerGroup.getAttribute('transform') || '';
                            const translateMatch = currentTransform.match(/translate\(([^,\s)]+)(?:[,\s]+)([^)]+)\)/);
                            if (translateMatch) {
                                const originalX = parseFloat(translateMatch[1]);
                                const originalY = parseFloat(translateMatch[2]);
                                const currentWidth = parseFloat(foreignObj.getAttribute('width')) || 0;
                                containerGroup.setAttribute('transform', `translate(${originalX - ((maxWrapWidth - currentWidth) / 2)}, ${originalY})`);
                            }
                        }
                        break;
                    }
                }
                const updatedLines = lines.map(line => {
                    const trLine = line.trim();
                    if (trLine.includes(srcNodeId) && trLine.includes(tgtNodeId) && trLine.indexOf(srcNodeId) < trLine.indexOf(tgtNodeId)) {
                        return `${line.match(/^[ \t]*/)}${srcNodeId} -- "${newLabel}" --> ${tgtNodeId}`;
                    }
                    return line;
                });
                workingCode = updatedLines.join('\n');
                hasChanges = true;
                continue;
            }
            // --- PROCESS 7B: CONNECT ROAD LANE ---
            const matchConnect = cmd.match(/^(CONNECT_THICK|CONNECT_DOTTED|CONNECT_MUTUAL|CONNECT_UNARROWED|CONNECT_INVISIBLE|CONNECT)\b\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._-]+)(?:\s+WITH\s+["']([\s\(\S\)]*?)["'])?/i);
            console.groupCollapsed(`🔍 Connection Parser: Analyzing command -> "${cmd.trim()}"`);
            console.log("Match Status:", matchConnect ? "✅ MATCHED" : "❌ FAILED");
            if (matchConnect) {
                const [_, type, targetA, targetB, linkLabel] = matchConnect;
                const nodeA = resolveId(targetA);
                const nodeB = resolveId(targetB);
                console.log("Extracted Data:", {
                    rawType: type,
                    targetA: targetA,
                    resolvedNodeA: nodeA,
                    targetB: targetB,
                    resolvedNodeB: nodeB,
                    linkLabel: linkLabel || "(none)"
                });
                // 1. Map each connection type case to its respective Mermaid syntax operator
                let arrowSymbol = "-->";
                const normalizedType = type.toUpperCase();
                switch (normalizedType) {
                    case "CONNECT_THICK":
                        arrowSymbol = "==>";
                        break;
                    case "CONNECT_DOTTED":
                        arrowSymbol = "-.->";
                        break;
                    case "CONNECT_MUTUAL":
                        arrowSymbol = "<-->";
                        break;
                    case "CONNECT_UNARROWED":
                        arrowSymbol = "---";
                        break;
                    case "CONNECT_INVISIBLE":
                        arrowSymbol = "~~~";
                        break;
                    case "CONNECT":
                    default:
                        arrowSymbol = "-->";
                        break;
                }
                // 2. Generate the syntax string (handles line styling and inline text labels)
                let arrowStr = "";
                if (linkLabel) {
                    if (normalizedType === "CONNECT_UNARROWED") {
                        arrowStr = `    ${nodeA} ---|"${linkLabel}"| ${nodeB}\n`;
                    } else if (normalizedType === "CONNECT_DOTTED") {
                        arrowStr = `    ${nodeA} -. "${linkLabel}" .-> ${nodeB}\n`;
                    } else {
                        arrowStr = `    ${nodeA} -- "${linkLabel}" ${arrowSymbol} ${nodeB}\n`;
                    }
                } else {
                    arrowStr = `    ${nodeA} ${arrowSymbol} ${nodeB}\n`;
                }
                console.log(`📊 Generated Mermaid Syntax: ${arrowStr.trim()}`);
                workingCode = workingCode.trim() + `\n${arrowStr}`;
                hasChanges = true;
                // =========================================================================
                // 🌐 PLACE THE MODULAR LAYER INJECTION HERE (REPLACING THE OLD REDRAW CODE)
                // =========================================================================
                const svgCanvas = document.querySelector('.mermaid svg') || document.querySelector('svg');
                if (svgCanvas) {
                    const domA = document.querySelector(`g.node[id*="${nodeA}"]`) || document.getElementById(nodeA) || document.querySelector(`[id*="${nodeA}"]`);
                    const domB = document.querySelector(`g.node[id*="${nodeB}"]`) || document.getElementById(nodeB) || document.querySelector(`[id*="${nodeB}"]`);
                    if (domA && domB && domA !== domB) {
                        const targetLayer = svgCanvas.querySelector('g.edgePaths') || svgCanvas.querySelector('g.output') || svgCanvas;
                        const getSvgLayerCoords = (el, container) => {
                            const bbox = el.getBBox();
                            let transformX = 0;
                            let transformY = 0;
                            const transformAttr = el.getAttribute('transform') || '';
                            const match = transformAttr.match(/translate\(([^,)]+)[, ]([^)]+)\)/);
                            if (match) {
                                transformX = parseFloat(match[1]);
                                transformY = parseFloat(match[2]);
                            } else {
                                const cBox = container.getBoundingClientRect();
                                const eBox = el.getBoundingClientRect();
                                return {
                                    width: bbox.width,
                                    height: bbox.height,
                                    centerX: (eBox.left + eBox.width / 2) - cBox.left,
                                    centerY: (eBox.top + eBox.height / 2) - cBox.top,
                                    top: eBox.top - cBox.top,
                                    bottom: eBox.bottom - cBox.top
                                };
                            }
                            return {
                                width: bbox.width,
                                height: bbox.height,
                                centerX: transformX,
                                centerY: transformY,
                                top: transformY - (bbox.height / 2),
                                bottom: transformY + (bbox.height / 2)
                            };
                        };
                        const locA = getSvgLayerCoords(domA, targetLayer);
                        const locB = getSvgLayerCoords(domB, targetLayer);
                        let startX = locA.centerX;
                        let startY = locA.top;
                        let endX = locB.centerX;
                        let endY = locB.bottom;
                        if (locA.centerY < locB.centerY) {
                            startY = locA.bottom;
                            endY = locB.top;
                        }
                        const diffX = endX - startX;
                        const diffY = endY - startY;
                        const controlY1 = startY + (diffY * 0.25);
                        const controlY2 = endY - (diffY * 0.25);
                        let pathData = `M ${startX},${startY} C ${startX},${controlY1} ${endX},${controlY2} ${endX},${endY}`;
                        if (locA.centerY > locB.centerY && Math.abs(diffX) < 40) {
                            const sweepOffset = startX - (locA.width / 2) - 50;
                            pathData = `M ${startX},${startY} C ${sweepOffset},${startY} ${sweepOffset},${endY} ${endX},${endY}`;
                        }
                        // 💡 FIX 1: Extract the unique chart dynamic hash directly from nearby paths
                        const samplePath = targetLayer.querySelector('path');
                        let chartHash = 'mermaid-generated';
                        if (samplePath && samplePath.id) {
                            // If ID is "mermaid-1791832736363-L_node_0", isolates "mermaid-1791832736363"
                            const parts = samplePath.id.split('-');
                            if (parts.length > 1) {
                                chartHash = `${parts[0]}-${parts[1]}`;
                            }
                        }
                        // 💡 FIX 2: Dynamically parse the accurate system arrowhead marker mapping ID
                        const defMarker = svgCanvas.querySelector('defs marker[id*="point"]') || svgCanvas.querySelector('defs marker[id*="arrowhead"]');
                        const markerId = defMarker ? defMarker.getAttribute('id') : `${chartHash}_flowchart-v2-pointEnd`;
                        const edgeG = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        edgeG.setAttribute("class", "edgePath ls-" + nodeA + " le-" + nodeB);
                        edgeG.setAttribute("id", "dynamic-edge-" + nodeA + "-" + nodeB);
                        const isDotted = normalizedType === 'CONNECT_DOTTED';
                        const isThick = normalizedType === 'CONNECT_THICK';
                        // 💡 FIX 3: Injecting completed attributes dynamically
                        let innerHTMLStr = `
                <path d="${pathData}" 
                      id="${chartHash}-L_${nodeA}_${nodeB}_dynamic" 
                      class="edge-thickness-normal edge-pattern-solid flowchart-link" 
                      stroke="#474747" 
                      stroke-width="${isThick ? '3.5' : '2'}" 
                      fill="none" 
                      style="${isDotted ? 'stroke-dasharray: 5,5;' : ''}"
                      data-edge="true"
                      data-et="edge"
                      data-look="classic"
                      marker-end="url(#${markerId})"/>
            `;
                        // 1. Calculate the standard vertical center point between your nodes
                        const dynamicLabelY = (startY + endY) / 2;
                        // 2. Identify the apex horizontal curve sweep boundary dynamically
                        let dynamicLabelX = (startX + endX) / 2;
                        // If an upward connection loop is active, calculate its right-side sweeping peak position
                        if (locA.centerY > locB.centerY && Math.abs(diffX) < 40) {
                            // Locate the exact outermost curve vertex line calculated in your pathData string
                            const sweepApexX = startX - (locA.width / 2) - 50;
                            // Position the text label right on top of that loop curve path apex point
                            dynamicLabelX = sweepApexX;
                        }
                        if (linkLabel) {
                            const estimatedTextWidth = linkLabel.length * 7 + 16;
                            const textHalfWidth = estimatedTextWidth / 2;
                            innerHTMLStr += `
        <g class="edgeLabel" transform="translate(${dynamicLabelX.toFixed(3)}, ${dynamicLabelY.toFixed(3)})">
            <g class="label" data-id="L_${nodeA}_${nodeB}_dynamic" transform="translate(-66.93, -12)">
                <!-- ✅ FIXED: Corrected the strict standard W3C XML Namespace validation URL -->
                <foreignObject width="${estimatedTextWidth}" height="24">
                    <div xmlns="http://www.w3.org/2000/svg" class="labelBkg" style="display: table-cell; white-space: nowrap; line-height: 1.5; max-width: 200px; text-align: center; background-color: #333333; padding: 2px 6px; border-radius: 3px;">
                        <span class="edgeLabel">
                            <p style="margin: 0; padding: 0; font-family: 'Trebuchet MS', verdana, arial, sans-serif; font-size: 13px; color: #ffffff;">${linkLabel}</p>
                        </span>
                    </div>
                </foreignObject>
            </g>
        </g>
    `;
                        }
                        //edgeG.innerHTML = htmlPayload;
                        edgeG.innerHTML = innerHTMLStr;
                        targetLayer.appendChild(edgeG);
                        console.log(`🌐 Native Dynamic Path Generated: d="${pathData}" linked to marker: #${markerId}`);
                    } else {
                        console.warn(`⚠️ Modular Link Blocked: Element identification check failed to locate distinct target nodes.`);
                    }
                }
            }
            // --- PROCESS 7C: DISCONNECT ROAD LANE ---
            const matchDisconnect = cmd.match(/^DISCONNECT\s+(?:Step\s+)?([a-zA-Z0-9._-]+)\s+FROM\s+(?:Step\s+)?([a-zA-Z0-9._-]+)/i);
            if (matchDisconnect) {
                const [_, targetA, targetB] = matchDisconnect;
                const nodeA = resolveId(targetA);
                const nodeB = resolveId(targetB);
                document.querySelectorAll(`.ls-${nodeA}.le-${nodeB}, .id-${nodeA}-${nodeB}`).forEach(el => el.remove());
                const lines = workingCode.split(/\r?\n/);
                workingCode = lines.filter(line => !(line.includes(nodeA) && line.includes(nodeB))).join('\n');
                hasChanges = true;
                continue;
            }
        }
        if (hasChanges) {
            codeEditor.value = workingCode;
            const dot = document.getElementById('statusDot');
            const txt = document.getElementById('statusText');
            if (dot) dot.className = "h-2 w-2 rounded-full bg-green-500";
            if (txt) txt.textContent = "⚡ Zero-Lag DOM label patch updated successfully.";
            return true;
        }
        return false;
    } catch (e) {
        console.error("💥 [CRITICAL CRASH] Exception inside master pipeline:", e);
        return false;
    }
}