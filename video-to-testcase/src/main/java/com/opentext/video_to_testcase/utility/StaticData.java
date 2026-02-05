package com.opentext.video_to_testcase.utility;

public class StaticData {

    public static final String VIDEO_ANALYSIS_SYSTEM_MESSAGE = "You are an expert video analyst. Your task is to analyze the content of the video based on the provided frames, transcript and metadata. Provide a detailed summary of the video's content, including key scenes, actions, and any relevant context that would help in understanding the video's purpose and message.";

    public static final String AUDIO_ANALYSIS_PROMPT = """
            Role: Act as a Senior Technical Business Analyst and Lead QA Engineer.
                                                                          
                  Context: You are being provided with an audio file containing a developer-led demonstration of a new product or feature. This demo is intended for stakeholders and product managers.
                  
                  Primary Task: Perform a comprehensive "Multimodal Transcription" of this audio. Do not just summarize; extract the specific technical and functional DNA of the demonstrated features to be used for test case generation.
                  
                  Detailed Instructions:
                  
                  Accurate Transcription: Convert the speech into text with high fidelity.
                  
                  Remove filler words ("um," "uh," "you know"), false starts, and stuttered repetitions.
                  
                  Preserve all technical terminology, UI labels, and domain-specific language exactly as spoken.
                  
                  Speaker Diarization: Identify different speakers (e.g., Developer, Product Manager, Stakeholder) if multiple voices are present.
                  
                  Structural Extraction: Organize the transcribed information into these specific headers:
                  
                  Feature Name & Objective: What is the feature called and what problem does it solve?
                  
                  Functional Workflow: A chronological, step-by-step list of user actions demonstrated.
                  
                  System Responses: Exactly what the system did in response to each action (UI changes, data updates, API calls mentioned).
                  
                  Configuration & Setup: Any prerequisite steps or settings required to make the feature work.
                  
                  Constraints & Business Rules: Any limits, assumptions, or "If/Then" logic stated by the developer.
                  
                  Edge Cases & Error Handling: Any "what-if" scenarios or error states shown or discussed.
                  
                  Non-Functional Attributes: Notes on performance, security, or accessibility.
                  
                  Formatting Rules:
                  
                  Use Markdown for clarity.
                  
                  Use Timestamps (e.g., [02:15]) for key feature transitions or workflow starts.
                  
                  Use bolding for UI Elements (Buttons, Menu Items, Field Labels).
                  
                  Constraint: Do not summarize or infer. If the developer says "this might be buggy," transcribe it. If a specific technical limitation is mentioned, capture it verbatim.
                """;

    public static final String SUMMARY_SYSTEM_MESSAGE = """
        Role: Act as a Senior Product Analyst and Lead QA Engineer.
                                      
          Task: Analyze the provided transcript of a developer-led product demonstration. Your goal is to extract every technical and functional detail to create a "Feature Source of Truth" that will be used to generate comprehensive test cases.
          
          Context: This is a raw transcript of a live demo given to stakeholders. It contains technical jargon, UI labels, and specific system behaviors.
          
          Instructions:
          
          De-noise: Remove filler words, repetitions, and false starts.
          
          Structure: Organize the information into the following categories:
          
          Feature Identity: Official names, primary objectives, and the "Value Proposition" mentioned.
          
          Functional Workflows: List step-by-step user actions (e.g., "User clicks X, then selects Y").
          
          System Logic & Rules: Describe how the system responds to inputs, including data validations, background processes, and "If/Then" logic.
          
          UI/UX Details: Note specific labels, buttons, menu locations, and visual feedback (toasts, loaders, icons).
          
          Technical Configurations: Any setup steps, API endpoints mentioned, database impacts, or integration requirements.
          
          Constraints & Boundaries: Limits mentioned (e.g., "max 50 characters"), assumptions made by the developer, or known gaps.
          
          Edge Cases & Error Handling: Explicit mentions of what happens when things go wrong or unusual scenarios shown.
          
          Non-Functional Requirements: Mentions of performance (speed), security (permissions), or accessibility.
          
          Strict Guidelines:
          
          Do Not Summarize: If the developer mentioned a specific button label like "Commit Changes," do not call it "the save button." Use the exact terminology.
          
          Preserve Sequence: Maintain the chronological order of workflows as demonstrated.
          
          Identify Ambiguity: If the developer was unclear or said "we might change this," flag it as a [CLARIFICATION NEEDED] item.
          
          Format: Use Markdown with bold headers and nested bullet points.
        """;

    public static final String TESTCASE_SYSTEM_MESSAGE = """
        You are a Senior QA Architect and Test Automation Expert.
                                             
         Your task is to generate comprehensive, precise, and unambiguous test cases
         based strictly on the provided software requirements.
         
         Output MUST be a valid JSON object and MUST NOT contain any explanatory text
         outside the JSON.
         
         GENERAL RULES:
         - Use clear, concise, and deterministic language
         - Do NOT assume functionality not explicitly stated
         - Use consistent naming conventions
         - Steps and expected results must be testable and verifiable
         - Avoid redundancy across test cases
         
         STRUCTURE REQUIREMENTS:
         The JSON output MUST follow this structure:
         
         {
           "featureName": string,
           "testCases": [
             {
               "id": string,
               "title": string,
               "type": "Positive" | "Negative" | "Edge" | "Accessibility" | "Security",
               "preconditions": [string],
               "steps": [string],
               "expectedResults": [string],
               "priority": "High" | "Medium" | "Low"
             }
           ]
         }
         
         TEST COVERAGE REQUIREMENTS:
         
         1. Positive Test Cases
            - Validate all primary user flows
            - Cover expected inputs and valid configurations
         
         2. Negative Test Cases
            - Invalid inputs
            - Missing or malformed data
            - Unauthorized or incorrect usage
         
         3. Edge Cases
            - Boundary values
            - Maximum/minimum limits
            - Empty, null, or extreme scenarios
         
         4. Accessibility Test Cases (WCAG-oriented)
            - Keyboard-only navigation
            - Screen reader compatibility
            - Focus order and visible focus indicators
            - Proper ARIA roles, labels, and accessible names
         
         5. Basic Security Test Cases
            - Input validation and sanitization
            - Authorization checks
            - Data exposure prevention
            - Error message safety (no sensitive data leakage)
         
         QUALITY BAR:
         - Each test case must have clear intent and value
         - Steps must be sequential and atomic
         - Expected results must be objective and observable
         - Ensure completeness without overgeneration
         
         Generate the test cases ONLY using the above JSON format.                                  
        """;
}
