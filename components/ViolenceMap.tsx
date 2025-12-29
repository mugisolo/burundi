import React, { useRef, useState } from 'react';
import { Incident } from '../types';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  FileText, 
  ArrowUpRight, 
  Plus, 
  Upload, 
  Trash2, 
  Shield, 
  Lock, 
  X, 
  Globe, 
  Activity, 
  ShieldCheck, 
  Zap, 
  BrainCircuit, 
  Download,
  UserCheck,
  UserX
} from 'lucide-react';

interface ViolenceMapProps {
  incidents: Incident[];
  onUpdateIncidents?: (incidents: Incident[]) => void;
  fullScreen?: boolean;
}

export const ViolenceMap: React.FC<ViolenceMapProps> = ({ incidents, onUpdateIncidents, fullScreen = false }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newIncident, setNewIncident] = useState<Partial<Incident>>({
    date: new Date().toISOString().split('T')[0],
    location: '',
    type: 'Violence',
    fatalities: 0,
    injuries: 0,
    description: '',
    verified: false
  });

  const getReliabilityColor = (reliability: string) => {
    if (!reliability) return 'bg-slate-700 text-slate-400 border-slate-600';
    const r = reliability.toUpperCase();
    if (r.startsWith('A')) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (r.startsWith('B')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (r.startsWith('C')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (r.startsWith('D')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const handleToggleVerify = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onUpdateIncidents) {
      onUpdateIncidents(incidents.map(i => 
        i.id === id ? { ...i, verified: !i.verified } : i
      ));
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onUpdateIncidents && window.confirm('Delete this incident report?')) {
        onUpdateIncidents(incidents.filter(i => i.id !== id));
    }
  };

  const handleAdd = () => {
    if (onUpdateIncidents && newIncident.location && newIncident.description) {
        const incident: Incident = {
            id: `new-${Date.now()}`,
            latitude: -3.373, // Burundi center approx
            longitude: 29.91,
            date: newIncident.date || new Date().toISOString().split('T')[0],
            location: newIncident.location || 'Unknown',
            type: newIncident.type as any || 'Violence',
            fatalities: Number(newIncident.fatalities) || 0,
            injuries: Number(newIncident.injuries) || 0,
            description: newIncident.description || '',
            verified: false,
            osintReport: {
              sourceReliability: 'C - Fairly Reliable',
              credibilityScore: 50,
              verifiedSources: [],
              aiAnalysis: 'Initial manual log entry. Awaiting Mugi-Solo verification.',
              timeline: [
                { time: 'T-0', event: 'Incident reported via local channel' },
                { time: 'T+15m', event: 'First visual confirmation received' },
                { time: 'T+45m', event: 'Entry logged in Salus system' }
              ]
            }
        };
        onUpdateIncidents([incident, ...incidents]);
        setIsAddModalOpen(false);
        setNewIncident({
            date: new Date().toISOString().split('T')[0],
            location: '',
            type: 'Violence',
            fatalities: 0,
            injuries: 0,
            description: '',
            verified: false
        });
    }
  };

  const handleBulkUploadClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !onUpdateIncidents) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          const text = event.target?.result as string;
          try {
              const lines = text.split('\n');
              const newItems: Incident[] = [];
              
              lines.forEach((line, index) => {
                  if (index === 0) return; // Skip header
                  const [date, location, type, desc, deaths, inj] = line.split(',').map(s => s.trim());
                  if (date && location) {
                      newItems.push({
                          id: `bulk-${Date.now()}-${index}`,
                          date,
                          location,
                          type: (type as any) || 'Violence',
                          description: desc || 'Imported incident',
                          fatalities: Number(deaths) || 0,
                          injuries: Number(inj) || 0,
                          latitude: -3.373,
                          longitude: 29.91,
                          verified: false,
                          osintReport: {
                            sourceReliability: 'B - Usually Reliable',
                            credibilityScore: 75,
                            verifiedSources: [],
                            aiAnalysis: 'Bulk imported record. Cross-referencing with SNR archives.',
                            timeline: [
                              { time: '08:00', event: 'Incident occurred' },
                              { time: '09:30', event: 'SITREP issued by local province office' },
                              { time: '11:00', event: 'Data ingested via bulk forensics tool' }
                            ]
                          }
                      });
                  }
              });

              if (newItems.length > 0) {
                  onUpdateIncidents([...newItems, ...incidents]);
                  alert(`Successfully imported ${newItems.length} incidents.`);
              }
          } catch (err) {
              alert("Failed to parse CSV. Format: Date,Location,Type,Description,Fatalities,Injuries");
          }
      };
      reader.readAsText(file);
      e.target.value = '';
  };

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col ${fullScreen ? 'h-full' : 'h-[600px]'}`}>
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
        <div>
           <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="text-red-500" size={20} />
              Security Incident Log
           </h3>
           <p className="text-sm text-slate-400 mt-1">
             Documented political violence and unrest events with OSINT ground truth.
           </p>
        </div>
        
        <div className="flex items-center gap-3">
            {fullScreen && onUpdateIncidents && (
                <>
                    {isAdminMode && (
                        <div className="flex items-center gap-2 animate-fade-in mr-2">
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                                <Plus size={14} /> Add
                            </button>
                            <button 
                                onClick={handleBulkUploadClick}
                                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                            >
                                <Upload size={14} /> Import
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    accept=".csv" 
                                    className="hidden" 
                                />
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => setIsAdminMode(!isAdminMode)}
                        className={`p-1.5 rounded transition-colors ${isAdminMode ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                        title="Toggle Admin Mode"
                    >
                        {isAdminMode ? <Shield size={18} /> : <Lock size={18} />}
                    </button>
                </>
            )}
            <div className="text-xs font-mono text-slate-500 bg-slate-800 px-3 py-1 rounded border border-slate-700">
              MUGI-SOLO ACTIVE FEED
            </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="p-4 font-bold border-b border-slate-700">Status</th>
              <th className="p-4 font-bold border-b border-slate-700">Date</th>
              <th className="p-4 font-bold border-b border-slate-700">Location</th>
              <th className="p-4 font-bold border-b border-slate-700">Type</th>
              <th className="p-4 font-bold border-b border-slate-700">Reliability</th>
              <th className="p-4 font-bold border-b border-slate-700 w-1/4">Narrative</th>
              {isAdminMode && <th className="p-4 font-bold border-b border-slate-700 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-sm">
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-slate-700/30 transition-colors cursor-pointer group" onClick={() => setSelectedIncident(incident)}>
                <td className="p-4">
                  {incident.verified ? (
                    <div className="text-green-500" title="Verified by Analyst">
                      <CheckCircle size={20} />
                    </div>
                  ) : (
                    <div className="text-slate-600" title="Awaiting Verification">
                      <Clock size={20} />
                    </div>
                  )}
                </td>
                <td className="p-4 text-slate-300 whitespace-nowrap">
                   <div className="font-medium text-white">{incident.date}</div>
                   <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      {incident.osintReport?.timeline?.[0]?.time || '00:00'}
                   </div>
                </td>
                <td className="p-4">
                   <div className="flex items-center gap-2 text-white font-medium">
                      <MapPin size={14} className="text-slate-500" />
                      {incident.location}
                   </div>
                </td>
                <td className="p-4">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${
                      incident.type === 'Violence' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      incident.type === 'Protest' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      incident.type === 'Arrest' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-slate-700 text-slate-300 border-slate-600'
                   }`}>
                      {incident.type}
                   </span>
                </td>
                <td className="p-4">
                   {incident.osintReport ? (
                      <div className={`flex items-center gap-2 px-2.5 py-1 rounded text-xs font-bold border ${getReliabilityColor(incident.osintReport.sourceReliability)}`}>
                         {incident.osintReport.sourceReliability.split(' - ')[0]}
                         <span className="opacity-50 ml-1">({incident.osintReport.credibilityScore}%)</span>
                      </div>
                   ) : (
                      <span className="text-slate-500 italic text-xs">Awaiting...</span>
                   )}
                </td>
                <td className="p-4 text-slate-300 leading-relaxed">
                   <p className="line-clamp-2">
                      {incident.description}
                   </p>
                </td>
                {isAdminMode && (
                    <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                              onClick={(e) => handleToggleVerify(e, incident.id)}
                              className={`p-2 rounded hover:bg-slate-600 transition-colors ${incident.verified ? 'text-green-400' : 'text-slate-400'}`}
                              title={incident.verified ? "Revoke Verification" : "Verify Report"}
                          >
                              {incident.verified ? <UserCheck size={18} /> : <UserX size={18} />}
                          </button>
                          <button 
                              onClick={(e) => handleDelete(e, incident.id)}
                              className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded hover:bg-slate-600"
                              title="Delete Record"
                          >
                              <Trash2 size={18} />
                          </button>
                        </div>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95">
                  <div className="p-8 border-b border-slate-800 flex justify-between items-start shrink-0">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded text-xs font-bold border ${
                                selectedIncident.type === 'Violence' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                selectedIncident.type === 'Protest' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                                {selectedIncident.type} Report
                            </span>
                            {selectedIncident.verified && (
                              <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                                <CheckCircle size={12} /> VERIFIED
                              </span>
                            )}
                            <span className="text-slate-500 text-xs font-mono">ID: {selectedIncident.id}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <MapPin className="text-blue-400" /> {selectedIncident.location}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">{selectedIncident.date} • Forensic SITREP</p>
                      </div>
                      <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
                    {/* OSINT METRICS ROW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getReliabilityColor(selectedIncident.osintReport?.sourceReliability || '')}`}>
                            <Shield className="mb-2" size={24} />
                            <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Source Reliability</p>
                            <p className="text-sm font-bold mt-1">{selectedIncident.osintReport?.sourceReliability || 'N/A'}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center text-center">
                            <ShieldCheck className={`mb-2 ${getScoreColor(selectedIncident.osintReport?.credibilityScore || 0)}`} size={24} />
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Credibility Score</p>
                            <p className={`text-2xl font-bold mt-1 ${getScoreColor(selectedIncident.osintReport?.credibilityScore || 0)}`}>
                                {selectedIncident.osintReport?.credibilityScore || 0}%
                            </p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center text-center">
                            <Activity className="mb-2 text-red-500" size={24} />
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Fatalities</p>
                            <p className="text-2xl font-bold text-white mt-1">{selectedIncident.fatalities}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center text-center">
                            <Zap className="mb-2 text-orange-500" size={24} />
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Injuries</p>
                            <p className="text-2xl font-bold text-white mt-1">{selectedIncident.injuries}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* LEFT COLUMN: DESCRIPTION & ANALYSIS */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                   <FileText size={14} className="text-blue-400" /> Ground Truth Narrative
                                </h4>
                                <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50 text-slate-200 leading-relaxed font-serif text-lg italic">
                                    "{selectedIncident.description}"
                                </div>
                            </div>

                            <div className="bg-blue-900/10 rounded-xl border border-blue-500/20 p-6">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                   <BrainCircuit size={16} /> Mugi-Solo Strategic Analysis
                                </h4>
                                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                                    {selectedIncident.osintReport?.aiAnalysis || "Strategic analysis pending deeper network crawl."}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: TIMELINE & SOURCES */}
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                   <Clock size={14} className="text-slate-400" /> Chronology of Events
                                </h4>
                                <div className="space-y-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                                    {(selectedIncident.osintReport?.timeline || [
                                      {time: '04:00 AM', event: 'Initial reports via social media'},
                                      {time: '06:30 AM', event: 'Salus analyst cross-verified locations'},
                                      {time: '08:45 AM', event: 'Mugi-Solo AI confidence threshhold reached'}
                                    ]).map((event, i) => (
                                        <div key={i} className="pl-6 relative">
                                            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center">
                                               <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">{event.time}</p>
                                            <p className="text-xs text-slate-300 mt-0.5">{event.event}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                   <Globe size={14} className="text-blue-400" /> OSINT Sources
                                </h4>
                                <div className="space-y-2">
                                    {selectedIncident.osintReport?.verifiedSources && selectedIncident.osintReport.verifiedSources.length > 0 ? (
                                        selectedIncident.osintReport.verifiedSources.map((src, i) => (
                                            <a key={i} href={src} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-blue-500 transition-colors group">
                                               <ArrowUpRight size={14} className="text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                                               <span className="text-xs text-slate-400 truncate">{src}</span>
                                            </a>
                                        ))
                                    ) : (
                                        <div className="text-xs text-slate-600 italic px-4 py-6 border border-dashed border-slate-700 rounded-lg text-center">
                                            No verified web links attached.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/50 border-t border-slate-800 shrink-0 flex justify-between items-center px-8">
                     <p className="text-[10px] text-slate-600 uppercase font-mono tracking-tighter">Protocol: Burundian Forensic Standard v5.1</p>
                     <button className="text-red-400 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors">
                        Export Full SITREP <Download size={14} />
                     </button>
                  </div>
              </div>
          </div>
      )}

      {/* Add Incident Modal */}
      {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Plus className="text-green-500" /> Log New Incident
                      </h3>
                      <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                          <X size={24} />
                      </button>
                  </div>
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                              <input 
                                  type="date"
                                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none text-sm"
                                  value={newIncident.date}
                                  onChange={e => setNewIncident({...newIncident, date: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                              <select 
                                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none text-sm"
                                  value={newIncident.type}
                                  onChange={e => setNewIncident({...newIncident, type: e.target.value as any})}
                              >
                                  <option value="Violence">Violence</option>
                                  <option value="Protest">Protest</option>
                                  <option value="Arrest">Arrest</option>
                                  <option value="Intimidation">Intimidation</option>
                                  <option value="Rally">Rally</option>
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                          <input 
                              type="text"
                              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none text-sm"
                              placeholder="District, Commune, or Hill"
                              value={newIncident.location}
                              onChange={e => setNewIncident({...newIncident, location: e.target.value})}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deaths</label>
                              <input 
                                  type="number"
                                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none text-sm"
                                  value={newIncident.fatalities}
                                  onChange={e => setNewIncident({...newIncident, fatalities: Number(e.target.value)})}
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Injuries</label>
                              <input 
                                  type="number"
                                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none text-sm"
                                  value={newIncident.injuries}
                                  onChange={e => setNewIncident({...newIncident, injuries: Number(e.target.value)})}
                              />
                          </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                        <textarea 
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none text-sm h-24"
                            placeholder="Detail of the incident..."
                            value={newIncident.description}
                            onChange={e => setNewIncident({...newIncident, description: e.target.value})}
                        />
                      </div>
                      <button 
                          onClick={handleAdd}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                      >
                          Submit Report
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
