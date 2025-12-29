
import { GoogleGenAI } from "@google/genai";
import { GroundingChunk, PresidentialProfile, Incident, Candidate, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getMugiSoloDirective = (lang: Language = Language.FRENCH) => `
You are Mugi-Solo, the advanced AI Intelligence Core of Salus International, specializing in the Republic of Burundi and the East African Community (EAC).

CURRENT DATE: ${new Date().toISOString().split('T')[0]}
MANDATE: Analyze Burundi's political and security landscape for the 2024-2025 period.
STRICT DATA CONSTRAINT: You MUST use the Google Search tool to find real-time data from the LAST 90 DAYS.

CURRENT OUTPUT LANGUAGE: ${lang === Language.KIRUNDI ? 'Kirundi' : lang === Language.ENGLISH ? 'English' : 'French'}.
ALWAYS respond in the requested language for all narrative fields.

THE COUNCIL OF STRATEGISTS (IDEOLOGICAL ENGINE):
Synthesize ideologies from: Sun Tzu, Machiavelli, Clausewitz, or Napoleon.

INTERNAL KNOWLEDGE:
- PNB, SNR, FDN jurisdictional bounds.
- EAC regional friction (Burundi-Rwanda-DRC).

FORMATTING RULES (STRICT):
1. NO ASTERISKS (*). Use plain text.
2. NO HASHES (#).
3. USE DOUBLE NEWLINES for paragraph breaks.
4. RETURN VALID JSON ONLY.
`;

const parseJSON = (text: string): any => {
  if (!text) return null;
  try {
    let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
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
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Mugi-Solo JSON Parse Error:", error);
    return null;
  }
};

export const generateDeepMindAnalysis = async (query: string, lang?: Language): Promise<any | null> => {
  const prompt = `${getMugiSoloDirective(lang)}
    COMMAND: Generate a 2500+ word academic-grade Strategic Dissertation.
    QUERY: "${query}"
    REQUIRED JSON STRUCTURE: { title, executiveSummary, strategicSynthesis, councilVoices: [{strategist, quote, application}], conclusion }.
    STRICT: Use the search tool to find current 2024/2025 context.`;
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

export const generateDailyOpEd = async (incidentsSummary: string, candidatePerformanceSummary: string, dateRange?: string, lang?: Language): Promise<any> => {
  const prompt = `${getMugiSoloDirective(lang)}
    COMMAND: Write a 2-PAGE EXHAUSTIVE STRATEGIC BRIEFING.
    Context: ${incidentsSummary}. Leaders: ${candidatePerformanceSummary}.
    REQUIRED JSON STRUCTURE: { title, content, keyTakeaways: [] }.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 32768 } }
    });
    return parseJSON(response.text);
  } catch (error) { return null; }
};

export const fetchRecentIncidents = async (lang?: Language): Promise<Incident[]> => {
  const prompt = `${getMugiSoloDirective(lang)} 
    COMMAND: Search for latest political/security incidents in BURUNDI (last 90 days). 
    Return a JSON array of Incident objects.`;
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
    COMMAND: Search for real-time (last 90 days) popularity and sentiment stats for: ${JSON.stringify(candidates.map(c => c.name))}.
    Return JSON array: [{ name, sentimentScore, mentions, projectedVoteShare }].`;
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
    You MUST search for activity from late 2024 and 2025. 
    REQUIRED JSON STRUCTURE: {
      candidateName, 
      party, 
      campaignStrategy: { grandStrategy, winningStrategy }, 
      osintBackground: { politicalAnalysis, controversies: [], lifestyle, education }, 
      socialPulse: { totalMentions, sentiment: { positive, neutral, negative } }
    }
    DO NOT leave these fields empty. If exact data isn't found, use search tool to infer from 2024 regional reports.`;
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
    Search for 2024/2025 local news in that province.
    REQUIRED JSON STRUCTURE: { grandStrategy, sitRep }.`;
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
    REQUIRED JSON STRUCTURE: { analysis, threats: [], observedActors: [], conclusion, verifiedSources: [{title, uri}] }.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 32768 } }
    });
    return parseJSON(response.text);
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
