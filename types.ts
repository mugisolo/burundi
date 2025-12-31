
export interface OsintReport {
  sourceReliability: 'A - Completely Reliable' | 'B - Usually Reliable' | 'C - Fairly Reliable' | 'D - Not Usually Reliable' | 'E - Unreliable' | 'F - Cannot Be Judged';
  credibilityScore: number; // 0-100
  verifiedSources: string[];
  aiAnalysis: string;
  timeline: { time: string; event: string }[];
}

export interface Incident {
  id: string;
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  type: 'Violence' | 'Protest' | 'Arrest' | 'Intimidation' | 'Rally';
  fatalities: number;
  injuries: number;
  description: string;
  verified: boolean;
  osintReport?: OsintReport;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  district: string; // Used as Province in Burundi
  sentimentScore: number; 
  mentions: number;
  projectedVoteShare: number;
  imageUrl: string;
  notes?: string;
}

export interface ParliamentaryCandidate {
  id: string;
  name: string;
  constituency: string; // Used as Commune/Province in Burundi
  party: string;
  category: 'National Assembly' | 'Senate' | 'Special Interest';
  sentimentScore: number;
  projectedVoteShare: number;
  mentions: number;
  coordinates?: [number, number];
}

export interface PartyResult {
  party: string;
  percentage: number;
}

export interface ElectionTrend {
  year: number;
  winningParty: string;
  voteShare: number;
  turnout: number;
  margin: number;
  results: PartyResult[];
}

export interface CandidatePastResult {
  year: number;
  position: string;
  outcome: 'Won' | 'Lost' | 'Nominated';
  party: string;
  votes?: number;
}

export interface SocialMediaPoll {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  totalMentions: number;
  trendingTopics: string[];
}

export interface OSINTBackground {
  maritalStatus: string;
  education: string;
  lifestyle: string;
  controversies: string[];
  politicalAnalysis: string;
}

export interface NewsItem {
  headline: string;
  source: string;
  date: string;
  snippet: string;
}

export interface CampaignStrategy {
  latestNews: NewsItem[];
  keyChallenges: string[];
  winningStrategy: string;
  grandStrategy?: string;
}

export interface ConstituencyProfile {
  constituency: string;
  region: string;
  demographics: {
    totalPopulation: string;
    registeredVoters: string;
    youthPercentage: number;
    urbanizationRate: number;
  };
  socioEconomic: {
    primaryActivity: string;
    povertyIndex: string;
    literacyRate: number;
    accessToElectricity: number;
  };
  historical: {
    previousWinner: string;
    margin2021: string;
    voterTurnout: string;
    incumbentStatus: 'Open Seat' | 'Defended' | 'Contested';
  };
  electionTrend: ElectionTrend[];
  candidateHistory: CandidatePastResult[];
  socialMediaPoll: SocialMediaPoll;
  osintBackground: OSINTBackground;
  campaignStrategy: CampaignStrategy;
}

export interface PresidentialProfile {
  candidateName: string;
  party: string;
  nationalOverview: {
    totalRegisteredVoters: string;
    youthDemographic: string;
    keySwingRegions: string[];
    economicMood: string;
  };
  campaignStrategy: CampaignStrategy;
  osintBackground: OSINTBackground;
  socialPulse: SocialMediaPoll;
  politicalHistory: CandidatePastResult[];
  historicalPartyPerformance: ElectionTrend[];
  sources: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Country {
  name: string;
  region: 'Maghreb' | 'Sahel' | 'Great Lakes' | 'Horn of Africa' | 'West Africa' | 'Southern Africa' | 'Central Africa' | 'East Africa';
  stabilityIndex: 'Stable' | 'Fragile' | 'Failing' | 'Active Conflict';
  iso: string;
}

export interface CountrySitrep {
  country: string;
  politicalStability: string;
  militaryPosture: string;
  financialIntegrity: string;
  culturalDynamics: string;
  externalInfluences: {
    actor: string;
    footprint: string;
    objective: string;
  }[];
  strategicVerdict: string;
  forecast30d: string;
  sources: GroundingChunk[];
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  VIOLENCE_MAP = 'VIOLENCE_MAP',
  ELECTION_MAP = 'ELECTION_MAP',
  CABINET = 'CABINET',
  ANALYSIS = 'ANALYSIS',
  MP_ANALYTICS = 'MP_ANALYTICS',
  DAILY_OPED = 'DAILY_OPED',
  VIDEO_INTEL = 'VIDEO_INTEL',
  CONTINENTAL_LEDGER = 'CONTINENTAL_LEDGER'
}

export enum Language {
  ENGLISH = 'EN',
  FRENCH = 'FR',
  KIRUNDI = 'KR'
}
