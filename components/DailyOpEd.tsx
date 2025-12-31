import React, { useEffect, useState, useRef } from 'react';
import { generateDailyOpEd } from '../services/geminiService';
import { FileText, RefreshCw, Calendar, Share2, Printer, PenTool, Feather, Quote, Bookmark, Download, Search, History, Shield, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';
import { Incident, Candidate, Language } from '../types';

declare global {
    interface Window {
        html2canvas: any;
        jspdf: any;
    }
}

interface DailyOpEdProps {
  incidents: Incident[];
  candidates: Candidate[];
  language?: Language;
}

export const DailyOpEd: React.FC<DailyOpEdProps> = ({ incidents, candidates, language = Language.FRENCH }) => {
  const [report, setReport] = useState<{ title: string; content: string; keyTakeaways: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Aggressive text cleaning to remove any leaked Markdown
  const cleanReportText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/[\*#\[\]]/g, '') // Strip symbols: * # [ ]
      .replace(/_{1,2}/g, '')    // Strip underscores
      .replace(/`{1,3}/g, '')    // Strip backticks
      .trim();
  };

  const t = {
    [Language.ENGLISH]: {
      title: 'Strategic Intel Briefing',
      subtitle: 'Mugi-Solo Forensic Desk // Strategic Ops',
      start: 'Observation Start',
      end: 'Observation End',
      generate: 'Synthesize Intelligence',
      synthesizing: 'Compiling Report...',
      loading: 'Scouring OSINT Data Streams...',
      loadingSub: 'Conducting cross-border analysis and sentiment mapping for requested period.',
      verdicts: 'Tactical Verdicts',
      latestBriefing: 'REAL-TIME OPS DOSSIER',
      stratDesk: 'Intelligence Command',
      error: 'Intelligence Blackout: Could not synthesize briefing for this period.'
    },
    [Language.FRENCH]: {
      title: 'Briefing du Renseignement Stratégique',
      subtitle: 'Bureau Forensique Mugi-Solo // Opérations Stratégiques',
      start: 'Début d\'Observation',
      end: 'Fin d\'Observation',
      generate: 'Synthétiser le Renseignement',
      synthesizing: 'Compilation du Rapport...',
      loading: 'Analyse des Flux de Données OSINT...',
      loadingSub: 'Analyse transfrontalière et cartographie des sentiments pour la période demandée.',
      verdicts: 'Verdicts Tactiques',
      latestBriefing: 'DOSSIER OPÉRATIONNEL EN TEMPS RÉEL',
      stratDesk: 'Commandement du Renseignement',
      error: 'Blackout du Renseignement: Impossible de synthétiser le briefing.'
    },
    [Language.KIRUNDI]: {
      title: 'Gukora amakuru y\'umutekano',
      subtitle: 'Ubusesenguzi bwa Mugi-Solo',
      start: 'Igihe itangirira',
      end: 'Igihe iherera',
      generate: 'Kora raporo',
      synthesizing: 'Gushira hamwe...',
      loading: 'Kurondera mu mateka n\'amakuru mashasha...',
      loadingSub: 'Gusesengura amakuru y\'akarere. Amakuru nini cane.',
      verdicts: 'Ibihe vyitezwe',
      latestBriefing: 'AMAKURU MASHASHA',
      stratDesk: 'Ibiro vy\'ubumenyi',
      error: 'Hari amakuru atabonetse. Ongera ugerageze.'
    }
  }[language];

  const handleGenerate = async () => {
    setLoading(true);
    setReport(null);
    setError(null);
    
    // Filter incidents for the summary to give context to Gemini
    const s = new Date(startDate);
    const e = new Date(endDate);
    e.setHours(23, 59, 59);

    const filteredIncidents = incidents.filter(i => {
        const d = new Date(i.date);
        return d >= s && d <= e;
    });

    const incidentsSummary = filteredIncidents.length > 0
        ? filteredIncidents.map(i => `${i.type} at ${i.location} on ${i.date}`).join('; ')
        : "No local incidents logged, proceed with OSINT search for national dynamics.";

    const candidatesSummary = candidates.map(c => `${c.name} (${c.party}): Proj. share ${c.projectedVoteShare}%, Sentiment ${c.sentimentScore}%`).join('; ');

    const dateRangeDescription = `From ${startDate} to ${endDate}`;

    try {
      const result = await generateDailyOpEd(incidentsSummary, candidatesSummary, dateRangeDescription, language);
      if (result) {
        setReport(result);
      } else {
        setError(t.error);
      }
    } catch (err) {
      console.error(err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only auto-generate if we have some data or after a short delay
    const timer = setTimeout(() => {
      handleGenerate();
    }, 1000);
    return () => clearTimeout(timer);
  }, [language]);

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    if (!contentRef.current || !window.html2canvas || !window.jspdf) {
        alert("Intelligence Export Libraries not loaded.");
        return;
    }
    try {
        const canvas = await window.html2canvas(contentRef.current, { scale: 1.5, backgroundColor: '#fdfbf7', useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= 297;

        while (heightLeft >= 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= 297;
        }

        pdf.save(`Salus_Intel_Brief_${startDate}_to_${endDate}.pdf`);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-fade-in pb-20">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shadow-2xl print:hidden">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-4 uppercase italic">
            <Feather className="text-blue-500" size={32} />
            {t.title}
          </h2>
          <p className="text-slate-400 font-medium">{t.subtitle}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-700">
             <div className="flex flex-col">
                <label className="text-[9px] text-slate-500 uppercase font-black px-1">{t.start}</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 outline-none p-1 font-mono"
                />
             </div>
             <div className="h-6 w-px bg-slate-800 mx-1"></div>
             <div className="flex flex-col">
                <label className="text-[9px] text-slate-500 uppercase font-black px-1">{t.end}</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 outline-none p-1 font-mono"
                />
             </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
                onClick={handleGenerate} 
                disabled={loading} 
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
            >
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <History size={16} />}
                {loading ? t.synthesizing : t.generate}
            </button>
            <div className="flex gap-2">
                <button onClick={handleDownloadPDF} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 border border-slate-700 transition-all" title="Export PDF">
                    <Download size={20} />
                </button>
                <button onClick={handlePrint} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 border border-slate-700 transition-all" title="Print">
                    <Printer size={20} />
                </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={contentRef} className="flex-grow bg-[#fdfbf7] text-slate-900 rounded-3xl shadow-2xl overflow-hidden max-w-6xl mx-auto w-full border border-slate-200 min-h-[1200px]">
        {loading ? (
          <div className="h-[600px] flex flex-col items-center justify-center p-20 text-center">
             <div className="w-20 h-20 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-10"></div>
             <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase italic tracking-tighter">{t.loading}</h3>
             <p className="text-lg text-slate-500 max-w-md font-serif italic">{t.loadingSub}</p>
          </div>
        ) : error ? (
           <div className="h-[600px] flex flex-col items-center justify-center p-20 text-center">
             <AlertCircle className="text-red-600 mb-6" size={64} />
             <h3 className="text-2xl font-bold text-slate-900 mb-2 uppercase">{error}</h3>
             <button onClick={handleGenerate} className="text-blue-600 font-bold hover:underline">Retry Synthesis</button>
           </div>
        ) : report ? (
          <div className="flex flex-col lg:flex-row h-full">
            <div className="lg:w-80 bg-[#f4f1ea] border-r border-slate-200 p-10 flex-shrink-0">
                <div className="flex items-center gap-3 mb-10 border-b border-slate-300 pb-6">
                   <div className="p-2 bg-blue-600 text-white rounded-lg shadow-md">
                      <ShieldCheck size={20} />
                   </div>
                   <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.3em]">
                       {t.verdicts}
                   </h4>
                </div>
                <div className="space-y-12">
                    {report.keyTakeaways?.map((point, idx) => (
                        <div key={idx} className="relative">
                            <Quote size={24} className="text-slate-300 mb-4" />
                            <p className="font-serif text-slate-800 text-base leading-relaxed italic">{cleanReportText(point)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <article className="flex-grow p-12 md:p-20 bg-[#fdfbf7]">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase mb-12">
                        <span className="flex items-center gap-2 bg-slate-100 px-4 py-1 rounded-full"><Calendar size={12} /> {startDate} // {endDate}</span>
                        <span className="text-blue-600 font-black">{t.stratDesk}</span>
                    </div>
                    
                    <h1 className="text-5xl font-black text-slate-950 mb-16 leading-tight uppercase italic tracking-tighter">
                        {cleanReportText(report.title)}
                    </h1>

                    <div className="text-slate-950 font-serif leading-[2.2] text-xl">
                        <div className="whitespace-pre-line space-y-12">
                           {cleanReportText(report.content)}
                        </div>
                    </div>
                    
                    <div className="mt-32 pt-16 border-t border-slate-200 flex flex-col items-center opacity-40">
                        <div className="w-12 h-0.5 bg-slate-400 mb-4"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Forensic Dossier Terminated</span>
                    </div>
                </div>
            </article>
          </div>
        ) : (
          <div className="h-[600px] flex flex-col items-center justify-center text-slate-300">
             <FileText size={80} className="opacity-10 mb-6" />
             <p className="font-mono text-xs uppercase tracking-widest">No Intelligence Compiled for this Range</p>
          </div>
        )}
      </div>
    </div>
  );
};