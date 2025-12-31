
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BrainCircuit, 
  Bell, 
  ShieldAlert,
  TrendingUp,
  Radio,
  Landmark,
  LogOut,
  FileText,
  Database,
  History,
  Loader2,
  Video,
  Menu,
  Globe
} from 'lucide-react';
import { StatCard } from './StatCard';
import { ViolenceMap } from './ViolenceMap';
import { CandidateList } from './CandidateList';
import { ReportAnalyzer } from './ReportAnalyzer';
import { ParliamentaryAnalytics } from './ParliamentaryAnalytics';
import { DailyOpEd } from './DailyOpEd';
import { Chatbot } from './Chatbot';
import { VideoIntel } from './VideoIntel';
import { ContinentalLedger } from './ContinentalLedger';
import { ViewState, Incident, Candidate, ParliamentaryCandidate, Language } from '../types';
import { PARLIAMENTARY_DATA } from '../data/parliamentaryData';
import { fetchRecentIncidents, fetchLiveCandidateStats } from '../services/geminiService';

const BURUNDI_CABINET_MOCK: Candidate[] = [
  { id: 'cab1', name: 'Évariste Ndayishimiye', party: 'CNDD-FDD', district: 'Gitega', sentimentScore: 68, mentions: 15400, projectedVoteShare: 72, imageUrl: 'https://ui-avatars.com/api/?name=Evariste+Ndayishimiye&background=020617&color=fff', notes: 'President of the Republic. Focused on socioeconomic development and EAC integration.' },
  { id: 'cab2', name: 'Gervais Ndirakobuca', party: 'CNDD-FDD', district: 'Bujumbura Rural', sentimentScore: 61, mentions: 9200, projectedVoteShare: 64, imageUrl: 'https://ui-avatars.com/api/?name=Gervais+Ndirakobuca&background=020617&color=fff', notes: 'Prime Minister. Managing interior security and administrative reform.' },
  { id: 'cab3', name: 'Albert Shingiro', party: 'CNDD-FDD', district: 'Bujumbura Mairie', sentimentScore: 75, mentions: 6300, projectedVoteShare: 58, imageUrl: 'https://ui-avatars.com/api/?name=Albert+Shingiro&background=020617&color=fff', notes: 'Minister of Foreign Affairs. Key figure in managing Rwanda-Burundi border tensions.' },
  { id: 'cab4', name: 'Martin Niteretse', party: 'CNDD-FDD', district: 'Muramvya', sentimentScore: 54, mentions: 4100, projectedVoteShare: 45, imageUrl: 'https://ui-avatars.com/api/?name=Martin+Niteretse&background=020617&color=fff', notes: 'Minister of Interior, Community Development and Public Security.' },
];

interface DashboardProps {
  onReturnToSite: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onReturnToSite }) => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(Language.FRENCH);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [cabinetMembers, setCabinetMembers] = useState<Candidate[]>(BURUNDI_CABINET_MOCK);
  const [parlCandidates, setParlCandidates] = useState<ParliamentaryCandidate[]>(PARLIAMENTARY_DATA);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  useEffect(() => {
    const loadRealData = async () => {
      setIsLoadingFeed(true);
      try {
        const verifiedIncidents = await fetchRecentIncidents(language);
        if (verifiedIncidents && verifiedIncidents.length > 0) {
            setIncidents(verifiedIncidents);
        }
        const liveStats = await fetchLiveCandidateStats(cabinetMembers, language);
        if (liveStats && liveStats.length > 0) {
            setCabinetMembers(prev => prev.map(p => {
                const live = liveStats.find(s => s.name === p.name || s.id === p.id);
                return live ? { ...p, ...live } : p;
            }));
        }
      } catch (err) { console.error(err); } finally { setIsLoadingFeed(false); }
    };
    loadRealData();
  }, [language]);

  const t = {
    [Language.ENGLISH]: {
      dashboard: 'Dashboard',
      security: 'Security',
      cabinet: 'The Cabinet',
      assembly: 'National Assembly',
      sitrep: 'Daily SitRep',
      mugi: 'Strategic Core',
      video: 'Video Forensics',
      ledger: 'Continental Ledger',
      status: 'Mugi-Solo Burundi Status',
      activeSync: '90-Day Live Sync Active: 18 Provinces online.',
      exit: 'Exit',
      header: 'Burundi Political Monitoring',
      secIndex: 'Security Index',
      incidents: 'Incidents (90d)',
      sentiment: 'Cabinet Sentiment',
      nextCycle: 'Next Cycle'
    },
    [Language.FRENCH]: {
      dashboard: 'Tableau de bord',
      security: 'Sécurité',
      cabinet: 'Le Cabinet',
      assembly: 'Assemblée Nationale',
      sitrep: 'SitRep Quotidien',
      mugi: 'Noyau Stratégique',
      video: 'Forensique Vidéo',
      ledger: 'Registre Continental',
      status: 'Statut Mugi-Solo Burundi',
      activeSync: 'Synchro 90j Active : 18 Provinces en ligne.',
      exit: 'Sortie',
      header: 'Monitoring Politique Burundi',
      secIndex: 'Indice de Sécurité',
      incidents: 'Incidents (90j)',
      sentiment: 'Sentiment Cabinet',
      nextCycle: 'Prochain Cycle'
    },
    [Language.KIRUNDI]: {
      dashboard: "Ikibaho c'ibikorwa",
      security: 'Umutekano',
      cabinet: "Inama y'Abashikiranganji",
      assembly: 'Inama Nshingamateka',
      sitrep: 'Inkuru ya buri munsi',
      mugi: 'Ubumenyi bwa Mugi-Solo',
      video: 'Ivyerekeye Amashusho',
      ledger: 'Ibitabo vyo mu Karere',
      status: 'Uko Mugi-Solo yifashe',
      activeSync: '90-Day Live Sync: Intara 18 zirahujwe.',
      exit: 'Gusohoka',
      header: 'Ikurikiranwa rya Politike mu Burundi',
      secIndex: 'Ibipimo vy\'umutekano',
      incidents: 'Ibintu vyabaye (imisi 90)',
      sentiment: "Abashikiranganji bishimiwe",
      nextCycle: 'Igihe gikurikira'
    }
  }[language];

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-slate-900/50 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><ShieldAlert size={20} /></div>
                   <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">{t.status}</p>
                      <p className="text-sm text-slate-300">{t.activeSync}</p>
                   </div>
                </div>
                <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-slate-500">
                   <span className="flex items-center gap-1"><History size={10}/> 90-DAY WINDOW: ACTIVE</span>
                   <span className="flex items-center gap-1"><Database size={10}/> OSINT FEEDS: LIVE</span>
                </div>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title={t.secIndex} value="4.8" icon={ShieldAlert} color="red" />
              <StatCard title={t.incidents} value={incidents.length || 12} icon={Bell} color="orange" />
              <StatCard title={t.sentiment} value="Volatile" icon={TrendingUp} color="green" />
              <StatCard title={t.nextCycle} value="2025" icon={Radio} color="blue" />
            </div>
            <CandidateList candidates={cabinetMembers} language={language} />
          </div>
        );
      case ViewState.VIOLENCE_MAP: return <ViolenceMap incidents={incidents} fullScreen />;
      case ViewState.CABINET: return <CandidateList candidates={cabinetMembers} language={language} />;
      case ViewState.MP_ANALYTICS: return <ParliamentaryAnalytics candidates={parlCandidates} onUpdateCandidates={setParlCandidates} language={language} />;
      case ViewState.DAILY_OPED: return <DailyOpEd incidents={incidents} candidates={cabinetMembers} language={language} />;
      case ViewState.ANALYSIS: return <ReportAnalyzer language={language} />;
      case ViewState.VIDEO_INTEL: return <VideoIntel language={language} />;
      case ViewState.CONTINENTAL_LEDGER: return <ContinentalLedger language={language} />;
      default: return <div>Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans selection:bg-blue-500/30 relative">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} print:hidden`}>
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-4">
            <span className="font-bold text-white text-lg">B</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-white uppercase">Salus Burundi</span>
        </div>
        <nav className="p-6 space-y-2">
          {[
            { id: ViewState.DASHBOARD, icon: LayoutDashboard, label: t.dashboard },
            { id: ViewState.CONTINENTAL_LEDGER, icon: Globe, label: t.ledger },
            { id: ViewState.ANALYSIS, icon: BrainCircuit, label: t.mugi },
            { id: ViewState.VIOLENCE_MAP, icon: ShieldAlert, label: t.security },
            { id: ViewState.CABINET, icon: Users, label: t.cabinet },
            { id: ViewState.MP_ANALYTICS, icon: Landmark, label: t.assembly },
            { id: ViewState.DAILY_OPED, icon: FileText, label: t.sitrep },
            { id: ViewState.VIDEO_INTEL, icon: Video, label: t.video },
          ].map(item => (
            <button key={item.id} onClick={() => { setCurrentView(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-lg transition-colors ${currentView === item.id ? 'bg-red-600/10 text-red-400 border border-red-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <item.icon size={22} /> <span className="font-medium text-base">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-green-500"></div>
            <div><p className="text-sm font-medium text-white truncate">Mugi-Solo</p><p className="text-xs text-slate-500 truncate">SSR Node Sync</p></div>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col lg:ml-72 transition-all duration-300 print:ml-0 print:w-full">
        <header className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-8 flex items-center justify-between print:hidden">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-slate-400 hover:text-white"><Menu size={28} /></button>
              <h1 className="text-xl font-semibold text-white">{t.header}</h1>
           </div>
           
           <div className="flex items-center gap-2">
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                {[Language.ENGLISH, Language.FRENCH, Language.KIRUNDI].map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${language === lang ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <div className="w-px h-6 bg-slate-700 mx-2"></div>
              <button onClick={onReturnToSite} className="p-2 text-slate-400 hover:text-red-400 transition-colors" title={t.exit}>
                <LogOut size={20} />
              </button>
           </div>
        </header>
        <main className="p-8 flex-1 overflow-y-auto print:p-0">
          <div className="max-w-7xl mx-auto h-full">
            {isLoadingFeed && incidents.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="animate-spin text-red-500" size={48} />
                  <p className="text-slate-400 font-medium animate-pulse">Syncing with Burundi Ground Truth (90-Day Loop)...</p>
               </div>
            ) : renderContent()}
          </div>
        </main>
      </div>
      <Chatbot language={language} />
    </div>
  );
}
