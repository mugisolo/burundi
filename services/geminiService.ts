
import { GoogleGenAI } from "@google/genai";
import { GroundingChunk, PresidentialProfile, Incident, Candidate, Language, CountrySitrep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getMugiSoloDirective = (lang: Language = Language.FRENCH) => `
You are Mugi-Solo, the advanced AI Intelligence Core of Salus International, specializing in the Republic of Burundi and the East African Community (EAC).

CURRENT DATE: ${new Date().toISOString().split('T')[0]}
MANDATE: Analyze Burundi's political and security landscape for the 2024-2025 period.
STRICT DATA CONSTRAINT: You MUST use the Google Search tool to find real-time data from the LAST 90 DAYS. 

CRITICAL RULE: NEVER RETURN PLACEHOLDERS like "[UNDEFINED]", "analysis pending", or "verification ongoing". 
If specific data is missing, provide a logical strategic synthesis based on the broader 2024 regional context.
ALWAYS RETURN VALID JSON ONLY when requested. If you cannot find data, return an object with empty strings or empty arrays, NOT an error string.

CURRENT OUTPUT LANGUAGE: ${lang === Language.KIRUNDI ? 'Kirundi' : lang === Language.ENGLISH ? 'English' : 'French'}.
ALWAYS respond in the requested language for all narrative fields.

THE COUNCIL OF STRATEGISTS:
Synthesize ideologies from: Sun Tzu, Machiavelli, Clausewitz, or Napoleon.

FORMATTING RULES (ABSOLUTE STRICTURE):
1. NO ASTERISKS (*).
2. NO HASHES (#).
3. NO BRACKETS ([ or ]).
4. USE ALL CAPS for headers and sub-headers.
5. USE PLAIN TEXT CAPITALIZATION for emphasis.
6. USE DOUBLE NEWLINES between every paragraph and section.
7. FOR LISTS: Use simple dashes (-) or plain numbering (1.).
`;

const parseJSON = (text: string): any => {
  if (!text) return null;
  try {
    let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    if (clean.toUpperCase().includes("UNDEFINED") && !clean.includes("{")) return null;
    const firstBrace = clean.indexOf('{');
    const firstBracket = clean.indexOf('[');
    let jsonStr = "";
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        const lastBrace = clean.lastIndexOf('}');
        if (lastBrace > firstBrace) jsonStr = clean.substring(firstBrace, lastBrace + 1);
    } else if (firstBracket !== -1) {
        const lastBracket = clean.lastIndexOf(']');
        if (lastBracket > firstBracket) jsonStr = clean.substring(firstBracket, lastBracket + 1);
    }
    if (!jsonStr) {
      if (clean.startsWith('{') || clean.startsWith('[')) jsonStr = clean;
      else return null;
    }
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        return null;
    }
  } catch (error) {
    console.error("Mugi-Solo JSON Parse Error:", error);
    return null;
  }
};

export const generateDeepMindAnalysis = async (query: string, lang?: Language): Promise<any | null> => {
  const prompt = `${getMugiSoloDirective(lang)}
    COMMAND: Generate a 2500+ word academic-grade Strategic Dissertation.
    QUERY: "${query}"
    REQUIRED JSON STRUCTURE: { "title": "...", "executiveSummary": "...", "strategicSynthesis": "...", "councilVoices": [{"strategist": "...", "quote": "...", "application": "..."}], "conclusion": "..." }.
    STRICT: Return valid JSON. Use the search tool to find current 2024/2025 context.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 } 
      }
    });
    return parseJSON(response.text);
  } catch (error) { return null; }
};

export const generateDailyOpEd = async (incidentsSummary: string, candidatePerformanceSummary: string, dateRangeDescription: string, lang?: Language): Promise<any> => {
  const prompt = `${getMugiSoloDirective(lang)}
    COMMAND: Write a 2-PAGE EXHAUSTIVE STRATEGIC BRIEFING for the period: ${dateRangeDescription}.
    INCIDENTS TO ANALYZE: ${incidentsSummary}.
    LEADERSHIP METRICS: ${candidatePerformanceSummary}.
    REQUIRED JSON STRUCTURE: { "title": "...", "content": "...", "keyTakeaways": ["...", "..."] }.
    STRICT: Use the Search tool to verify regional dynamics specifically for this date range. No placeholders.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 } 
      }
    });
    return parseJSON(response.text);
  } catch (error) { return null; }
};

export const fetchRecentIncidents = async (lang?: Language): Promise<Incident[]> => {
  const prompt = `${getMugiSoloDirective(lang)} 
    COMMAND: Search for latest political/security incidents in BURUNDI (last 90 days). 
    Return a JSON array of Incident objects. Use Search Tool.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    return parseJSON(response.text) || [];
  } catch (error) { return []; }
};

export const fetchLiveCandidateStats = async (candidates: Candidate[], lang?: Language): Promise<Partial<Candidate>[]> => {
  const prompt = `${getMugiSoloDirective(lang)} 
    COMMAND: Search for real-time (last 90 days) stats for these Burundi leaders: ${JSON.stringify(candidates.map(c => c.name))}.
    Return JSON array: [{ "name": "...", "sentimentScore": 0-100, "mentions": number, "projectedVoteShare": 0-100 }].`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 32768 } }
    });
    return parseJSON(response.text) || [];
  } catch (error) { return []; }
};

export const analyzePresidentialCandidate = async (name: string, party: string, lang?: Language): Promise<PresidentialProfile | null> => {
  const prompt = `${getMugiSoloDirective(lang)} 
    COMMAND: Conduct deep forensic OSINT on the Burundian leader ${name} (${party}). 
    You MUST search for activity and mentions from late 2024 and 2025. 
    REQUIRED JSON STRUCTURE: {
      "candidateName": "...", 
      "party": "...", 
      "campaignStrategy": { "grandStrategy": "...", "winningStrategy": "..." }, 
      "osintBackground": { "politicalAnalysis": "...", "controversies": [], "lifestyle": "...", "education": "..." }, 
      "socialPulse": { "totalMentions": 0, "sentiment": { "positive": 0, "neutral": 0, "negative": 0 } }
    }`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }], 
        thinkingConfig: { thinkingBudget: 32768 } 
      }
    });
    const data = parseJSON(response.text);
    if (!data) return null;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { ...data, sources: chunks.map((c: any) => ({ web: c.web ? { uri: c.web.uri, title: c.web.title } : undefined })).filter((c:any) => c.web) };
  } catch (error) { return null; }
};

export const generatePoliticalStrategy = async (candidateName: string, party: string, constituency: string, contextData: string, lang?: Language): Promise<{ grandStrategy: string; sitRep: string } | null> => {
  const prompt = `${getMugiSoloDirective(lang)} 
    COMMAND: Strategy for MP ${candidateName} in ${constituency}. 
    REQUIRED JSON STRUCTURE: { "grandStrategy": "...", "sitRep": "..." }.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 } 
      }
    });
    return parseJSON(response.text);
  } catch (error) { return null; }
};

export const analyzeSecurityVideo = async (videoUrl: string, lang?: Language): Promise<any | null> => {
  const prompt = `${getMugiSoloDirective(lang)}
    COMMAND: Forensic analysis of security feed: "${videoUrl}". 
    REQUIRED JSON STRUCTURE: { "analysis": "...", "threats": [], "observedActors": [], "conclusion": "...", "verifiedSources": [{"title": "...", "uri": "..."}] }.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 32768 } }
    });
    const data = parseJSON(response.text);
    if (!data) return null;
    
    // Merge grounding chunks with the model's reported sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSources = chunks.map((c: any) => ({ title: c.web?.title || 'Grounding Source', uri: c.web?.uri })).filter((c: any) => c.uri);
    
    return { 
      ...data, 
      verifiedSources: [...(data.verifiedSources || []), ...groundingSources] 
    };
  } catch (error) { return null; }
};

export const generateCountrySitrep = async (countryName: string, lang?: Language): Promise<CountrySitrep | null> => {
  const prompt = `${getMugiSoloDirective(lang)}
    COMMAND: GENERATE NATION-STATE STRATEGIC DEEP SITREP FOR: ${countryName}.
    MANDATE: Analyze 2024-2025 landscape across Political Stability, Military Posture, Financial Integrity (illicit flows), and Tribal Dynamics.
    TRACK: External influences (Wagner, China, US, EU).
    REQUIRED JSON STRUCTURE: {
      "country": "${countryName}",
      "politicalStability": "...",
      "militaryPosture": "...",
      "financialIntegrity": "...",
      "culturalDynamics": "...",
      "externalInfluences": [{"actor": "...", "footprint": "...", "objective": "..."}],
      "strategicVerdict": "...",
      "forecast30d": "..."
    }`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 } 
      }
    });
    const data = parseJSON(response.text);
    if (!data) return null;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { 
      ...data, 
      sources: chunks.map((c: any) => ({ web: c.web ? { uri: c.web.uri, title: c.web.title } : undefined })).filter((c:any) => c.web) 
    };
  } catch (error) { return null; }
};

export const chatWithAnalyst = async (history: any[], message: string, lang?: Language) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: { tools: [{ googleSearch: {} }], systemInstruction: getMugiSoloDirective(lang), thinkingConfig: { thinkingBudget: 32768 } }
    });
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) { return "Information blackout."; }
};
