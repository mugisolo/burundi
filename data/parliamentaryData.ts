import { ParliamentaryCandidate, ConstituencyProfile, ElectionTrend, CandidatePastResult } from '../types';

const PROVINCE_COORDS: Record<string, [number, number]> = {
  'Gitega': [-3.4283, 29.9246], 'Bujumbura Mairie': [-3.3822, 29.3644], 'Bujumbura Rural': [-3.4735, 29.4148],
  'Ngozi': [-2.9077, 29.8306], 'Muyinga': [-2.8519, 30.3414], 'Kayanza': [-2.9231, 29.6278],
  'Rumonge': [-3.9736, 29.4386], 'Makamba': [-4.1333, 29.8000], 'Bururi': [-3.9483, 29.6244],
  'Rutana': [-3.9261, 30.0019], 'Ruyigi': [-3.4764, 30.2486], 'Cankuzo': [-3.2181, 30.4528],
  'Kirundo': [-2.5833, 30.1000], 'Karuzi': [-3.1014, 30.1614], 'Bubanza': [-3.0804, 29.3911],
  'Cibitoke': [-2.8872, 29.1246], 'Muramvya': [-3.2683, 29.6078], 'Mwaro': [-3.5042, 29.7033]
};

const RAW_CANDIDATES: Omit<ParliamentaryCandidate, 'sentimentScore' | 'projectedVoteShare' | 'mentions' | 'coordinates'>[] = [
  { id: 'p1', name: 'Gélase Daniel Ndabirabe', constituency: 'Kayanza', party: 'CNDD-FDD', category: 'National Assembly' }, // Speaker
  { id: 'p2', name: 'Agathon Rwasa', constituency: 'Ngozi', party: 'CNL', category: 'National Assembly' }, // Opposition leader
  { id: 'p3', name: 'Sabine Ntakarutimana', constituency: 'Muyinga', party: 'CNDD-FDD', category: 'National Assembly' },
  { id: 'p4', name: 'Emmanuel Sinzohagera', constituency: 'Bujumbura Rural', party: 'CNDD-FDD', category: 'Senate' }, // Senate President
  { id: 'p5', name: 'Denise Nkurunziza', constituency: 'Ngozi', party: 'CNDD-FDD', category: 'National Assembly' },
  { id: 'p6', name: 'Abel Gashatsi', constituency: 'Muramvya', party: 'UPRONA', category: 'National Assembly' },
  { id: 'p7', name: 'Évariste Ndayishimiye', constituency: 'Gitega', party: 'CNDD-FDD', category: 'National Assembly' },
  { id: 'p8', name: 'Gervais Ndirakobuca', constituency: 'Bubanza', party: 'CNDD-FDD', category: 'National Assembly' },
];

export const PARLIAMENTARY_DATA: ParliamentaryCandidate[] = RAW_CANDIDATES.map(c => ({
    ...c,
    sentimentScore: Math.floor(Math.random() * 40) + 50,
    projectedVoteShare: Math.floor(Math.random() * 50) + 15,
    mentions: Math.floor(Math.random() * 5000) + 500,
    coordinates: PROVINCE_COORDS[c.constituency as keyof typeof PROVINCE_COORDS] || [-3.4, 29.9]
}));

export const getConstituencyProfile = (constituency: string, candidateName?: string, candidateParty?: string): ConstituencyProfile => {
  return {
    constituency,
    region: 'Burundi EAC Hub',
    demographics: {
      totalPopulation: '13,200,000',
      registeredVoters: '5,100,000',
      youthPercentage: 68,
      urbanizationRate: 15
    },
    socioEconomic: {
      primaryActivity: 'Coffee, Tea, Nickel Mining',
      povertyIndex: '65%',
      literacyRate: 72,
      accessToElectricity: 12
    },
    historical: {
      previousWinner: 'CNDD-FDD',
      margin2021: '12%',
      voterTurnout: '84%',
      incumbentStatus: 'Defended'
    },
    electionTrend: [
      { year: 2015, winningParty: 'CNDD-FDD', voteShare: 69, turnout: 73, margin: 50, results: [{party:'CNDD-FDD', percentage:69}] },
      { year: 2020, winningParty: 'CNDD-FDD', voteShare: 68, turnout: 87, margin: 44, results: [{party:'CNDD-FDD', percentage:68}, {party:'CNL', percentage:24}] }
    ],
    candidateHistory: [],
    socialMediaPoll: {
        sentiment: { positive: 48, neutral: 32, negative: 20 },
        totalMentions: 4200,
        trendingTopics: ['Economic Stability', 'Food Security', 'Border Policy']
    },
    osintBackground: {
        maritalStatus: 'Married',
        education: 'University of Burundi',
        lifestyle: 'Grassroots/Military Background',
        controversies: ['Security apparatus ties'],
        politicalAnalysis: 'Strong leverage over local colline administrators.'
    },
    campaignStrategy: {
        latestNews: [],
        keyChallenges: ['Inflation', 'Youth Unemployment'],
        winningStrategy: 'Strengthening colline-level security and local production.'
    }
  };
};