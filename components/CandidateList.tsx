
import React, { useRef, useState, useEffect } from 'react';
import { Candidate, PresidentialProfile, Language } from '../types';
import { analyzePresidentialCandidate } from '../services/geminiService';
import { 
  TrendingUp, TrendingDown, MessageCircle, X, Globe, 
  FileText, ExternalLink, Newspaper, BrainCircuit, 
  Lock, Target, Crosshair, Heart, GraduationCap, 
  AlertTriangle, Activity, History, Plus, Upload, Trash2, Shield, Search, Download
} from 'lucide-react';

interface CandidateListProps {
  candidates: Candidate[];
  onUpdateCandidates?: (candidates: Candidate[]) => void;
  language?: Language;
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates, onUpdateCandidates, language = Language.FRENCH }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [profile, setProfile] = useState<PresidentialProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    [Language.ENGLISH]: {
      title: 'Cabinet Leadership Metrics',
      subtitle: "Forensic sentiment and influence monitoring for Burundi's top executive core.",
      search: 'Search members...',
      hMember: 'Cabinet Member',
      hParty: 'Affiliation',
      hSentiment: 'OSINT Sentiment',
      hInfluence: 'Influence Share',
      hMentions: 'Mentions',
      analysisLoading: 'Mugi-Solo is conducting deep forensic network analysis...',
      strategicVerdict: 'Mugi-Solo Strategic Verdict',
      provBase: 'Provincial Stronghold',
      socialPulse: '90-Day Social Pulse',
      osintBg: 'Biographical Intelligence'
    },
    [Language.FRENCH]: {
      title: 'Suivi du Cabinet et du Leadership',
      subtitle: "Mesures de sentiment et d'influence pour la haute direction du Burundi.",
      search: 'Rechercher...',
      hMember: 'Membre du Cabinet',
      hParty: 'Parti & Province',
      hSentiment: 'Sentiment',
      hInfluence: 'Influence',
      hMentions: 'Mentions',
      analysisLoading: "Mugi-Solo effectue une analyse forensique des réseaux...",
      strategicVerdict: 'Verdict Stratégique Mugi-Solo',
      provBase: 'Base de Province',
      socialPulse: 'Social Pulse',
      osintBg: 'Intelligence Biographique'
    },
    [Language.KIRUNDI]: {
      title: 'Ibihuha n\'ibikorwa vy\'abashikiranganji',
      subtitle: "Uko abantu babona abashikiranganji n'ubukomezi bwabo.",
      search: 'Rondera...',
      hMember: 'Umushikiranganji',
      hParty: 'Umugambwe n\'Intara',
      hSentiment: 'Uko ashimiwe',
      hInfluence: 'Ubukomezi',
      hMentions: 'Amakuru',
      analysisLoading: 'Mugi-Solo ariko araraba neza mu mateka...',
      strategicVerdict: 'Icemezo ca Mugi-Solo',
      provBase: 'Intara akomokamwo',
      socialPulse: 'Uko avugwa',
      osintBg: 'Amakuru y\'idini'
    }
  }[language];

  const filteredCandidates = candidates.filter(candidate => {
    const term = searchTerm.toLowerCase();
    return candidate.name.toLowerCase().includes(term) || candidate.party.toLowerCase().includes(term);
  });

  const handleRowClick = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setProfile(null);
    setLoading(true);
    try {
      const result = await analyzePresidentialCandidate(candidate.name, candidate.party, language);
      if (result) {
        setProfile(result);
      }
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  const cleanText = (text: string) => {
    if (!text) return "";
    return text.replace(/[\*#\[\]]/g, '').trim();
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden relative">
      <div className="p-8 border-b border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">{t.title}</h3>
           <p className="text-slate-400 text-sm mt-1">{t.subtitle}</p>
        </div>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
           <input 
              type="text" 
              placeholder={t.search} 
              className="bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500 transition-all" 
              value={searchTerm} 
              onChange={(e)=>setSearchTerm(e.target.value)} 
            />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="p-6">{t.hMember}</th>
              <th className="p-6">{t.hParty}</th>
              <th className="p-6">{t.hSentiment}</th>
              <th className="p-6">{t.hInfluence}</th>
              <th className="p-6">{t.hMentions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id} onClick={() => handleRowClick(candidate)} className="hover:bg-slate-700/30 transition-colors cursor-pointer group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={candidate.imageUrl} alt={candidate.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 group-hover:border-red-500 transition-colors" />
                    <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{candidate.name}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="text-slate-200 font-bold">{candidate.party}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{candidate.district}</div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full w-24 overflow-hidden">
                      <div className={`h-full rounded-full ${candidate.sentimentScore > 60 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${candidate.sentimentScore}%` }}></div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{candidate.sentimentScore}%</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center text-slate-200 font-bold">
                    {candidate.projectedVoteShare}%
                    <TrendingUp size={14} className="ml-2 text-green-500" />
                  </div>
                </td>
                <td className="p-6 text-slate-500 text-xs font-mono">
                   <MessageCircle size={14} className="inline mr-1 opacity-50" /> {candidate.mentions.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCandidate && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]" onClick={() => setSelectedCandidate(null)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[650px] bg-slate-900 border-l border-slate-700 shadow-2xl z-[101] overflow-y-auto animate-in slide-in-from-right p-10">
              <div className="flex justify-between items-center mb-10">
                 <div className="flex items-center gap-6">
                    <img src={selectedCandidate.imageUrl} className="w-24 h-24 rounded-2xl object-cover shadow-2xl border-4 border-slate-800" />
                    <div>
                       <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{selectedCandidate.name}</h2>
                       <p className="text-red-500 uppercase font-black text-xs tracking-[0.2em]">{selectedCandidate.party} // Burundi Executive Node</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedCandidate(null)} className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full"><X size={24}/></button>
              </div>

              {loading ? (
                 <div className="py-32 text-center flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-slate-800 border-t-red-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium italic">{t.analysisLoading}</p>
                 </div>
              ) : profile ? (
                 <div className="space-y-10 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl relative overflow-hidden shadow-2xl border-l-8 border-red-600">
                       <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                          <BrainCircuit size={14}/> {t.strategicVerdict}
                       </h4>
                       <p className="text-slate-900 text-xl italic font-serif leading-relaxed font-bold">
                          "{cleanText(profile?.campaignStrategy?.grandStrategy || profile?.campaignStrategy?.winningStrategy || "Analysis pending.")}"
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{t.provBase}</h5>
                          <p className="text-white font-bold text-lg">{selectedCandidate.district}</p>
                       </div>
                       <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{t.socialPulse}</h5>
                          <p className="text-white font-bold text-lg">{profile?.socialPulse?.totalMentions || 0} Mentions</p>
                       </div>
                    </div>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                       <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" /> {t.osintBg}
                       </h4>
                       <div className="prose prose-invert prose-sm max-w-none">
                          <p className="text-slate-300 leading-relaxed font-serif italic text-base">
                            {cleanText(profile?.osintBackground?.politicalAnalysis || "Deeper biographical analysis pending.")}
                          </p>
                       </div>
                    </div>

                    {profile.sources && profile.sources.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified Grounding Sources</h4>
                        <div className="space-y-2">
                          {profile.sources.map((src, i) => (
                            <a key={i} href={src.web?.uri} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-red-500/50 transition-all group">
                              <span className="text-xs text-slate-300 group-hover:text-red-400 truncate pr-4">{src.web?.title}</span>
                              <ExternalLink size={12} className="text-slate-500 group-hover:text-red-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
              ) : null}
          </div>
        </>
      )}
    </div>
  );
};
