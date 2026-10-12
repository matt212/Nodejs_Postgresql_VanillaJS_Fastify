function executeOptimizedConnectionUpdate(rawInputText, currentCode) {
    try {
        if (!rawInputText || !currentCode) {
            console.warn("⚠️ [OPTIMIZER] Missing raw input text or current base diagram code.");
            return false;
        }
        const commands = rawInputText.split(/\r?\n/);
        console.log(`🎬 [OPTIMIZER] Starting optimization sweep for ${commands.length} rows.`);
        // --- STEP 1: VERIFY INTENT IS EXCLUSIVELY TEXT LINK UPDATES ---
        let validCount = 0;
        for (let c of commands) {
            const tr = c.trim();
            if (tr === "") continue;
            const isValid = /^UPDATE\s+CONNECTION\s+FROM\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+["'](.*?)["']/i.test(tr);
            if (isValid) {
                validCount++;
            } else {
                console.log(`❌ [OPTIMIZER] Aborting: Command row is not an exclusive text connection edit -> "${tr}"`);
                return false;
            }
        }
        if (validCount === 0) return false;
        console.log("🔒 [OPTIMIZER] Intent confirmed: Pure connection label modifications detected.");
        // --- STEP 2: SCAN GRAPH FOR NODE ID / LABEL MAP DIRECTORIES ---
        const serialMapping = {};
        const rawNodesFound = new Set();
        const labelScanner = /([a-zA-Z0-9_-]+)\s*(?:["'{(\\[])\s*["']?\s*Step\s*([0-9]+(?:\.[0-9a-zA-Z]+)*)/gi;
        let match;
        while ((match = labelScanner.exec(currentCode)) !== null) {
            serialMapping[match[2].trim()] = match[1];
            rawNodesFound.add(match[1]);
        }
        const structuralScanner = /\b([a-zA-Z0-9_-]+)\b(?=\s*(?:-->|--|["'{(\\[]))/g;
        let structMatch;
        while ((structMatch = structuralScanner.exec(currentCode)) !== null) {
            if (!["graph", "TD", "LR", "subgraph", "end"].includes(structMatch[1])) {
                rawNodesFound.add(structMatch[1]);
            }
        }

        function resolveId(inputStr) {
            if (!inputStr) return "";
            const clean = inputStr.trim().replace(/["']/g, '');
            const key = clean.replace(/Step/i, '').trim();
            const resolved = serialMapping[key] || clean;
            console.log(`🔍 [RESOLVER] Mapping text track handle: "${inputStr}" ----> "${resolved}"`);
            return resolved;
        }
        // --- STEP 3: PERFORM BATCH VISUAL DOM UPDATES ---
        // --- STEP 3: PERFORM BATCH VISUAL DOM UPDATES ---
        let allDomPatched = true;
        const textElements = document.querySelectorAll('.edgeLabels text, g.edgeLabel tspan, .edgeLabel span, g.edgeLabel text, .edgeLabel');
        console.log(`🖥️ [DOM SEARCH] Discovered ${textElements.length} rendered transition elements on the active canvas viewport.`);
        for (let cmd of commands) {
            cmd = cmd.trim();
            if (!cmd) continue;
            const matchUpdate = cmd.match(/^UPDATE\s+CONNECTION\s+FROM\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+["'](.*?)["']/i);
            if (!matchUpdate) {
                allDomPatched = false;
                break;
            }
            const [_, srcIdent, tgtIdent, newLabel] = matchUpdate;
            const srcNodeId = resolveId(srcIdent);
            const tgtNodeId = resolveId(tgtIdent);
            // Fetch what the old label string was inside your current code structure context
            let oldLabel = "";
            const lookupLines = currentCode.split(/\r?\n/);
            for (let line of lookupLines) {
                if (line.includes(srcNodeId) && line.includes(tgtNodeId)) {
                    const labelExtract = line.match(/--\s*["'](.*?)["']/);
                    if (labelExtract) oldLabel = labelExtract[1].trim();
                }
            }
            console.log(`🏷️ [MATCHING SEQUENCE] Attempting to swap text values. Target old text: "${oldLabel}" -> New: "${newLabel}"`);
            let singleLinePatched = false;
            for (const textEl of textElements) {
                const currentText = textEl.textContent ? textEl.textContent.trim() : "";
                const containerGroup = textEl.closest('g.edgeLabel') || textEl;
                const html = containerGroup.innerHTML || '';
                const baseId = containerGroup.id || '';
                const baseClass = containerGroup.className?.baseVal || '';
                // FIX: Verify BOTH source and target IDs match this specific visual connector path link
                // Handles multiple formats: id-sourceId-targetId or ls-sourceId le-targetId
                const hasPathSelectors = (baseId.includes(srcNodeId) && baseId.includes(tgtNodeId)) || (baseClass.includes(srcNodeId) && baseClass.includes(tgtNodeId));
                // Secondary fallback match checking explicit source index orders or visual text value similarity
                const hasTextContentMatch = oldLabel !== "" && currentText.toLowerCase() === oldLabel.toLowerCase();
                if ((hasPathSelectors || hasTextContentMatch) && !textEl.closest('.node')) {
                    console.log(`🎯 [DOM HIT] Successfully localized target element! Current label text: "${currentText}"`);
                    const innerTarget = textEl.querySelector('p, span') || textEl;
                    innerTarget.textContent = newLabel;
                    // 2. Precise Width Calculation: Target and expand the foreignObject element bounds
                    const foreignObj = containerGroup.querySelector('foreignObject');
                    const labelBkgDiv = containerGroup.querySelector('div.labelBkg');
                    if (foreignObj) {
                        // UPDATED: Fixed wrap boundary size (150px) instead of growing infinitely
                        const estimatedNewWidth = 150;
                        const currentWidth = parseFloat(foreignObj.getAttribute('width')) || 0;
                        // Expand the viewport container boundary dimensions
                        foreignObj.setAttribute('width', estimatedNewWidth);
                        // Stretch the container viewport height so the wrapped multi-line text has vertical room
                        foreignObj.setAttribute('height', 60);
                        // Expand the background div block container dimensions if it exists
                        if (labelBkgDiv) {
                            labelBkgDiv.style.width = `${estimatedNewWidth}px`;
                            labelBkgDiv.style.height = "auto"; // Allows background to expand vertically
                            // 💡 CRITICAL CHANGE: Kills Mermaid's nowrap layout rule and forces normal browser wrapping
                            labelBkgDiv.style.whiteSpace = "normal";
                            labelBkgDiv.style.wordBreak = "break-word";
                            labelBkgDiv.style.display = "block";
                            // 💡 FIX BACKGROUND COLOR MATCH: Force it to explicitly use the exact lighter gray theme color
                            labelBkgDiv.style.backgroundColor = "#474747";
                            labelBkgDiv.style.background = "#474747";
                        }
                        // Force the inner paragraph tag to center up and wrap cleanly
                        const innerP = containerGroup.querySelector('p');
                        if (innerP) {
                            innerP.style.whiteSpace = "normal";
                            innerP.style.textAlign = "center";
                            innerP.style.margin = "0";
                            // Ensure inner elements match uniformly
                            innerP.style.backgroundColor = "#474747";
                            innerP.style.background = "#474747";
                        }
                        // --- FIX BACKGROUND COLOR SPLIT CONTRAST LAYERS ---
                        // Mermaid sometimes injects individual background tokens on internal span frames
                        const nestedSpans = containerGroup.querySelectorAll('span');
                        nestedSpans.forEach(span => {
                            span.style.backgroundColor = "#474747";
                            span.style.background = "#474747";
                        });
                        // Re-center the transform matrix position horizontally on the flow line coordinates
                        const currentTransform = containerGroup.getAttribute('transform') || '';
                        const translateMatch = currentTransform.match(/translate\(([^,\s)]+)(?:[,\s]+)([^)]+)\)/);
                        if (translateMatch) {
                            const originalX = parseFloat(translateMatch[1]);
                            const originalY = parseFloat(translateMatch[2]);
                            const widthDiff = estimatedNewWidth - currentWidth;
                            containerGroup.setAttribute('transform', `translate(${originalX - (widthDiff / 2)}, ${originalY})`);
                        }
                    }
                    singleLinePatched = true;
                    break;
                }
            }
            if (!singleLinePatched) {
                console.warn(`❌ [DOM MISS] Quick-patch failed to find matching live layout blocks for command -> "${cmd}"`);
                allDomPatched = false;
                break;
            }
        }
        if (!allDomPatched) {
            console.log("🔄 [FALLBACK TRIGGER] Aborting silent injection loop. Forcing complete architecture rebuild layout canvas...");
            return false;
        }
        // --- STEP 4: SYNCHRONIZE TEXT DATA MODEL IN BACKGROUND ---
        console.log("💾 [SYNC SEQUENCE] Visual elements altered successfully. Writing configurations quietly to editor data arrays...");
        let workingCode = currentCode;
        let hasChanges = false;
        for (let cmd of commands) {
            cmd = cmd.trim();
            if (!cmd) continue;
            const matchUpdate = cmd.match(/^UPDATE\s+CONNECTION\s+FROM\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+(?:Step\s+)?([a-zA-Z0-9._\s-]+)\s+TO\s+["'](.*?)["']/i);
            if (matchUpdate) {
                const [_, srcIdent, tgtIdent, newLabel] = matchUpdate;
                const srcNodeId = resolveId(srcIdent);
                const tgtNodeId = resolveId(tgtIdent);
                if (srcNodeId && tgtNodeId) {
                    const lines = workingCode.split(/\r?\n/);
                    const updatedLines = lines.map(line => {
                        const trLine = line.trim();
                        if (trLine.includes(srcNodeId) && trLine.includes(tgtNodeId) && trLine.indexOf(srcNodeId) < trLine.indexOf(tgtNodeId)) {
                            const indent = line.match(/^[ \t]*/) || '';
                            hasChanges = true;
                            return `${indent}${srcNodeId} -- "${newLabel}" --> ${tgtNodeId}`;
                        }
                        return line;
                    });
                    workingCode = updatedLines.join('\n');
                }
            }
        }
        if (hasChanges) {
            codeEditor.value = workingCode;
            const dot = document.getElementById('statusDot');
            const txt = document.getElementById('statusText');
            if (dot) dot.className = "h-2 w-2 rounded-full bg-green-500";
            if (txt) txt.textContent = "⚡ Zero-Lag DOM label patch updated successfully.";
            console.log("🎉 [OPTIMIZER SUCCESS] File updates committed cleanly. Execution layout complete.");
            return true;
        }
        return false;
    } catch (e) {
        console.error("💥 [CRITICAL CRASH] Redirection exception caught within parser pipeline:", e);
        return false;
    }
}