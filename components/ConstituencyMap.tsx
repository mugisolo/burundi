import React, { useMemo, useState, useRef } from 'react';
import { ParliamentaryCandidate } from '../types';
import { getConstituencyProfile } from '../data/parliamentaryData';
import { generatePoliticalStrategy } from '../services/geminiService';
import { Users, Search, MapPin, ArrowUpRight, X, BrainCircuit, Activity, FileText, AlertTriangle, Shield, Lock, Plus, Upload, Trash2 } from 'lucide-react';

interface ConstituencyMapProps {
  candidates: ParliamentaryCandidate[];
  onUpdateCandidates?: (candidates: ParliamentaryCandidate[]) => void;
}

export const ConstituencyMap: React.FC<ConstituencyMapProps> = ({ candidates, onUpdateCandidates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState<any | null>(null);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newCandidate, setNewCandidate] = useState<Partial<ParliamentaryCandidate>>({
    name: '', constituency: '', party: 'Independent', category: 'Constituency'
  });

  const safeRender = (val: any) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    return JSON.stringify(val, null, 2);
  };

  const constituencyData = useMemo(() => {
    const groups: Record<string, ParliamentaryCandidate[]> = {};
    candidates.forEach(c => {
      if (!groups[c.constituency]) groups[c.constituency] = [];
      groups[c.constituency].push(c);
    });
    return Object.entries(groups).map(([name, candidates]) => {
      const sorted = [...candidates].sort((a, b) => b.projectedVoteShare - a.projectedVoteShare);
      const winner = sorted[0];
      const runnerUp = sorted[1];
      const margin = runnerUp ? (winner.projectedVoteShare - runnerUp.projectedVoteShare).toFixed(1) : '100';
      return { name, candidatesCount: candidates.length, winner, runnerUp, margin, totalCandidates: candidates };
    }).filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.winner.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [candidates, searchTerm]);

  const handleRowClick = async (data: any) => {
    setSelectedConstituency(data);
    setAiReport(null);
    setLoading(true);
    try {
      const profile = getConstituencyProfile(data.name, data.winner.name, data.winner.party);
      const context = `Constituency: ${data.name}. Region: ${profile.region}. Proj Leader: ${data.winner.name}.`;
      const report = await generatePoliticalStrategy(data.winner.name, data.winner.party, data.name, context);
      setAiReport(report);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleClosePanel = () => { setSelectedConstituency(null); setAiReport(null); };

  const getPartyColorBadge = (party: string) => (
    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${party === 'NRM' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : party === 'NUP' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-700 text-slate-300'}`}>
        {party}
    </span>
  );

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full relative">
      <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h3 className="text-xl font-bold text-white flex items-center gap-2"><MapPin className="text-purple-400" size={24} /> Constituency Projection Report</h3>
           <p className="text-sm text-slate-400 mt-1">Aggregated data for {constituencyData.length} constituencies.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="Filter Constituency..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 w-64" />
        </div>
      </div>

      <div className="overflow-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10">
            <tr>
              <th className="p-5 font-bold border-b border-slate-700">Constituency</th>
              <th className="p-5 font-bold border-b border-slate-700">Candidates</th>
              <th className="p-5 font-bold border-b border-slate-700">Projected Leader</th>
              <th className="p-5 font-bold border-b border-slate-700">Proj. Share</th>
              <th className="p-5 font-bold border-b border-slate-700 text-right">Margin</th>
              <th className="p-5 font-bold border-b border-slate-700">Intel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-sm">
            {constituencyData.map((data, idx) => (
              <tr key={idx} onClick={() => handleRowClick(data)} className="hover:bg-slate-700/30 transition-colors cursor-pointer group">
                <td className="p-5 font-medium text-white group-hover:text-blue-400">{data.name}</td>
                <td className="p-5 text-slate-400"><div className="flex items-center gap-1"><Users size={14} /> {data.candidatesCount}</div></td>
                <td className="p-5"><div className="font-bold text-slate-200">{data.winner.name}</div></td>
                <td className="p-5"><div className="flex items-center gap-2"><span className="text-white font-bold">{data.winner.projectedVoteShare}%</span></div></td>
                <td className="p-5 text-right font-mono text-slate-300">+{data.margin}%</td>
                <td className="p-5">
                    <button className="text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded hover:bg-purple-500/20 hover:text-purple-300 flex items-center gap-2 text-xs uppercase font-bold transition-all shadow-sm border border-purple-500/20">Generate SitRep <ArrowUpRight size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedConstituency && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]" onClick={handleClosePanel} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-slate-900 border-l border-slate-700 shadow-2xl z-[51] overflow-y-auto animate-in slide-in-from-right">
             <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h2 className="text-2xl font-bold text-white leading-tight">{selectedConstituency.name}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-slate-400">Projected Winner:</span>
                        <span className="text-white font-bold">{selectedConstituency.winner.name}</span>
                      </div>
                   </div>
                   <button onClick={handleClosePanel} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
                </div>
                <div className="h-px bg-slate-800 w-full mb-8"></div>
                <div className="mb-8">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400"><FileText size={24} /></div>
                      <div>
                         <h3 className="text-lg font-bold text-white">Constituency Intelligence Brief</h3>
                         <p className="text-xs text-blue-400 uppercase tracking-widest font-bold">Deep Dive Analysis</p>
                      </div>
                   </div>

                   {loading ? (
                      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center flex flex-col items-center">
                          <BrainCircuit className="animate-pulse text-blue-500 mb-4" size={32} />
                          <h4 className="text-white font-bold mb-2">Mugi-Solo is consulting the Council...</h4>
                      </div>
                   ) : aiReport ? (
                      <div className="space-y-6 animate-fade-in">
                          <div className="bg-slate-800 rounded-xl border border-blue-500/30 overflow-hidden">
                              <div className="bg-blue-900/10 px-6 py-3 border-b border-blue-500/10 flex items-center justify-between">
                                 <span className="text-xs font-bold text-blue-400 uppercase flex items-center gap-2"><Activity size={14} /> Situation Report (SitRep)</span>
                                 <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">CONFIDENTIAL</span>
                              </div>
                              <div className="p-6">
                                 <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                    {safeRender(aiReport.sitRep)}
                                 </p>
                              </div>
                          </div>
                          <div className="bg-slate-800 rounded-xl border border-purple-500/30 overflow-hidden relative">
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>
                              <div className="bg-purple-900/10 px-6 py-3 border-b border-purple-500/10">
                                 <span className="text-xs font-bold text-purple-400 uppercase flex items-center gap-2"><BrainCircuit size={14} /> The Grand Strategist</span>
                              </div>
                              <div className="p-6">
                                 <p className="text-slate-300 leading-relaxed italic text-sm font-serif border-l-2 border-purple-500 pl-4">
                                    "{safeRender(aiReport.grandStrategy)}"
                                 </p>
                              </div>
                          </div>
                      </div>
                   ) : (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-center gap-4 text-red-300">
                         <AlertTriangle size={24} /><p>Unable to generate report.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};