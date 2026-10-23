
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFile } = require("child_process");

// ============================================================
// 1. CONFIGURATION
// ============================================================

const CONFIG = {
  DOMAIN: process.env.DOMAIN || "Quick Commerce",

  NICHE:
    process.env.NICHE ||
    "Hyper local On-Demand Grocery Delivery",

  // Existing local llama.cpp setup.
  LLAMA_CLI: process.env.LLAMA_CLI || "llama-cli",

  MODEL:
    process.env.LLAMA_MODEL ||
    "unsloth/Qwen3.5-9B-GGUF",

  NGL: 0,
  CONTEXT_SIZE: 8048,
  BATCH_SIZE: 2048,
  THREADS: 8,
  MAX_TOKENS: 4096,
  REASONING: "off",

  SEARCH: {
    BASE_URL: "https://puri.li",
    RESULTS_PER_QUERY: 4,
    MAX_SOURCES: 8,
    MAX_CONTEXT_CHARS: 5000,
    TIMEOUT_MS: 15000
  },

  OUTPUT_DIR: path.resolve(
    __dirname,
    "../aiOutput"
  )
};

// ============================================================
// 2. GENERAL HELPERS
// ============================================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}

function safeFilename(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(CONFIG.SEARCH.TIMEOUT_MS),
    headers: {
      Accept: "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  const contentType =
    response.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("json")) {
    throw new Error(
      `Expected JSON but received ${contentType || "unknown content type"}`
    );
  }

  return response.json();
}

// ============================================================
// 3. SEARCH THE WEB
//    Uses Purili's public search API; no API key required.
// ============================================================

async function searchWeb(query) {
  const url = new URL(
    "/api/search",
    CONFIG.SEARCH.BASE_URL
  );

  url.searchParams.set("q", query);
  url.searchParams.set("page", "1");
  url.searchParams.set("exact", "0");

  const data = await fetchJson(url);

  if (!Array.isArray(data.results)) {
    throw new Error("Search response has no results array");
  }

  return data.results
    .map((item) => ({
      title: normalizeText(item.title),
      url: normalizeUrl(item.url),
      snippet: normalizeText(item.description),
      source: "Purili"
    }))
    .filter((item) => item.url && (item.title || item.snippet))
    .slice(0, CONFIG.SEARCH.RESULTS_PER_QUERY);
}

// ============================================================
// 4. BUILD RESEARCH QUERIES FROM DOMAIN AND NICHE
// ============================================================

function buildSearchQueries(domain, niche) {
  return [
    `"${domain}" "${niche}" business operations workflow`,

    `"${niche}" grocery order fulfilment inventory picking delivery payment refund`,

    `"${domain}" grocery delivery customer checkout order management operations`
  ];
}

// ============================================================
// 5. RETRIEVE INDEXED PAGE CONTEXT
//
// Context returns text already stored in Purili's index.
// It does not guarantee a live fetch of the website.
// ============================================================

async function getPageContext(source) {
  const url = new URL(
    "/api/context",
    CONFIG.SEARCH.BASE_URL
  );

  url.searchParams.set("url", source.url);

  try {
    const data = await fetchJson(url);

    const content = normalizeText(
      [
        data.title,
        data.summary,
        ...(Array.isArray(data.passages) ? data.passages : []),
        data.content
      ]
        .filter(Boolean)
        .join("\n")
    );

    return {
      ...source,
      pageTitle: normalizeText(data.title || source.title),
      evidenceText: content.slice(
        0,
        CONFIG.SEARCH.MAX_CONTEXT_CHARS
      ),
      coverage: data.coverage || "unknown",
      contextRetrieved: Boolean(content)
    };
  } catch (error) {
    // Preserve search evidence if indexed page context is
    // unavailable instead of discarding the entire source.
    console.warn(
      `[CONTEXT FALLBACK] ${source.url}: ${error.message}`
    );

    return {
      ...source,
      pageTitle: source.title,
      evidenceText: source.snippet,
      coverage: "search-snippet-fallback",
      contextRetrieved: false
    };
  }
}

// ============================================================
// 6. COLLECT AND DEDUPLICATE RESEARCH EVIDENCE
// ============================================================

async function collectResearchEvidence(domain, niche) {
  const queries = buildSearchQueries(domain, niche);
  const uniqueSources = new Map();
  const searchErrors = [];

  for (const query of queries) {
    console.log(`\n[SEARCH] ${query}`);

    try {
      const results = await searchWeb(query);

      console.log(`[SEARCH RESULTS] ${results.length}`);

      for (const result of results) {
        if (!uniqueSources.has(result.url)) {
          uniqueSources.set(result.url, result);
        }
      }
    } catch (error) {
      searchErrors.push({
        query,
        error: error.message
      });

      console.warn(`[SEARCH FALLBACK] ${error.message}`);
    }

    // Avoid sending requests in a tight loop.
    await sleep(300);
  }

  const selectedSources = Array.from(
    uniqueSources.values()
  ).slice(0, CONFIG.SEARCH.MAX_SOURCES);

  if (!selectedSources.length) {
    throw new Error(
      "No web search evidence was retrieved. " +
      "Check internet connectivity and the Purili endpoint. " +
      JSON.stringify(searchErrors)
    );
  }

  console.log(
    `\n[RESEARCH] Retrieving context for ${selectedSources.length} sources`
  );

  const enrichedSources = [];

  // Sequential requests reduce unnecessary load on the service.
  for (const source of selectedSources) {
    const enriched = await getPageContext(source);
    enrichedSources.push(enriched);

    console.log(
      `[SOURCE ${enrichedSources.length}] ${enriched.title || enriched.url}`
    );

    await sleep(200);
  }

  const evidence = enrichedSources.map((source, index) => ({
    sourceId: `S${index + 1}`,
    title: source.pageTitle || source.title,
    url: source.url,
    snippet: source.snippet,
    evidenceText: source.evidenceText,
    coverage: source.coverage
  }));

  return {
    evidence,
    searchErrors,
    queries
  };
}

// ============================================================
// 7. CREATE THE QWEN PROMPT
// ============================================================

function buildModelPrompt(domain, niche, evidence) {
  return `
You are a business-process research analyst.

TASK
Identify real-world business objects for the supplied domain
and niche. Use the supplied research evidence as your primary
basis. Produce the objects in chronological end-to-end business
process order.

DOMAIN
${domain}

NICHE
${niche}

SCOPE
Generate the initial business-object inventory only.

A business object is a meaningful business entity, record,
transaction, resource, or case that the business creates,
maintains, uses, or tracks.

Examples of possible object types include Product, Inventory
Record, Customer Account, Shopping Cart, Customer Order,
Payment Transaction, Picking Task, Delivery Assignment,
Invoice, Refund, and Customer Support Case.

These examples are illustrative, not mandatory. Include an
object only when it is relevant to the supplied domain and niche.

RESEARCH RULES
1. Use the supplied evidence to ground your findings.
2. Never invent source URLs or source IDs.
3. Cite evidence using the supplied source IDs, such as S1 or S3.
4. If the evidence supports an object only weakly, mark its
   confidence as "low" or "medium".
5. You may use established business knowledge to interpret
   the evidence, but do not present unsupported assumptions
   as directly observed facts.
6. Do not confuse an activity with a business object.
   For example, "Picking" is an activity; "Picking Task" may
   be a business object.
7. Do not create a separate object for every status, screen,
   API, technical component, or database table.
8. Do not assume every business uses delivery slots, substitutes,
   returns, or the same payment arrangement.
9. A business object can exist before an individual customer
   order begins. Order objects by their participation in the
   end-to-end business process, not by when a website mentions
   them or when a database row is first created.
10. Avoid duplicate objects and synonyms.
11. Do not classify objects as mandatory or optional.
12. Do not generate actors, user journeys, Mermaid diagrams,
    hierarchies, requirements, epics, or user stories.
13. Do not claim that the sources prove more than their text
    actually supports.
14. Return valid JSON only. No Markdown fences or commentary.

OUTPUT SCHEMA
{
  "domain": "string",
  "niche": "string",
  "businessObjects": [
    {
      "sequence": 1,
      "name": "Business object name",
      "businessPurpose": "Short explanation of its business purpose",
      "processStage": "Business process stage",
      "evidenceSummary": "What the supplied evidence supports",
      "sourceIds": ["S1"],
      "confidence": "high"
    }
  ]
}

VALIDATION
- Sequence numbers must be consecutive, starting at 1.
- Names must be unique after case-insensitive normalization.
- sourceIds may contain only IDs provided in the evidence.
- confidence must be "high", "medium", or "low".
- Return at least one object only if the evidence and domain
  knowledge support it.
- Return the complete JSON object.

RESEARCH EVIDENCE
${JSON.stringify(evidence, null, 2)}
`.trim();
}

// ============================================================
// 8. RUN THE EXISTING LOCAL LLAMA.CPP MODEL
// ============================================================

function runLocalModel(prompt) {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "business-object-research-")
  );

  const promptPath = path.join(tempDir, "prompt.txt");

  fs.writeFileSync(promptPath, prompt, "utf8");

  const args = [
    "-hf", CONFIG.MODEL,
    "-ngl", String(CONFIG.NGL),
    "--single-turn",
    "-c", String(CONFIG.CONTEXT_SIZE),
    "-b", String(CONFIG.BATCH_SIZE),
    "-t", String(CONFIG.THREADS),
    "--reasoning", CONFIG.REASONING,
    "--log-disable",
    "-n", String(CONFIG.MAX_TOKENS),
    "-f", promptPath
  ];

  console.log("\n[MODEL] Starting local Qwen model");
  console.log(`[MODEL] ${CONFIG.MODEL}`);

  return new Promise((resolve, reject) => {
    execFile(
      CONFIG.LLAMA_CLI,
      args,
      {
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
        timeout: 15 * 60 * 1000
      },
      (error, stdout, stderr) => {
        try {
          fs.rmSync(tempDir, {
            recursive: true,
            force: true
          });
        } catch {
          // Temporary-file cleanup is best effort.
        }

        if (error) {
          const diagnostic = normalizeText(stderr).slice(-3000);

          reject(
            new Error(
              `Local model failed: ${error.message}` +
              (diagnostic ? `\n${diagnostic}` : "")
            )
          );

          return;
        }

        if (!normalizeText(stdout)) {
          reject(new Error("Local model returned empty output"));
          return;
        }

        resolve(stdout);
      }
    );
  });
}

// ============================================================
// 9. EXTRACT JSON FROM MODEL OUTPUT
// ============================================================

function extractJsonObject(text) {
  const input = String(text || "");
  const start = input.indexOf("{");

  if (start === -1) {
    throw new Error("Model output contains no JSON object");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < input.length; i++) {
    const char = input[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;

      if (depth === 0) {
        return JSON.parse(input.slice(start, i + 1));
      }
    }
  }

  throw new Error("Model output contains incomplete JSON");
}

// ============================================================
// 10. VALIDATE AND NORMALIZE THE BUSINESS-OBJECT OUTPUT
// ============================================================

function validateBusinessObjects(parsed, domain, niche, evidence) {
  if (!parsed || !Array.isArray(parsed.businessObjects)) {
    throw new Error(
      'Invalid model JSON: expected a "businessObjects" array'
    );
  }

  const validSourceIds = new Set(
    evidence.map((item) => item.sourceId)
  );

  const seenNames = new Set();

  const businessObjects = parsed.businessObjects.map(
    (item, index) => {
      const name = normalizeText(item.name);
      const normalizedName = name.toLowerCase();

      if (!name) {
        throw new Error(
          `Business object at index ${index} has no name`
        );
      }

      if (seenNames.has(normalizedName)) {
        throw new Error(`Duplicate business object: ${name}`);
      }

      seenNames.add(normalizedName);

      const sourceIds = Array.isArray(item.sourceIds)
        ? [...new Set(item.sourceIds)]
            .filter((id) => validSourceIds.has(id))
        : [];

      const allowedConfidence = new Set([
        "high",
        "medium",
        "low"
      ]);

      const confidence = allowedConfidence.has(item.confidence)
        ? item.confidence
        : "low";

      return {
        sequence: index + 1,
        name,
        businessPurpose: normalizeText(item.businessPurpose),
        processStage: normalizeText(item.processStage),
        evidenceSummary: normalizeText(item.evidenceSummary),
        sourceIds,
        confidence,
        evidenceStatus: sourceIds.length
          ? "source-linked"
          : "requires-evidence-review"
      };
    }
  );

  return {
    domain,
    niche,
    generatedAt: new Date().toISOString(),
    generationMethod: "web-research-plus-local-llm",
    businessObjects,
    sources: evidence.map((item) => ({
      sourceId: item.sourceId,
      title: item.title,
      url: item.url,
      coverage: item.coverage
    }))
  };
}

// ============================================================
// 11. SAVE JSON OUTPUT
// ============================================================

function saveJson(data) {
  fs.mkdirSync(CONFIG.OUTPUT_DIR, {
    recursive: true
  });

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

  const filename = [
    safeFilename(CONFIG.DOMAIN),
    safeFilename(CONFIG.NICHE),
    "business-objects",
    timestamp
  ].filter(Boolean).join("-") + ".json";

  const outputPath = path.join(
    CONFIG.OUTPUT_DIR,
    filename
  );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  return outputPath;
}

// ============================================================
// 12. MAIN PIPELINE
// ============================================================

async function main() {
  console.log("==============================================");
  console.log(" BUSINESS OBJECT DISCOVERY");
  console.log("==============================================");
  console.log(`DOMAIN: ${CONFIG.DOMAIN}`);
  console.log(`NICHE:  ${CONFIG.NICHE}`);

  // Stage 1: Search and retrieve research evidence.
  const research = await collectResearchEvidence(
    CONFIG.DOMAIN,
    CONFIG.NICHE
  );

  console.log(
    `\n[RESEARCH COMPLETE] ${research.evidence.length} sources`
  );

  if (research.searchErrors.length) {
    console.warn(
      `[RESEARCH WARNING] ${research.searchErrors.length} query/queries failed`
    );
  }

  // Stage 2: Ask local Qwen to extract and order objects.
  const prompt = buildModelPrompt(
    CONFIG.DOMAIN,
    CONFIG.NICHE,
    research.evidence
  );

  const modelOutput = await runLocalModel(prompt);

  // Stage 3: Parse and validate the model's JSON.
  const parsed = extractJsonObject(modelOutput);

  const output = validateBusinessObjects(
    parsed,
    CONFIG.DOMAIN,
    CONFIG.NICHE,
    research.evidence
  );

  // Stage 4: Save the output.
  const outputPath = saveJson(output);

  console.log("\n==============================================");
  console.log("[SUCCESS] BUSINESS OBJECT DISCOVERY COMPLETE");
  console.log("==============================================");
  console.log(`Business objects: ${output.businessObjects.length}`);
  console.log(`Sources:          ${output.sources.length}`);
  console.log(`Output file:      ${outputPath}`);

  console.log("\nBusiness objects in chronological order:");

  for (const item of output.businessObjects) {
    console.log(
      `${String(item.sequence).padStart(2, "0")}. ${item.name}` +
      ` [${item.confidence}]`
    );
  }

  if (research.searchErrors.length) {
    console.log("\nSearch warnings:");

    for (const item of research.searchErrors) {
      console.log(`- ${item.query}: ${item.error}`);
    }
  }
}

main().catch((error) => {
  console.error("\n[GENERATION FAILED]");
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
