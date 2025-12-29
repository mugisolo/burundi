
import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { analyzeSecurityVideo } from '../services/geminiService';
import { 
  Video, 
  Search, 
  ShieldAlert, 
  BrainCircuit, 
  Play, 
  Loader2, 
  AlertTriangle,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  FileText,
  ShieldCheck,
  Download,
  Upload,
  X,
  Plus,
  ArrowUpRight,
  Eye,
  Terminal,
  Cpu,
  // Fix: Import missing Users icon
  Users
} from 'lucide-react';

interface VideoIntelProps {
  language?: Language;
}

export const VideoIntel: React.FC<VideoIntelProps> = ({ language = Language.FRENCH }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    [Language.ENGLISH]: {
      title: 'Forensic Video Intel',
      subtitle: 'Analyze security footage and social media leaks via Mugi-Solo computer vision frameworks.',
      placeholder: 'Paste intelligence link (e.g. YouTube/Stream)...',
      analyze: 'Run Forensic Analysis',
      analyzing: 'Mugi-Solo analyzing frames...',
      upload: 'Upload Local Feed',
      results: 'Forensic Results',
      threats: 'Identified Threats',
      actors: 'Observed Actors',
      sources: 'Verified Contextual Sources',
      verdict: 'Final Strategic Verdict',
      error: 'Analysis failed. Connection to Mugi-Solo unstable.'
    },
    [Language.FRENCH]: {
      title: 'Intel Vidéo Forensique',
      subtitle: 'Analysez les amshusho y\'umutekano et les fuites sur les réseaux sociaux via Mugi-Solo.',
      placeholder: 'Coller le lien de renseignement (ex. YouTube/Stream)...',
      analyze: 'Lancer l\'analyse forensique',
      analyzing: 'Mugi-Solo analyse les images...',
      upload: 'Télécharger le flux local',
      results: 'Résultats Forensiques',
      threats: 'Menaces Identifiées',
      actors: 'Acteurs Observés',
      sources: 'Sources Contextuelles Vérifiées',
      verdict: 'Verdict Stratégique Final',
      error: 'L\'analyse a échoué. Connexion à Mugi-Solo instable.'
    },
    [Language.KIRUNDI]: {
      title: 'Isesengurwa ry\'amashusho',
      subtitle: 'Raba amashusho y\'umutekano ukoresheje Mugi-Solo.',
      placeholder: 'Shiramwo umuhora w\'amashusho...',
      analyze: 'Senzura amashusho',
      analyzing: 'Mugi-Solo ariko araraba amashusho...',
      upload: 'Shiramwo ishusho yawe',
      results: 'Ibivuyemwo',
      threats: 'Ibirindiro bibi',
      actors: 'Abagaragaye mu mashusho',
      sources: 'Ahandi ayo makuru yakuwe',
      verdict: 'Icemezo ca nyuma',
      error: 'Isesengura ntiyagenze neza. Ongera ugerageze.'
    }
  }[language];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalVideoUrl(url);
      setVideoUrl('Local File: ' + file.name);
    }
  };

  const handleRunAnalysis = async () => {
    if (!videoUrl) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);
    try {
      // If it's a local file, we send the name/placeholder since the model can't access local Blobs directly via URL
      // In a real app, you'd upload to cloud storage first.
      const result = await analyzeSecurityVideo(videoUrl, language);
      if (result) {
        setAnalysisResult(result);
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const cleanText = (txt: string) => txt ? txt.replace(/\*/g, '').replace(/#/g, '') : "";

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Panel */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Video size={120} />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-5 bg-red-600/20 rounded-2xl text-red-400 border border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <Video size={48} className={isAnalyzing ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight uppercase italic">{t.title}</h2>
            <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input & Player Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={videoUrl}
                  onChange={(e) => { setVideoUrl(e.target.value); setLocalVideoUrl(null); }}
                  placeholder={t.placeholder}
                  className="w-full bg-slate-950 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all"
                />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <Upload size={18} /> {t.upload}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="video/*" className="hidden" />
              </button>
            </div>

            <div className="aspect-video bg-black rounded-xl border border-slate-700 overflow-hidden relative group">
              {localVideoUrl ? (
                <video src={localVideoUrl} controls className="w-full h-full object-contain" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 bg-slate-950/50">
                  <Play size={64} className="opacity-20 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-mono tracking-widest uppercase">Awaiting Intel Stream</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleRunAnalysis}
              disabled={!videoUrl || isAnalyzing}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl shadow-lg shadow-red-900/20 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
              {isAnalyzing ? t.analyzing : t.analyze}
            </button>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          {!analysisResult && !isAnalyzing && !error && (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-2xl group">
               <BrainCircuit size={64} className="text-slate-800 mb-6 group-hover:text-red-500 transition-colors duration-700" />
               <h3 className="text-xl font-bold text-slate-700 uppercase tracking-widest">Mugi-Solo Forensic Desk</h3>
               <p className="text-sm text-slate-800 font-mono mt-2">Ready for visual data ingestion</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-6">
               <div className="relative inline-block">
                 <div className="w-20 h-20 border-4 border-slate-800 border-t-red-500 rounded-full animate-spin"></div>
                 <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-400 animate-pulse" size={24} />
               </div>
               <div className="space-y-2">
                 <h3 className="text-lg font-bold text-white uppercase tracking-widest">{t.analyzing}</h3>
                 <p className="text-xs text-slate-500 font-mono">FRAME_BUFFER_SYNCING // AI_LEAK_DETECTION_ON</p>
               </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/10 border border-red-500/20 p-8 rounded-2xl text-center flex flex-col items-center gap-4">
               <AlertTriangle className="text-red-500" size={48} />
               <p className="text-red-400 font-bold">{error}</p>
               <button onClick={handleRunAnalysis} className="text-white bg-red-600 px-6 py-2 rounded-lg text-sm font-bold">Retry Analysis</button>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
               {/* Verdict Section */}
               <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl border-l-8 border-red-600">
                  <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} /> {t.results}
                  </h4>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-merriweather italic text-lg mb-8">
                    {cleanText(analysisResult.analysis)}
                  </div>
                  <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.verdict}</h5>
                    <p className="text-slate-900 font-bold font-serif leading-snug">"{cleanText(analysisResult.conclusion)}"</p>
                  </div>
               </div>

               {/* Stats Row */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                     <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <AlertTriangle size={12} className="text-red-500" /> {t.threats}
                     </h5>
                     <ul className="space-y-2">
                       {analysisResult.threats?.map((threat: string, i: number) => (
                         <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {cleanText(threat)}
                         </li>
                       ))}
                     </ul>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                     <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Users size={12} className="text-blue-500" /> {t.actors}
                     </h5>
                     <ul className="space-y-2">
                       {analysisResult.observedActors?.map((actor: string, i: number) => (
                         <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {cleanText(actor)}
                         </li>
                       ))}
                     </ul>
                  </div>
               </div>

               {/* Sources Section */}
               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Globe size={14} className="text-blue-400" /> {t.sources}
                  </h5>
                  <div className="space-y-2">
                    {analysisResult.verifiedSources && analysisResult.verifiedSources.length > 0 ? (
                      analysisResult.verifiedSources.map((src: any, i: number) => (
                        <a 
                          key={i} 
                          href={src.uri} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-700 rounded-xl hover:border-red-500/50 transition-all group"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">{cleanText(src.title)}</span>
                            <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{src.uri}</span>
                          </div>
                          <ArrowUpRight size={14} className="text-slate-600 group-hover:text-red-400" />
                        </a>
                      ))
                    ) : (
                      <div className="p-4 border border-dashed border-slate-700 rounded-xl text-center italic text-[10px] text-slate-600">
                        No external verification found.
                      </div>
                    )}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
