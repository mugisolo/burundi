
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
      title: 'Cabinet & Leadership Tracker',
      subtitle: "Sentiment and influence metrics for Burundi's top executive leadership.",
      search: 'Search...',
      hMember: 'Cabinet Member',
      hParty: 'Party & Province',
      hSentiment: 'Sentiment',
      hInfluence: 'Influence',
      hMentions: 'Mentions',
      analysisLoading: 'Mugi-Solo is synthesizing historical strategies...',
      strategicVerdict: 'Mugi-Solo Strategic Verdict',
      provBase: 'Province Base',
      socialPulse: 'Social Pulse',
      osintBg: 'OSINT Background'
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
      analysisLoading: "Mugi-Solo synthétise les stratégies historiques...",
      strategicVerdict: 'Verdict Stratégique Mugi-Solo',
      provBase: 'Base de Province',
      socialPulse: 'Social Pulse',
      osintBg: 'OSINT Background'
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
      setProfile(result);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden relative">
      <div className="p-8 border-b border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h3 className="text-xl font-semibold text-white">{t.title}</h3>
           <p className="text-slate-400 text-base mt-1">{t.subtitle}</p>
        </div>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
           <input type="text" placeholder={t.search} className="bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-6 font-medium">{t.hMember}</th>
              <th className="p-6 font-medium">{t.hParty}</th>
              <th className="p-6 font-medium">{t.hSentiment}</th>
              <th className="p-6 font-medium">{t.hInfluence}</th>
              <th className="p-6 font-medium">{t.hMentions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id} onClick={() => handleRowClick(candidate)} className="hover:bg-slate-700/30 transition-colors cursor-pointer group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={candidate.imageUrl} alt={candidate.name} className="w-12 h-12 rounded-full object-cover border border-slate-600" />
                    <span className="font-medium text-slate-200 group-hover:text-red-400 transition-colors">{candidate.name}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="text-slate-200 font-semibold">{candidate.party}</div>
                  <div className="text-xs text-slate-500 uppercase">{candidate.district}</div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full w-24 overflow-hidden">
                      <div className={`h-full rounded-full ${candidate.sentimentScore > 60 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${candidate.sentimentScore}%` }}></div>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{candidate.sentimentScore}%</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center text-slate-200 font-medium">
                    {candidate.projectedVoteShare}%
                    <TrendingUp size={16} className="ml-2 text-green-500" />
                  </div>
                </td>
                <td className="p-6 text-slate-400 text-sm">
                   <MessageCircle size={14} className="inline mr-2" /> {candidate.mentions.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCandidate && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setSelectedCandidate(null)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[750px] bg-slate-900 border-l border-slate-700 shadow-2xl z-[101] overflow-y-auto animate-in slide-in-from-right p-8">
              <div className="flex justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <img src={selectedCandidate.imageUrl} className="w-20 h-20 rounded-xl object-cover" />
                    <div>
                       <h2 className="text-2xl font-bold text-white">{selectedCandidate.name}</h2>
                       <p className="text-red-400 uppercase font-bold text-xs tracking-widest">{selectedCandidate.party} • Burundi Executive</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-white"><X size={28}/></button>
              </div>

              {loading ? (
                 <div className="py-20 text-center flex flex-col items-center">
                    <BrainCircuit className="animate-spin text-red-500 mb-4" size={40} />
                    <p className="text-slate-400">{t.analysisLoading}</p>
                 </div>
              ) : profile ? (
                 <div className="space-y-8 animate-fade-in">
                    <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-xl relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                       <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2"><BrainCircuit size={14}/> {t.strategicVerdict}</h4>
                       <p className="text-slate-200 text-lg italic font-serif leading-relaxed">
                          "{profile?.campaignStrategy?.grandStrategy || profile?.campaignStrategy?.winningStrategy || "Strategic synthesis undergoing forensic verification."}"
                       </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">{t.provBase}</h5>
                          <p className="text-white font-bold">{selectedCandidate.district}</p>
                       </div>
                       <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">{t.socialPulse}</h5>
                          <p className="text-white font-bold">{profile?.socialPulse?.totalMentions || 0} Mentions</p>
                       </div>
                    </div>
                    <div className="border-t border-slate-800 pt-6">
                       <h4 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2"><FileText size={16}/> {t.osintBg}</h4>
                       <div className="prose prose-invert prose-sm">
                          <p className="text-slate-400 leading-relaxed">
                            {profile?.osintBackground?.politicalAnalysis || "Deeper biographical analysis pending verification."}
                          </p>
                       </div>
                    </div>
                 </div>
              ) : null}
          </div>
        </>
      )}
    </div>
  );
};
