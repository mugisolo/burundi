
import React, { useEffect, useState, useRef } from 'react';
import { generateDailyOpEd } from '../services/geminiService';
import { FileText, RefreshCw, Calendar, Share2, Printer, PenTool, Feather, Quote, Bookmark, Download, Search, History, Shield, ShieldCheck, ChevronRight } from 'lucide-react';
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
  
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHistorical, setIsHistorical] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Aggressive text cleaning
  const cleanReportText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/_{1,2}/g, '')
      .trim();
  };

  const t = {
    [Language.ENGLISH]: {
      title: 'Intelligence Dossier Generator',
      subtitle: 'Strategic Analysis Desk // Mugi-Solo Core',
      start: 'Start Date',
      end: 'End Date',
      generate: 'Generate Brief',
      synthesizing: 'Synthesizing...',
      loading: 'Consulting Historical Archive & Live Feeds...',
      loadingSub: 'Synthesizing regional dynamics for requested period. Target: 2000+ words.',
      verdicts: 'Key Strategic Verdicts',
      latestBriefing: 'LATEST OPS BRIEFING',
      stratDesk: 'Strategic Intelligence Desk'
    },
    [Language.FRENCH]: {
      title: 'Générateur de Dossiers de Renseignement',
      subtitle: 'Bureau d\'analyse stratégique // Mugi-Solo Core',
      start: 'Date de début',
      end: 'Date de fin',
      generate: 'Générer le rapport',
      synthesizing: 'Synthétisation...',
      loading: 'Consultation des archives historiques et des flux en direct...',
      loadingSub: 'Synthétisation de la dynamique régionale. Cible : 2000+ mots.',
      verdicts: 'Verdict Stratégique Clé',
      latestBriefing: 'DERNIER BRIEFING OPÉRATIONNEL',
      stratDesk: 'Bureau du Renseignement Stratégique'
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
      stratDesk: 'Ibiro vy\'ubumenyi'
    }
  }[language];

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);

    const filteredIncidents = isHistorical 
        ? incidents.filter(i => {
            const d = new Date(i.date);
            return d >= start && d <= end;
        })
        : incidents.slice(0, 10);

    const incidentsSummary = filteredIncidents.length > 0
        ? filteredIncidents.map(i => `${i.type} in ${i.location} (${i.date})`).join('; ')
        : "No significant incidents reported in this period.";

    const candidatesSummary = candidates.slice(0, 4).map(c => `${c.name}: ${c.projectedVoteShare}% proj share, ${c.sentimentScore}% sentiment`).join('; ');

    const rangeDescription = isHistorical 
        ? `${startDate} to ${endDate}` 
        : "Latest (Last 24-48 hours)";

    try {
      const result = await generateDailyOpEd(incidentsSummary, candidatesSummary, rangeDescription, language);
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    if (!contentRef.current || !window.html2canvas || !window.jspdf) {
        alert("PDF libraries not fully loaded.");
        return;
    }
    try {
        const canvas = await window.html2canvas(contentRef.current, { scale: 1.5, backgroundColor: '#fdfbf7' });
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

        pdf.save(`Salus_Strategic_Brief_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="h-full flex flex-col gap-10 animate-fade-in pb-16">
      <div className="bg-slate-800 p-10 rounded-2xl border border-slate-700 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shadow-2xl print:hidden">
        <div>
          <h2 className="text-4xl font-bold text-white mb-3 flex items-center gap-4 font-playfair tracking-tight">
            <Feather className="text-purple-400" size={40} />
            {t.title}
          </h2>
          <p className="text-xl text-slate-400 font-merriweather italic">{t.subtitle}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-700">
             <div className="flex flex-col">
                <label className="text-[10px] text-slate-500 uppercase font-black px-1 tracking-widest">{t.start}</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => { setStartDate(e.target.value); setIsHistorical(true); }}
                    className="bg-transparent text-sm text-slate-200 outline-none p-1 font-mono"
                />
             </div>
             <div className="h-8 w-px bg-slate-800 mx-1"></div>
             <div className="flex flex-col">
                <label className="text-[10px] text-slate-500 uppercase font-black px-1 tracking-widest">{t.end}</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => { setEndDate(e.target.value); setIsHistorical(true); }}
                    className="bg-transparent text-sm text-slate-200 outline-none p-1 font-mono"
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
                onClick={handleGenerate} 
                disabled={loading} 
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 disabled:opacity-50"
            >
                {loading ? <RefreshCw size={20} className="animate-spin" /> : <History size={20} />}
                {loading ? t.synthesizing : t.generate}
            </button>
            <div className="flex gap-2">
                <button onClick={handleDownloadPDF} className="p-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 transition-all shadow-lg" title="Download PDF">
                    <Download size={24} />
                </button>
                <button onClick={handlePrint} className="p-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 transition-all shadow-lg" title="Print">
                    <Printer size={24} />
                </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={contentRef} className="flex-grow bg-[#fdfbf7] text-slate-900 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden max-w-6xl mx-auto w-full border border-slate-200 min-h-[1400px]">
        {loading ? (
          <div className="h-[800px] flex flex-col items-center justify-center p-20 text-center">
             <div className="w-24 h-24 border-8 border-slate-100 border-t-purple-600 rounded-full animate-spin mb-12 shadow-inner"></div>
             <h3 className="text-4xl font-playfair text-slate-700 font-black mb-4 uppercase tracking-tighter italic">{t.loading}</h3>
             <p className="text-lg text-slate-400 max-w-md leading-relaxed font-merriweather">{t.loadingSub}</p>
          </div>
        ) : report ? (
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Sidebar */}
            <div className="lg:w-96 bg-[#f4f1ea] border-r border-slate-200 p-12 flex-shrink-0">
                <div className="flex items-center gap-4 mb-12 border-b-2 border-red-100 pb-8">
                   <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg">
                      <ShieldCheck size={28} />
                   </div>
                   <h4 className="font-sans font-black text-slate-950 text-sm uppercase tracking-[0.4em]">
                       {t.verdicts}
                   </h4>
                </div>
                <div className="space-y-16">
                    {report.keyTakeaways?.map((point, idx) => (
                        <div key={idx} className="group relative">
                            <Quote size={32} className="text-slate-200 mb-6" />
                            <p className="font-merriweather text-slate-900 text-xl leading-[2] italic tracking-tight">{cleanReportText(point)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <article className="flex-grow p-12 md:p-24 lg:p-32 overflow-y-auto bg-[#fdfbf7]">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center gap-6 text-slate-500 font-sans text-[12px] font-black tracking-[0.4em] uppercase mb-16">
                        <span className="flex items-center gap-3 bg-slate-100 px-6 py-2 rounded-full shadow-sm"><Calendar size={14} /> {isHistorical ? `${startDate} to ${endDate}` : t.latestBriefing}</span>
                        <span className="text-slate-200">|</span>
                        <span className="text-blue-700 bg-blue-50 px-6 py-2 rounded-full shadow-sm">{t.stratDesk}</span>
                    </div>
                    
                    <h1 className="font-playfair text-6xl md:text-8xl font-black text-slate-950 mb-20 leading-[1] tracking-tighter uppercase italic">
                        {report.title}
                    </h1>

                    <div className="text-slate-950 font-merriweather leading-[2.6] text-2xl tracking-normal">
                        <div className="whitespace-pre-line space-y-20">
                           {cleanReportText(report.content)}
                        </div>
                    </div>
                    
                    {/* Visual spacer to suggest "page 2" / completion */}
                    <div className="mt-40 pt-24 border-t-8 border-double border-slate-100 flex flex-col items-center justify-center gap-6 opacity-30">
                        <div className="w-16 h-px bg-slate-400"></div>
                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.8em] font-sans">End of Dossier Transmission</span>
                        <div className="w-16 h-px bg-slate-400"></div>
                    </div>
                </div>
            </article>
          </div>
        ) : (
          <div className="h-[800px] flex flex-col items-center justify-center text-slate-400">
             <FileText size={100} className="opacity-10 mb-8" />
             <p className="font-mono text-sm tracking-widest uppercase">No briefing generated for this cycle.</p>
          </div>
        )}
      </div>
    </div>
  );
};
