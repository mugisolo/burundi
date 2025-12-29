
import React, { useState, useMemo, useRef } from 'react';
import { ParliamentaryCandidate, ConstituencyProfile, Language } from '../types';
import { getConstituencyProfile } from '../data/parliamentaryData';
import { generatePoliticalStrategy } from '../services/geminiService';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { 
  Search, Users, Filter, Briefcase, UserCheck, X, TrendingUp, Activity, 
  BookOpen, History, Award, MessageCircle, Zap, FileText, AlertTriangle, 
  GraduationCap, Heart, Newspaper, Target, Crosshair, TrendingDown, 
  BrainCircuit, Sparkles, Lock, Plus, Upload, Trash2, Shield
} from 'lucide-react';

interface ParliamentaryAnalyticsProps {
  candidates: ParliamentaryCandidate[];
  onUpdateCandidates: (candidates: ParliamentaryCandidate[]) => void;
  language?: Language;
}

export const ParliamentaryAnalytics: React.FC<ParliamentaryAnalyticsProps> = ({ candidates, onUpdateCandidates, language = Language.FRENCH }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParty, setFilterParty] = useState<string>('All');
  const [selectedCandidate, setSelectedCandidate] = useState<ParliamentaryCandidate | null>(null);
  const [profile, setProfile] = useState<ConstituencyProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  const t = {
    [Language.ENGLISH]: {
      tracked: 'Tracked Members',
      subtitle: 'National Assembly & Senate',
      majParty: 'Majority Party',
      majSub: 'Dominant Representation',
      stab: 'Sentiment Stability',
      stabSub: 'Burundi National Average',
      tableTitle: 'Member of Parliament Analysis',
      search: 'Search province/name...',
      allParties: 'All Parties',
      hMember: 'Member',
      hProvince: 'Province',
      hParty: 'Party',
      hSentiment: 'Sentiment',
      hInfluence: 'Influence',
      loading: 'Synthesizing Strategic Intelligence...',
      stratReport: 'Strategic Report',
      sitrep: 'MP SITREP'
    },
    [Language.FRENCH]: {
      tracked: 'Membres trackés',
      subtitle: 'Assemblée Nationale et Sénat',
      majParty: 'Parti majoritaire',
      majSub: 'Représentation dominante',
      stab: 'Stabilité Sentiment',
      stabSub: 'Moyenne nationale Burundi',
      tableTitle: 'Analyse des membres du Parlement',
      search: 'Rechercher province/nom...',
      allParties: 'Tous les partis',
      hMember: 'Membre',
      hProvince: 'Province',
      hParty: 'Parti',
      hSentiment: 'Sentiment',
      hInfluence: 'Influence',
      loading: 'Synthèse de l\'intelligence stratégique...',
      stratReport: 'Rapport Stratégique',
      sitrep: 'SITREP MP'
    },
    [Language.KIRUNDI]: {
      tracked: 'Abashingamateka baronderwa',
      subtitle: 'Inama Nshingamateka na Senate',
      majParty: 'Umugambwe ukomeye',
      majSub: 'Abaserukira benshi',
      stab: 'Uko bishimiwe',
      stabSub: 'Ibipimo vy\'u Burundi',
      tableTitle: 'Isesengurwa ry\'abashingamateka',
      search: 'Rondera izina...',
      allParties: 'Imigambwe yose',
      hMember: 'Uwuserukira',
      hProvince: 'Intara',
      hParty: 'Umugambwe',
      hSentiment: 'Uko ashimiwe',
      hInfluence: 'Ubukomezi',
      loading: 'Kurondera amateka n\'ibikorwa...',
      stratReport: 'Inkuru y\'ubumenyi',
      sitrep: 'Uko ibifashe'
    }
  }[language];

  const filtered = useMemo(() => {
    return candidates.filter(c => 
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.constituency.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterParty === 'All' || c.party === filterParty)
    );
  }, [candidates, searchTerm, filterParty]);

  const handleRowClick = async (c: ParliamentaryCandidate) => {
    setSelectedCandidate(c);
    const prof = getConstituencyProfile(c.constituency, c.name, c.party);
    setProfile(prof);
    setIsGenerating(true);
    setAiReport(null);
    try {
      const report = await generatePoliticalStrategy(c.name, c.party, c.constituency, JSON.stringify(prof.socioEconomic), language);
      setAiReport(report);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const COLORS: Record<string, string> = { 'CNDD-FDD': '#EF4444', 'CNL': '#3B82F6', 'UPRONA': '#FACC15', 'FRODEBU': '#22C55E', 'Other': '#64748B' };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm font-medium mb-1">{t.tracked}</p>
          <h3 className="text-3xl font-bold text-white">{candidates.length}</h3>
          <p className="text-xs text-slate-500 mt-2">{t.subtitle}</p>
        </div>
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm font-medium mb-1">{t.majParty}</p>
          <h3 className="text-3xl font-bold text-red-500">CNDD-FDD</h3>
          <p className="text-xs text-slate-500 mt-2">{t.majSub}</p>
        </div>
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm font-medium mb-1">{t.stab}</p>
          <h3 className="text-3xl font-bold text-blue-400">74%</h3>
          <p className="text-xs text-slate-500 mt-2">{t.stabSub}</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">{t.tableTitle}</h3>
            <div className="flex gap-3">
               <input type="text" placeholder={t.search} className="bg-slate-900 border border-slate-700 rounded px-4 py-1.5 text-sm text-white" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
               <select className="bg-slate-900 border border-slate-700 rounded px-4 py-1.5 text-sm text-white" onChange={(e)=>setFilterParty(e.target.value)}>
                  <option value="All">{t.allParties}</option>
                  <option value="CNDD-FDD">CNDD-FDD</option>
                  <option value="CNL">CNL</option>
               </select>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-xs uppercase">
                <th className="p-5 font-bold">{t.hMember}</th>
                <th className="p-5 font-bold">{t.hProvince}</th>
                <th className="p-5 font-bold">{t.hParty}</th>
                <th className="p-5 font-bold">{t.hSentiment}</th>
                <th className="p-5 font-bold">{t.hInfluence}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filtered.map(c => (
                <tr key={c.id} onClick={()=>handleRowClick(c)} className="hover:bg-slate-700/30 cursor-pointer transition-colors group">
                  <td className="p-5 font-bold text-slate-200 group-hover:text-red-400">{c.name}</td>
                  <td className="p-5 text-slate-400">{c.constituency}</td>
                  <td className="p-5">
                     <span className="px-2 py-0.5 rounded text-[10px] font-bold border" style={{borderColor: `${COLORS[c.party] || COLORS.Other}40`, color: COLORS[c.party] || COLORS.Other}}>
                        {c.party}
                     </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{width: `${c.sentimentScore}%`}}></div>
                      </div>
                      {c.sentimentScore}%
                    </div>
                  </td>
                  <td className="p-5 text-slate-400 text-sm">{c.projectedVoteShare}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
           <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-700 h-full p-8 overflow-y-auto animate-in slide-in-from-right">
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <h2 className="text-2xl font-bold text-white">{selectedCandidate.name}</h2>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Prov. {selectedCandidate.constituency} • {selectedCandidate.party}</p>
                 </div>
                 <button onClick={()=>setSelectedCandidate(null)} className="text-slate-500 hover:text-white"><X size={28}/></button>
              </div>

              {isGenerating ? (
                 <div className="py-20 text-center flex flex-col items-center">
                   <BrainCircuit className="animate-pulse text-red-500 mb-4" size={40} />
                   <p className="text-slate-400">{t.loading}</p>
                 </div>
              ) : aiReport ? (
                 <div className="space-y-6">
                    <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-xl">
                       <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2"><BrainCircuit size={14}/> {t.stratReport}</h4>
                       <p className="text-slate-300 leading-relaxed italic">
                          "{aiReport?.grandStrategy || aiReport?.winningStrategy || "Strategic analysis pending..."}"
                       </p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                       <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{t.sitrep}</h4>
                       <p className="text-slate-300 text-sm leading-relaxed">
                          {aiReport?.sitRep || "SitRep data undergoing synchronization."}
                       </p>
                    </div>
                 </div>
              ) : null}
           </div>
        </div>
      )}
    </div>
  );
};
