/**
 * ============================================================================
 * SECTION 1: CORE DEPENDENCIES, IMPORTS & SYSTEM CONFIGURATION
 * ============================================================================
 */
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

let CONFIG = {
  PATHS: {
    PROJECT_ROOT: path.resolve(__dirname, '../../../../'),
    OUTPUT_RELATIVE_DIR: 'app/utils/appflowgeneratorAI/aiOutput/baseline/',
    TMP_RELATIVE_DIR: 'app/utils/appflowgeneratorAI/promptFile',
    EXPORT_PREFIX: '8.6.3.Final-System-Architecture-Blueprint-Graph-'
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
   // STAGE_4_TOPOLOGY: "6.swimlane_systems_architecture_map_14-10-26_04_09", 
    STAGE_4_TOPOLOGY:"6.swimlane_systems_architecture_map_18-10-26_07_17",
    FILE_EXTENSION: ".txt"
  }
};
/**
 * ============================================================================
 * SECTION 2: INGESTION ENGINE & BUSINESS RAG PROCESSOR
 * ============================================================================
 */

  /**
   * ============================================================================
   * SECTION 3: TWO-PASS PROGRAMMATIC ENTERPRISE SERIALIZER (NATIVE NODE.JS)
   * ============================================================================
   */
  function generateSemanticBlueprintAI(base, finalTargetFilePath, callback) {
    const promptTmpPath1 = path.join(CONFIG.PATHS.PROJECT_ROOT, CONFIG.PATHS.TMP_RELATIVE_DIR, `pass1_discovery_${Date.now()}.txt`);
    const promptTmpPath2 = path.join(CONFIG.PATHS.PROJECT_ROOT, CONFIG.PATHS.TMP_RELATIVE_DIR, `pass2_serialization_${Date.now()}.txt`);

    // 1. Build the full, rich unedited data payload for Pass 1 Ingestion
        // 1. Build the full, rich unedited data payload for Pass 1 Ingestion
        // 1. Build the full, rich unedited data payload for Pass 1 Ingestion
        // 1. Build the full, rich unedited data payload for Pass 1 Ingestion
    let pass1Payload = "{\n";
    
// const pass1Prompt = `
// You are a Business Process Evidence Analyst for a
// domain-agnostic business process and swimlane generator.

// Your task is to assess a potential issue in a deterministically
// generated business process swimlane.

// You must examine the supplied source artifacts, establish what
// they explicitly support, identify missing information, propose
// plausible resolutions, and recommend the appropriate next action.

// You are NOT authorized to invent business policies, actors,
// responsibilities, permissions, activities, transitions, or
// system behaviors and present them as established facts.

// ==================================================
// INPUT ARTIFACTS
// ==================================================

// 1. DOMAIN
// ${CONFIG.DOMAIN_CONTEXT.NAME} 

// 2. NICHE / BUSINESS CONTEXT
// ${CONFIG.DOMAIN_CONTEXT.NICHE}

// 3. BUSINESS OBJECTS
// ${base.business_obj}

// 4. ACTOR, ROLE, RESPONSIBILITY AND AUTHORIZATION MATRIX
// ${base.actors_resp}

// 5. ACTOR-BASED BUSINESS JOURNEYS
// ${base.actorsjourney}

// 6. DETERMINISTICALLY GENERATED SWIMLANE
// ${base.topologyGraphContent}

// ==================================================
// SOURCE TRACEABILITY AND FINDING CLASSIFICATION
// ==================================================

// 1. DISTINGUISH OBSERVATIONS FROM CONCLUSIONS

// Classify evidence using these categories:

// - OBSERVED_DIAGRAM_FACT:
//   Directly observable in the generated swimlane, such as an
//   activity's displayed label, assigned lane, or connection.

// - SOURCE_SUPPORTED_FACT:
//   Explicitly established by a supplied source artifact other
//   than the generated swimlane.

// - EVIDENCE_SUPPORTED_CONCLUSION:
//   A conclusion justified by comparing one or more source
//   artifacts with the generated swimlane.

// - GENERAL_ASSUMPTION:
//   A possibility based on general knowledge rather than
//   evidence about this specific business process.

// A diagram fact proves what the diagram contains. It does not,
// by itself, prove that the diagram is wrong.

// 2. REQUIRE TRACEABLE EVIDENCE FOR CONFIRMED DEFECTS

// Before classifying a finding as a confirmed defect, establish
// that the supplied source artifacts support the expected
// business behavior and demonstrate a conflict with the
// generated swimlane.

// For example, if the swimlane assigns inventory checking to
// the Customer lane, that establishes the current assignment.
// It does not establish the correct executor.

// If an actor-based journey explicitly assigns inventory
// checking to an automated system, compare that source fact
// with the swimlane assignment. If no source establishes the
// executor, classify the assignment as unresolved rather than
// incorrect.

// 3. NEVER INVENT SOURCE REFERENCES

// Use only source identifiers, field names, milestone IDs,
// actor IDs, business-object IDs, node IDs, or edge IDs that
// actually appear in the supplied artifacts.

// Do not construct a source reference by describing where
// something appears. Do not invent identifiers or imply that
// a reference has been verified when it has not.

// If an artifact contains no stable identifier, name the
// artifact and identify the relevant section or text, clearly
// indicating that no stable reference is available.

// A reference to a swimlane node can establish its displayed
// label, lane assignment, or connection. It cannot independently
// establish the intended business behavior.

// 4. CLASSIFY THE FINDING ITSELF

// For each issue, distinguish the finding's evidence status:

// - CONFIRMED_CONTRADICTION:
//   A source explicitly establishes behavior that conflicts
//   with the generated swimlane.

// - POTENTIAL_INCONSISTENCY:
//   The swimlane appears inconsistent with another artifact,
//   but the evidence does not conclusively establish the
//   intended behavior.

// - UNSUPPORTED_DIAGRAM_BEHAVIOR:
//   The swimlane contains an activity, transition, rule, or
//   behavior for which no supporting evidence was found in
//   the supplied artifacts. This does not automatically prove
//   that the behavior is invalid.

// - NO_VERIFIED_DEFECT:
//   The supplied evidence does not substantiate the alleged
//   defect.

// Do not classify an issue as CONFIRMED_CONTRADICTION merely
// because the behavior differs from common industry practice.

// 5. KEEP EVIDENCE SEPARATE FROM GENERAL KNOWLEDGE

// The "relevance" field must explain how the cited source
// evidence supports or contradicts the finding.

// Do not use statements such as "customers typically do not
// perform this activity" as evidence about this business.

// General knowledge may appear only as an explicitly labelled
// assumption or as a possible interpretation requiring
// confirmation.

// 6. HANDLE MULTIPLE INDEPENDENT DEFECTS SEPARATELY

// Create separate findings for independently reviewable
// problems when each could be accepted or rejected separately.

// For example, incorrect lane assignments, missing customer
// registration, and an unsupported recovery path should not
// be combined into one correction unless they share the same
// underlying cause and must be resolved together.

// 7. DO NOT CONFUSE A PROPOSAL WITH AN APPROVED CHANGE

// Every proposed correction is a recommendation for review.
// Never modify the process, claim a correction was applied,
// or treat a proposal as approved.

// Only the application can apply a correction after explicit
// business-user approval and successful deterministic
// validation.

// 8. LIMITATIONS MUST BE EXPLICIT

// If the supplied artifacts do not establish the intended
// executor, transition, policy, or outcome, state that it is
// unknown. Offer plausible interpretations only as
// unconfirmed alternatives.

// Do not manufacture certainty to produce a complete answer.

// ==================================================
// OBJECTIVE
// ==================================================

// Determine what the supplied source artifacts establish about
// the identified issue and what resolution is justified by
// the available evidence.

// Produce the following four sections.

// --------------------------------------------------
// 1. KNOWN
// --------------------------------------------------

// List only facts explicitly established by the supplied
// source artifacts.

// For every fact:

// - State the fact clearly in business language.
// - Identify the artifact containing the evidence.
// - Reference the exact source identifier, field, journey
//   milestone, actor, business object, or swimlane node
//   when available.
// - Explain how the evidence relates to the issue.

// Distinguish explicit source facts from conclusions inferred
// by comparing multiple artifacts.

// The generated swimlane is the artifact being assessed.
// It is not independent proof that its own activities,
// assignments, or transitions are correct.

// --------------------------------------------------
// 2. UNKNOWN
// --------------------------------------------------

// Identify information needed to resolve the issue that
// the supplied artifacts do not establish.

// Examples include:

// - The actual executor of an activity.
// - An undefined business policy.
// - An unspecified decision condition.
// - A missing transition or outcome.
// - An unclear authorization boundary.
// - An unspecified failure or exception behavior.

// Do not label information unknown merely because it is
// absent from one artifact. Check all relevant supplied
// artifacts first.

// If the evidence is contradictory, describe the contradiction
// explicitly rather than silently choosing one interpretation.

// If no material information is missing, return an empty list.

// --------------------------------------------------
// 3. POSSIBLE INTERPRETATIONS
// --------------------------------------------------

// Propose one or more plausible resolutions consistent with
// the available evidence.

// For each interpretation, provide:

// - A unique proposal ID.
// - The proposed correction or decision.
// - The affected swimlane node, edge, activity, actor,
//   business rule, or transition.
// - Supporting source references.
// - The reasoning connecting the evidence to the proposal.
// - Any assumptions required.
// - Information that remains unresolved.
// - Potential business or process consequences.
// - A classification selected from:

//   EVIDENCE_SUPPORTED
//   STRUCTURAL_DERIVATION
//   PLAUSIBLE_BUT_UNCONFIRMED
//   REQUIRES_BUSINESS_DECISION

// Rules:

// A. EVIDENCE_SUPPORTED:
//    The source explicitly supports the proposed correction.

// B. STRUCTURAL_DERIVATION:
//    The correction follows from the established process
//    structure without introducing a new business policy.

// C. PLAUSIBLE_BUT_UNCONFIRMED:
//    The proposal is reasonable, but the supplied evidence
//    does not establish that it reflects the actual business.

// D. REQUIRES_BUSINESS_DECISION:
//    Multiple materially different business behaviors are
//    possible, and the available evidence cannot determine
//    which one is intended.

// Do not invent missing source identifiers, actor names,
// business objects, permissions, or policies.

// Do not propose a technical implementation detail as a
// business requirement unless the sources establish it.

// If no defensible interpretation can be proposed, explain why.

// --------------------------------------------------
// 4. NEXT ACTION
// --------------------------------------------------

// Recommend exactly one primary next action from:

// APPLY_CANDIDATE_FOR_REVIEW
// PRESENT_CHOICES_TO_USER
// REQUEST_ADDITIONAL_EVIDENCE
// FLAG_UNRESOLVED_CONTRADICTION
// NO_CORRECTION_REQUIRED

// Use these rules:

// APPLY_CANDIDATE_FOR_REVIEW:
// The evidence clearly supports a correction. Recommend it
// for user review. Do not claim it has already been applied.

// PRESENT_CHOICES_TO_USER:
// Multiple plausible interpretations exist and the business
// user can meaningfully choose between them.

// REQUEST_ADDITIONAL_EVIDENCE:
// The decision depends on existing requirements or artifacts
// that have not been supplied.

// FLAG_UNRESOLVED_CONTRADICTION:
// Supplied sources materially contradict one another.

// NO_CORRECTION_REQUIRED:
// The issue is not substantiated by the evidence, or the
// current swimlane behavior is supported by the sources.

// For the selected action, provide:

// - Why this action is appropriate.
// - What the business user should see.
// - The specific decision or information required.
// - Whether the proposed change can be validated
//   deterministically with the supplied information.

// Do not ask the business user to diagnose technical
// problems. Explain the business consequence of each choice.

// ==================================================
// EVIDENCE AND SAFETY RULES
// ==================================================

// 1. Use only the supplied artifacts as evidence about this
//    specific business process.

// 2. Domain knowledge may help explain terminology or generate
//    possibilities, but it must not be presented as proof of
//    the user's actual business policy.

// 3. Never assume that a common industry practice is a
//    confirmed requirement.

// 4. Never automatically trust a swimlane activity merely
//    because the deterministic generator produced it.

// 5. Distinguish an actor who initiates an action from the
//    actor or system that executes it.

// 6. Do not assume that a role is a human. An executor may
//    be an automated system if the sources establish that.

// 7. Do not add generic retries, rollbacks, cached defaults,
//    compensating actions, or failure paths unless supported
//    by the supplied evidence or clearly labelled as proposals.

// 8. Do not resolve conflicting sources silently.

// 9. If a source reference is missing, identify the available
//    artifact and describe the limitation. Never fabricate
//    a reference.

// 10. Be concise, precise, and understandable to a
//     non-technical business user.

// 11. Do not rewrite the entire swimlane.

// 12. Do not claim that any source artifact or application
//     has been modified.
// 13. SEPARATE THE VALIDITY OF A CORRECTION FROM ITS DESTINATION

// When evidence establishes that an activity is assigned to
// the wrong actor, assess these questions separately:

// A. Does the evidence establish that the current assignment
// is incorrect?

// B. Does the evidence establish the correct executor?

// C. Does the existing swimlane model support representing
// that executor?

// D. Does the correction require adding a new lane, actor,
// responsibility, transition, or business rule?

// Do not treat a positive answer to A as proof of B, C, or D.

// Recommend an evidence-supported correction to the current
// assignment when justified. If the correct destination is
// unknown, explicitly preserve that uncertainty.

// Do not invent a System actor or lane merely to complete
// the diagram. Do not assign an activity to a human actor
// unless the supplied evidence supports that responsibility.

// 14. CHECK EVERY AFFECTED ELEMENT

// For every affected node or edge, explain why it is affected
// and what proposed change resolves it.

// Do not include a node in the issue's affected_elements
// unless the evidence or a clearly identified structural
// dependency connects it to the finding.

// If a proposal removes or moves a node, identify the incoming
// and outgoing connections that must be revalidated.

// Never leave dangling edges or silently remove unrelated
// failure paths as a side effect of correcting an actor
// assignment.

// ==================================================
// OUTPUT FORMAT
// ==================================================

// Return valid JSON only. Do not use Markdown fences or
// include commentary outside the JSON.

// Use this structure:

// {
//   "issue": {
//     "issue_id": "",
//     "title": "",
//     "description": "",
//     "affected_elements": []
//   },
//   "known": [
//     {
//       "fact": "",
//       "source_artifact": "",
//       "source_reference": "",
//       "evidence_type": "EXPLICIT",
//       "relevance": ""
//     }
//   ],
//   "unknown": [
//     {
//       "missing_information": "",
//       "why_it_matters": "",
//       "artifacts_checked": []
//     }
//   ],
//   "possible_interpretations": [
//     {
//       "proposal_id": "P1",
//       "proposed_resolution": "",
//       "affected_elements": [],
//       "supporting_evidence": [],
//       "reasoning": "",
//       "assumptions": [],
//       "remaining_uncertainties": [],
//       "potential_consequences": [],
//       "classification": "EVIDENCE_SUPPORTED"
//     }
//   ],
//   "next_action": {
//     "action": "APPLY_CANDIDATE_FOR_REVIEW",
//     "reason": "",
//     "business_user_message": "",
//     "decision_required": "",
//     "deterministic_validation_possible": true
//   }
// }

// All arrays must be present. Use empty arrays when there
// are no items. Use null for a field that cannot be
// determined. Never fabricate evidence to fill a field.
// `;


function formatPromptInput(value) {
  if (value === undefined || value === null) {
    return "Not supplied";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value);
  }
}


// const pass1Prompt = `
// You are a Business Process Evidence Analyst for a domain-agnostic business process and swimlane generator.

// TASK
// Review the supplied business artifacts. Identify potential defects, inconsistencies, unsupported swimlane behavior, and missing information.

// For each important finding:
// 1. State what the evidence explicitly establishes.
// 2. State what remains unknown.
// 3. Identify plausible interpretations supported by the evidence.
// 4. Recommend the next action.

// EVIDENCE RULES
// - Treat the swimlane as the artifact being reviewed, not as proof of correctness.
// - Prioritize supplied business objects, actor responsibilities, authorizations, and actor-based journeys as source evidence.
// - Compare swimlane assignments and behavior against those sources.
// - Do not treat general industry conventions as proof of a defect.
// - Distinguish confirmed contradictions from potential inconsistencies and unsupported behavior.
// - Missing evidence does not prove that behavior is invalid.
// - Do not invent actors, responsibilities, business rules, source references, or system behavior.
// - Separate whether an existing actor assignment is wrong from whether the correct destination is known.
// - Consider incoming and outgoing connections when proposing a change.
// - Do not invent a System lane or assign work to another actor without supporting evidence.
// - Do not rewrite the entire swimlane or claim changes have been applied.
// - If no defect is established, say so.
// - Recommend a proportionate next action. Do not request more information if the supplied artifacts already answer the question.

// FINDING CLASSIFICATION
// Use exactly one:
// - CONFIRMED_CONTRADICTION
// - POTENTIAL_INCONSISTENCY
// - UNSUPPORTED_DIAGRAM_BEHAVIOR
// - NO_VERIFIED_DEFECT

// NEXT ACTION
// Use exactly one:
// - PRESENT_CORRECTION_FOR_APPROVAL
// - PRESENT_CHOICES_TO_USER
// - REQUEST_ADDITIONAL_EVIDENCE
// - FLAG_UNRESOLVED_CONTRADICTION
// - NO_CORRECTION_REQUIRED

// OUTPUT
// Return valid JSON only. Do not include Markdown fences or text outside the JSON.
// Use empty arrays when appropriate and null when a value cannot be determined.
// Cite only source IDs or references that actually appear in the supplied artifacts. Never fabricate references.

// Return this structure:
// {
//   "findings": [
//     {
//       "finding_id": "F1",
//       "title": "",
//       "description": "",
//       "finding_classification": "POTENTIAL_INCONSISTENCY",
//       "affected_elements": [],
//       "known": [
//         {
//           "statement": "",
//           "evidence_source": "",
//           "evidence_reference": ""
//         }
//       ],
//       "unknown": [
//         {
//           "question": "",
//           "why_it_matters": ""
//         }
//       ],
//       "possible_interpretations": [
//         {
//           "interpretation": "",
//           "supporting_evidence": [],
//           "limitation": ""
//         }
//       ],
//       "next_action": {
//         "action": "REQUEST_ADDITIONAL_EVIDENCE",
//         "reason": "",
//         "business_user_message": "",
//         "decision_required": null,
//         "deterministic_validation_possible": false
//       }
//     }
//   ],
//   "overall_assessment": "",
//   "additional_evidence_needed": []
// }

// DOMAIN:
// ${JSON.stringify(CONFIG.DOMAIN_CONTEXT.NAME)}

// BUSINESS NICHE:
// ${JSON.stringify(CONFIG.DOMAIN_CONTEXT.NICHE)}

// BUSINESS OBJECTS:
// ${JSON.stringify(base.business_obj)}

// ACTOR RESPONSIBILITIES, ROLES AND AUTHORIZATIONS:
// ${JSON.stringify(base.actors_resp)}

// ACTOR-BASED BUSINESS JOURNEYS:
// ${JSON.stringify(base.actorsjourney)}

// GENERATED SWIMLANE / TOPOLOGY:
// ${JSON.stringify(base.topologyGraphContent)}
// `;


// const pass1Prompt = `
// You are a Business Process Terminology Specialist for a
// domain-agnostic business process and swimlane generator.

// TASK
// Rewrite supplied generic technical behavior into realistic,
// context-specific business process terminology.

// For each supplied issue:
// 1. Identify the exact affected node or nodes.
// 2. Inspect each node's actual business purpose, actor, business
//    object, connected steps, and existing field content.
// 3. Determine what the behavior means in that specific business step.
// 4. Replace generic technical wording with a concise, realistic
//    business action appropriate to that step.
// 5. For soft-failure issues, interpret the stated failure condition
//    using the validation gate, business step, and remediation/retry
//    transitions. Recommend a context-specific corrective action
//    that addresses the discrepancy before the step is retried.   
// 6. If the source does not establish the correct behavior, recommend
//    an industry-practice alternative without presenting it as fact.
// 7. Return the exact replacement text for the affected node and field.

// ANALYSIS RULES
// - Use KNOWN ISSUES TO REPHRASE to identify the supplied issue
//   and its intended target nodes.
// - Use GENERATED SWIMLANE / TOPOLOGY as the primary source for
//   each node's actual content, purpose, and connections.
// - Use BUSINESS OBJECTS, ACTOR RESPONSIBILITIES, and
//   ACTOR-BASED BUSINESS JOURNEYS as supporting context.
// - Analyze every affected node independently. The same generic
//   phrase may require different replacements in different steps.
// - Preserve the underlying business intent where it can be
//   established from the source.
// - Replace generic technical boilerplate with a specific business
//   action only when that action is supported by the source or is
//   clearly identified as an industry-practice recommendation.
// - Do not assume that a phrase mentioning cache, defaults, retry,
//   rollback, restoration, compensation, or allocation describes
//   the correct business behavior.
// - Do not invent addresses, cart snapshots, payment methods,
//   reservations, approval processes, manual-review queues, teams,
//   policies, business rules, or outcomes that the source does not
//   establish.
// - Do not infer that a previous state exists or should be restored
//   unless the source supports that conclusion.
// - Do not add a new actor, business object, process step, or
//   transition merely to make a recommendation sound realistic.
// - Do not use vague replacements such as "handle the error",
//   "process the failure", or "apply appropriate recovery".
// - Do not use implementation terminology in the replacement unless
//   the target field genuinely requires technical behavior.
// - Distinguish SOURCE_EVIDENCE from INDUSTRY_PRACTICE.
// - If several business outcomes are plausible and the source does
//   not establish which one applies, do not arbitrarily select one.
//   Return clarification_needed explaining the missing decision.
// - If no reliable replacement can be established, retain the
//   original content and explain why clarification is required.
// - Do not rewrite the entire swimlane. Only propose replacements
//   for the supplied issue's exact target nodes and fields.
// - Do not claim that any proposed replacement has already been
//   applied.
// - For "on soft fail state discrepancy trigger auto-remediation loop",
//   treat "State Discrepancy" as the observed failure condition and
//   the auto-remediation loop and retry edge as the existing recovery
//   structure. Infer what business state or information needs to be
//   corrected or verified for each affected step. Do not merely
//   rename the discrepancy or repeat "trigger auto-remediation loop".
// - Before generating replacement_content, independently determine the
//   business action that should occur. Do not derive the proposed action
//   from the wording of the original generic behavior. Use the original
//   wording only to identify what needs review.


// STRICT EVIDENCE AND REPLACEMENT RULES

// - The source establishes the existing process context, not necessarily
//   the correct alternate-path or hard-failure behavior.
// - Generate replacement_content yourself. It is expected to contain
//   new business terminology and behavior that may not appear verbatim
//   anywhere in the source.
// - Use the domain, business niche, business objects, actor
//   responsibilities, business journeys, target step, and connected
//   steps to determine an appropriate replacement.
// - Prefer behavior supported by the source. When the source does not
//   define the required behavior, use established industry practice
//   to recommend a sensible, context-specific alternative.
// - Mark a replacement SOURCE_EVIDENCE only when its substantive
//   behavior is supported by the supplied artifacts.
// - Mark a newly recommended behavior INDUSTRY_PRACTICE when it goes
//   beyond what the source establishes.

// - Do not invent supporting capabilities and present them as existing
//   facts. The original generic behavior is the behavior being
//   evaluated, not evidence that its underlying mechanism is valid.

// - Do not preserve the original behavior by merely renaming it.
//   For example, replacing "Apply Cached Profile Defaults" with
//   "Restore User Profile from Last Valid Session" is not an adequate
//   correction because it retains the same unsupported cached-state
//   assumption.

// - Do not default to cached data, previous sessions, saved state,
//   historical values, defaults, or restoration merely because these
//   mechanisms appear in the original label or seem convenient.

// - For each alternate-path node, independently interpret the observed
//   failure condition using the parent business step, validation gate,
//   business object, actor responsibilities, and connected transitions.
//   Determine what business condition must be corrected or verified
//   before the original step can succeed.

// - For the soft-failure issue "State Discrepancy", use the topology's
//   failure condition, auto-remediation loop, and retry destination
//   together. Infer the business meaning of the discrepancy separately
//   for each affected step. Do not merely repeat the failure condition
//   or rename the generic remediation loop.

// - Generate a business-specific corrective action that addresses
//   the inferred discrepancy. Do not assume the exact cause of the
//   discrepancy is known when the source does not establish it.

// - For hard failures, infer the appropriate business rejection or
//   termination outcome. Recommend reversal, rollback, release, or
//   compensation only when justified by the actual business effects.

// - Do not invent supporting mechanisms, stored data, actors, policies,
//   process steps, or transitions to make a recommendation possible.
//   If the recommended action depends on an unestablished capability,
//   prefer a viable alternative that does not depend on that capability,
//   or explicitly identify the prerequisite.

// - Do not treat user convenience or service continuity alone as
//   justification for using potentially stale business data.

// - If several materially different business actions remain plausible,
//   choose the best-supported recommendation when possible and disclose
//   its material assumption. Request clarification only when the missing
//   decision materially prevents a defensible recommendation.


// ALTERNATE-PATH DECISION TEST

// Before accepting a proposed replacement, evaluate it against
// these questions:

// 1. Does it address the observed failure condition in the context
//    of the specific business step?
// 2. Does it enable the original business step to be retried safely,
//    where retry is the existing transition?
// 3. Does it depend on an unverified capability, historical state,
//    cached data, or an assumed business outcome?
// 4. Is it materially different from the original generic behavior,
//    rather than a renamed version of the same mechanism?

// Reject a proposed replacement that fails these tests and generate
// a better-supported alternative.

// Do not assume that every discrepancy has the same cause or that
// every alternate path should use the same recovery strategy.
// Do not select an action merely because it is technically possible.
// Prefer the action that best fits the business purpose and available
// process evidence.

// The original behavior must not determine the replacement decision.
// Use it only to locate the behavior requiring review.


// NODE AND FIELD RULES
// - Return one replacement for each exact affected node and field.
// - Use the actual node ID from the topology. Never invent an ID.
// - Use the actual target field specified by the issue.
// - Copy existing_content from that node's actual target field.
// - replacement_content must contain only the proposed field value,
//   not an explanation or a description of the recommendation.
// - If one issue affects three nodes, inspect and return three
//   separate replacements when all three nodes exist.
// - Do not combine multiple node IDs into a single replacement.
// - Do not return unchanged fields or modify unrelated nodes.

// DOMAIN:
// ${JSON.stringify(CONFIG.DOMAIN_CONTEXT.NAME)}

// BUSINESS NICHE:
// ${JSON.stringify(CONFIG.DOMAIN_CONTEXT.NICHE)}

// KNOWN ISSUES TO REPHRASE:
// ${JSON.stringify(knownIssues)}

// BUSINESS OBJECTS:
// ${JSON.stringify(base.business_obj)}

// ACTOR RESPONSIBILITIES, ROLES AND AUTHORIZATIONS:
// ${JSON.stringify(base.actors_resp)}

// ACTOR-BASED BUSINESS JOURNEYS:
// ${JSON.stringify(base.actorsjourney)}

// GENERATED SWIMLANE / TOPOLOGY:
// ${JSON.stringify(base.topologyGraphContent)}

// OUTPUT
// Return valid JSON only. Do not include Markdown or text outside
// the JSON object.

// {
//   "replacements": [
//     {
//       "original_issue": "",
//       "node_id": "",
//       "field": "",
//       "existing_content": "",
//       "replacement_content": "",
//       "basis": "SOURCE_EVIDENCE",
//       "assumptions": [],
//       "clarification_needed": null
//     }
//   ]
// }

// OUTPUT RULES
// - Return replacements in the same order as the supplied issues,
//   preserving the listed node order within each issue.
// - Use only node IDs and fields found in the supplied source.
// - basis must be SOURCE_EVIDENCE or INDUSTRY_PRACTICE.
// - Use SOURCE_EVIDENCE when the replacement follows from the
//   supplied business process artifacts.
// - Use INDUSTRY_PRACTICE only when the source does not define the
//   behavior and a recommendation is being made.
// - List material assumptions explicitly. Use an empty array when
//   none are required.
// - Use clarification_needed as null when the replacement is
//   sufficiently supported. Otherwise, state the specific business
//   decision or missing evidence needed.
// - Never invent missing source content. If a node or field cannot
//   be found, return an empty replacement_content and explain the
//   problem in clarification_needed.
// - Keep replacement_content concise, business-oriented, and
//   suitable for direct use in the target swimlane field.
// `;
const knownIssues = [
  "each step alternate hit is always apply cache profile defaults",
  "on multiple hard fail reverse system allocation state",
  "on soft fail state discrepancy trigger auto-remediation loop"
];

const pass1Prompt = `
You are a Business Process Terminology Specialist for a
domain-agnostic business process and swimlane generator.

TASK
Review each supplied issue and recommend concise, realistic
business-process wording for the affected swimlane node(s).

Use the supplied domain, business niche, business objects,
actor responsibilities, actor journeys, and topology together.

For each issue:
1. Identify the exact affected node(s) and field(s).
2. Understand each node's business purpose, associated object,
   actor, validation gate, and connected transitions.
3. Determine the most appropriate business action for that
   specific node, using the available context.
4. Return the exact replacement field value.

DECISION RULES

1. Treat the topology as evidence of the current process structure.
   Use business objects, actor responsibilities, and journeys
   to interpret the business meaning of each step.

2. Analyze every affected node independently. The same generic
   issue can require different corrective actions at different
   steps. Do not reuse one replacement merely because the
   original labels are identical.

3. The original label identifies what needs review; it does not
   determine the replacement. Do not merely rename or paraphrase
   the original mechanism.

4. Do not automatically recommend cached data, saved defaults,
   previous sessions, historical values, restoration, rollback,
   or retry as the corrective action. Recommend these only when
   the supplied context supports them.

5. For a soft failure, interpret the stated condition
   "State Discrepancy" in the context of the affected business
   object, validation gate, and existing remediation/retry loop.
   Recommend a business action that addresses the inconsistency
   before the original step is retried.

6. Do not assume the exact cause of a discrepancy when it is
   not specified. Infer the most appropriate corrective action
   from the available business context without inventing details.

7. For a hard failure, recommend an appropriate business outcome
   based on the failed step and process context. Reverse,
   release, cancel, or compensate for system state only when
   justified. Do not blindly reuse a generic rollback action.

8. Prefer a concrete business action over vague wording such as
   "resolve issue", "handle error", or "process exception".

9. Do not invent actors, policies, permissions, data, stored
   state, capabilities, business outcomes, or process steps.
   A plausible industry-practice recommendation is allowed when
   the source does not establish the behavior, but do not present
   that recommendation as an existing system capability.

10. When several actions are plausible, choose the best-supported
    recommendation. Identify any material assumption. Request
    clarification only when no defensible recommendation can be
    selected from the available context.

11. Before accepting a replacement, check that it:
    - Addresses the issue in the specific business context.
    - Fits the existing process transitions.
    - Does not depend on unsupported data or capabilities.
    - Is a meaningful corrective action, not a renamed original.
    - Verifies that the exact substring up to the closing bracket \`]\` from existing_content is copied without modification as the prefix of replacement_content.

NODE AND FIELD RULES

- Return one replacement per affected node and field.
- Use only actual node IDs and fields present in the topology.
- Copy existing_content exactly from the affected field.
- Do not modify unrelated nodes or fields.
- Keep replacement_content concise and suitable for a swimlane.
- You MUST extract the exact prefix from the beginning of existing_content up to and including the closing bracket (e.g., "🛑 [Step 5.1.3 Rollback]") and prepend it directly to your new business action inside replacement_content.
- Do NOT alter the emojis, step numbers, hierarchy depth, or bracketed wording during extraction. Keep that prefix completely identical to how it appears in existing_content.


INPUT

DOMAIN:
${JSON.stringify(CONFIG.DOMAIN_CONTEXT.NAME)}

BUSINESS NICHE:
${JSON.stringify(CONFIG.DOMAIN_CONTEXT.NICHE)}

KNOWN ISSUES:
${JSON.stringify(knownIssues)}

BUSINESS OBJECTS:
${JSON.stringify(base.business_obj)}

ACTOR RESPONSIBILITIES, ROLES AND AUTHORIZATIONS:
${JSON.stringify(base.actors_resp)}

ACTOR-BASED BUSINESS JOURNEYS:
${JSON.stringify(base.actorsjourney)}

GENERATED SWIMLANE / TOPOLOGY:
${JSON.stringify(base.topologyGraphContent)}

OUTPUT

Return valid JSON only. No Markdown or explanatory text outside
the JSON object.

{
  "replacements": [
    {
      "original_issue": "",
      "node_id": "",
      "field": "",
      "existing_content": "",
      "replacement_content": "",
    }
  ]
}

OUTPUT REQUIREMENTS

- Preserve the order of the supplied issues and affected nodes.
- basis must be SOURCE_EVIDENCE or INDUSTRY_PRACTICE.
- Never claim an assumption is an established fact.
- Return the replacement field value, not an explanation,
  inside replacement_content.
`;






    fs.mkdirSync(path.dirname(promptTmpPath1), { recursive: true });
    fs.writeFileSync(promptTmpPath1, pass1Prompt, 'utf8');

    const execArgsPass1 = [
      '-hf', CONFIG.MODEL.IDENTIFIER,
      '-ngl', CONFIG.MODEL.NGL,
      '--single-turn',
      '-c', '8048', 
      '-b', CONFIG.MODEL.BATCH_SIZE, 
      '-t', CONFIG.MODEL.THREADS,     
      '--reasoning', CONFIG.MODEL.REASONING_MODE,
      '--log-disable', 
      '-n', CONFIG.MODEL.MAX_TOKENS,
      '-f', promptTmpPath1,
       '-o', finalTargetFilePath 
    ];

    console.log(`\n⚡ Running Pass 1: Pure data-driven state discovery...`);
    
    execFile(CONFIG.MODEL.EXEC_BINARY, execArgsPass1, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
      if (fs.existsSync(promptTmpPath1)) fs.unlinkSync(promptTmpPath1);
      if (error) return callback(error, null);

      let discoveredStatesMap = {};
      try {
       
        callback(null, finalTargetFilePath);
      } catch (parseErr) {
        console.warn("⚠️ JSON Extraction raw block mismatch, utilizing programmatic safety fallbacks.");
        discoveredStatesMap = {};
      }

      
    });
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
console.log(`\n📂 Reading Input 2: ${path.basename(actorsFilePath)}`);
console.log(`\n📂 Reading Input 3: ${path.basename(journeysFilePath)}`);
console.log(`\n📂 Reading Input 4: ${path.basename(topologyFilePath)}`);

const objectsMatrixContent = fs.readFileSync(objectsFilePath, 'utf8');
const actorsMatrixContent = fs.readFileSync(actorsFilePath, 'utf8');
const journeysMatrixContent = fs.readFileSync(journeysFilePath, 'utf8');
const topologyGraphContent = fs.readFileSync(topologyFilePath, 'utf8');

// Isolated string chunk safely extracted from matrix file metadata headers to prevent crash
const interimSegments = objectsMatrixContent.split('===');
const targetMetadataStr = interimSegments[1] ;

//const match = targetMetadataStr.match(/domain\s*:\s*(?<domain>.*?)\s*and\s*niche\s*:\s*(?<niche>.*?)\s*\$/m);
const match = targetMetadataStr.match(/domain\s*:\s*(?<domain>.*?)\s*and\s*niche\s*:\s*(?<niche>.*?)\s*$/);

if (match) {
  CONFIG.DOMAIN_CONTEXT = {
    NAME: match.groups.domain.trim(),
    NICHE: match.groups.niche.trim()
  };
} 

const cleanJsonArray1 = JSON.parse(objectsMatrixContent.slice(objectsMatrixContent.lastIndexOf('===') + 3).trim());
const cleanJsonArray2 = JSON.parse(actorsMatrixContent.slice(actorsMatrixContent.lastIndexOf('===') + 3).trim());
const cleanJsonArray3 = JSON.parse(  JSON.stringify(journeysMatrixContent.slice(journeysMatrixContent.lastIndexOf('===') + 3).trim()), null, 2) ;


let base ={
  business_obj:cleanJsonArray1,
  actors_resp:cleanJsonArray2,
  actorsjourney:cleanJsonArray3,
  topologyGraphContent:topologyGraphContent
}

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
const finalOutputPath = path.join(OUTPUT_DIR.replace("baseline/",""), `${CONFIG.PATHS.EXPORT_PREFIX}.${timestamp}.md`);

generateSemanticBlueprintAI(base, finalOutputPath, (err, targetSavedPath) => {
  if (err) {
    console.error("❌ CRITICAL_INFERENCE_ERROR: GGUF pipeline compilation failed:", err);
    process.exit(1);
  }
  let base = {
    a: targetSavedPath,
}
loadclean(base);
  console.log(`\n🎉 SUCCESS: Dynamic Business Lifecycle Specification compiled and saved via local 9B GGUF to: ${targetSavedPath}`);
});

function resolveLatestStageFile(directory, prefixPattern) {
  if (!fs.existsSync(directory)) return null;
  const files = fs.readdirSync(directory);
  const matchedFiles = files.filter(f => f.startsWith(prefixPattern));
  if (matchedFiles.length === 0) return null;

  matchedFiles.sort((a, b) => fs.statSync(path.join(directory, b)).mtimeMs - fs.statSync(path.join(directory, a)).mtimeMs);
  return path.join(directory, matchedFiles[0]);
}

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
            statement: `UPDATE NODE Step ${step} TO "${item.replacement_content}"`,
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