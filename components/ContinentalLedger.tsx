
import React, { useState, useMemo } from 'react';
import { Country, CountrySitrep, Language } from '../types';
import { generateCountrySitrep } from '../services/geminiService';
import { 
  Globe, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Cpu, 
  BrainCircuit, 
  Lock, 
  FileText, 
  ArrowUpRight, 
  X, 
  Loader2, 
  AlertTriangle,
  Zap,
  ChevronRight,
  Activity,
  History,
  Target
} from 'lucide-react';

interface ContinentalLedgerProps {
  language?: Language;
}

const ALL_AFRICAN_COUNTRIES: Country[] = [
  { name: 'Algeria', region: 'Maghreb', stabilityIndex: 'Stable', iso: 'DZA' },
  { name: 'Angola', region: 'Southern Africa', stabilityIndex: 'Stable', iso: 'AGO' },
  { name: 'Benin', region: 'West Africa', stabilityIndex: 'Stable', iso: 'BEN' },
  { name: 'Botswana', region: 'Southern Africa', stabilityIndex: 'Stable', iso: 'BWA' },
  { name: 'Burkina Faso', region: 'Sahel', stabilityIndex: 'Active Conflict', iso: 'BFA' },
  { name: 'Burundi', region: 'Great Lakes', stabilityIndex: 'Fragile', iso: 'BDI' },
  { name: 'Cabo Verde', region: 'West Africa', stabilityIndex: 'Stable', iso: 'CPV' },
  { name: 'Cameroon', region: 'Central Africa', stabilityIndex: 'Fragile', iso: 'CMR' },
  { name: 'Central African Republic', region: 'Central Africa', stabilityIndex: 'Failing', iso: 'CAF' },
  { name: 'Chad', region: 'Sahel', stabilityIndex: 'Fragile', iso: 'TCD' },
  { name: 'Comoros', region: 'East Africa', stabilityIndex: 'Stable', iso: 'COM' },
  { name: 'Congo', region: 'Central Africa', stabilityIndex: 'Stable', iso: 'COG' },
  { name: 'Côte d\'Ivoire', region: 'West Africa', stabilityIndex: 'Stable', iso: 'CIV' },
  { name: 'DR Congo', region: 'Great Lakes', stabilityIndex: 'Active Conflict', iso: 'COD' },
  { name: 'Djibouti', region: 'Horn of Africa', stabilityIndex: 'Stable', iso: 'DJI' },
  { name: 'Egypt', region: 'Maghreb', stabilityIndex: 'Stable', iso: 'EGY' },
  { name: 'Equatorial Guinea', region: 'Central Africa', stabilityIndex: 'Stable', iso: 'GNQ' },
  { name: 'Eritrea', region: 'Horn of Africa', stabilityIndex: 'Fragile', iso: 'ERI' },
  { name: 'Eswatini', region: 'Southern Africa', stabilityIndex: 'Stable', iso: 'SWZ' },
  { name: 'Ethiopia', region: 'Horn of Africa', stabilityIndex: 'Fragile', iso: 'ETH' },
  { name: 'Gabon', region: 'Central Africa', stabilityIndex: 'Fragile', iso: 'GAB' },
  { name: 'Gambia', region: 'West Africa', stabilityIndex: 'Stable', iso: 'GMB' },
  { name: 'Ghana', region: 'West Africa', stabilityIndex: 'Stable', iso: 'GHA' },
  { name: 'Guinea', region: 'West Africa', stabilityIndex: 'Fragile', iso: 'GIN' },
  { name: 'Guinea-Bissau', region: 'West Africa', stabilityIndex: 'Fragile', iso: 'GNB' },
  { name: 'Kenya', region: 'East Africa', stabilityIndex: 'Stable', iso: 'KEN' },
  { name: 'Lesotho', region: 'Southern Africa', stabilityIndex: 'Stable', iso: 'LSO' },
  { name: 'Liberia', region: 'West Africa', stabilityIndex: 'Stable', iso: 'LBR' },
  { name: 'Libya', region: 'Maghreb', stabilityIndex: 'Failing', iso: 'LBY' },
  { name: 'Madagascar', region: 'Southern Africa', stabilityIndex: 'Stable', iso: 'MDG' },
  { name: 'Malawi', region: 'Southern Africa', stabilityIndex: 'Stable', iso: 'MWI' },
  { name: 'Mali', region: 'Sahel', stabilityIndex: 'Active Conflict', iso: 'MLI' },
  { name: 'Mauritania', region: 'Sahel', stabilityIndex: 'Stable', iso: 'MRT' },
  { name: 'Mauritius', region: 'Southern Africa', stabilityIndex: 'Stable', iso: 'MUS' },
  { name: 'Morocco', region: 'Maghreb', stabilityIndex: 'Stable', iso: 'MAR' },
  { name: 'Mozambique', region: 'Southern Africa', stabilityIndex: 'Fragile', iso: 'MOZ' },
  { name: 'Namibia', region: 'Southern Africa', stabilityIndex: 'Stable', iso: 'NAM' },
  { name: 'Niger', region: 'Sahel', stabilityIndex: 'Fragile', iso: 'NER' },
  { name: 'Nigeria', region: 'West Africa', stabilityIndex: 'Fragile', iso: 'NGA' },
  { name: 'Rwanda', region: 'Great Lakes', stabilityIndex: 'Stable', iso: 'RWA' },
  { name: 'São Tomé and Príncipe', region: 'Central Africa', stabilityIndex: 'Stable', iso: 'STP' },
  { name: 'Senegal', region: 'West Africa', stabilityIndex: 'Stable', iso: 'SEN' },
  { name: 'Seychelles', region: 'East Africa', stabilityIndex: 'Stable', iso: 'SYC' },
  { name: 'Sierra Leone', region: 'West Africa', stabilityIndex: 'Stable', iso: 'SLE' },
  { name: 'Somalia', region: 'Horn of Africa', stabilityIndex: 'Active Conflict', iso: 'SOM' },
  { name: 'South Africa', region: 'Southern Africa', stabilityIndex: 'Stable', iso: 'ZAF' },
  { name: 'South Sudan', region: 'East Africa', stabilityIndex: 'Fragile', iso: 'SSD' },
  { name: 'Sudan', region: 'Sahel', stabilityIndex: 'Active Conflict', iso: 'SDN' },
  { name: 'Tanzania', region: 'East Africa', stabilityIndex: 'Stable', iso: 'TZA' },
  { name: 'Togo', region: 'West Africa', stabilityIndex: 'Stable', iso: 'TGO' },
  { name: 'Tunisia', region: 'Maghreb', stabilityIndex: 'Stable', iso: 'TUN' },
  { name: 'Uganda', region: 'East Africa', stabilityIndex: 'Stable', iso: 'UGA' },
  { name: 'Zambia', region: 'Southern Africa', stabilityIndex: 'Stable', iso: 'ZMB' },
  { name: 'Zimbabwe', region: 'Southern Africa', stabilityIndex: 'Fragile', iso: 'ZWE' }
];

export const ContinentalLedger: React.FC<ContinentalLedgerProps> = ({ language = Language.FRENCH }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [filterStability, setFilterStability] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [sitrep, setSitrep] = useState<CountrySitrep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    [Language.ENGLISH]: {
      title: 'Continental Asset Ledger',
      subtitle: 'Nation-state profiling gateway. Real-time situational monitoring for 54 African jurisdictions.',
      search: 'Search jurisdictions...',
      region: 'Region',
      stability: 'Stability',
      generate: 'Generate Deep SITREP',
      loading: 'Mugi-Solo synthesizing nation-state intel...',
      verdict: 'Strategic Verdict',
      forecast: '30-Day Stability Forecast',
      influences: 'External Actor Footprint',
      politics: 'Political Integrity',
      military: 'Military Posture',
      finance: 'Financial Integrity',
      culture: 'Cultural Dynamics',
      sources: 'Verified Grounding Context'
    },
    [Language.FRENCH]: {
      title: 'Registre des Actifs Continentaux',
      subtitle: 'Passerelle de profilage des États-nations. Surveillance en temps réel pour 54 juridictions africaines.',
      search: 'Rechercher des juridictions...',
      region: 'Région',
      stability: 'Stabilité',
      generate: 'Générer un SITREP Profond',
      loading: 'Mugi-Solo synthétise les infos d\'État-nation...',
      verdict: 'Verdict Stratégique',
      forecast: 'Prévisions de Stabilité 30j',
      influences: 'Empreinte des Acteurs Externes',
      politics: 'Intégrité Politique',
      military: 'Posture Militaire',
      finance: 'Intégrité Financière',
      culture: 'Dynamiques Culturelles',
      sources: 'Contexte de Vérification'
    },
    [Language.KIRUNDI]: {
      title: 'Ibitabo vyo mu Karere',
      subtitle: 'Kuraba uko ibihugu 54 vy\'Afurika vyifashe ubu mu mutekano.',
      search: 'Rondera igihugu...',
      region: 'Akarere',
      stability: 'Umutekano',
      generate: 'Soma amakuru nini cane',
      loading: 'Mugi-Solo ariko araraba neza...',
      verdict: 'Icemezo ca nyuma',
      forecast: 'Uko bizoba bimeze mu misi 30',
      influences: 'Uruhare rw\'abanyamahanga',
      politics: 'Ipolitike',
      military: 'Igisirikare',
      finance: 'Uburyo',
      culture: 'Imico n\'imigenzo',
      sources: 'Amakuru yakuweko'
    }
  }[language];

  const filteredCountries = useMemo(() => {
    return ALL_AFRICAN_COUNTRIES.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.iso.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRegion = filterRegion === 'All' || c.region === filterRegion;
      const matchStability = filterStability === 'All' || c.stabilityIndex === filterStability;
      return matchSearch && matchRegion && matchStability;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, filterRegion, filterStability]);

  const handleGenerateSitrep = async (country: Country) => {
    setSelectedCountry(country);
    setSitrep(null);
    setLoading(true);
    setError(null);
    try {
      const result = await generateCountrySitrep(country.name, language);
      if (result) {
        setSitrep(result);
      } else {
        setError("Mugi-Solo reported an intelligence blackout for this jurisdiction.");
      }
    } catch (err) {
      setError("Forensic sync failed.");
    } finally {
      setLoading(false);
    }
  };

  const getStabilityColor = (idx: string) => {
    switch (idx) {
      case 'Stable': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Fragile': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Failing': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Active Conflict': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Panel */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Globe size={160} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
          <div className="p-6 bg-blue-600/20 rounded-3xl text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            <Globe size={56} className="animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight uppercase italic">{t.title}</h2>
            <p className="text-slate-400 text-lg max-w-3xl font-medium leading-relaxed">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-14 pr-6 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all font-mono"
          />
        </div>
        <div>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="All">All Regions</option>
            <option value="Maghreb">Maghreb</option>
            <option value="Sahel">Sahel</option>
            <option value="Great Lakes">Great Lakes</option>
            <option value="Horn of Africa">Horn of Africa</option>
            <option value="East Africa">East Africa</option>
            <option value="West Africa">West Africa</option>
            <option value="Central Africa">Central Africa</option>
            <option value="Southern Africa">Southern Africa</option>
          </select>
        </div>
        <div>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            value={filterStability}
            onChange={(e) => setFilterStability(e.target.value)}
          >
            <option value="All">All Stability Levels</option>
            <option value="Stable">Stable</option>
            <option value="Fragile">Fragile</option>
            <option value="Failing">Failing</option>
            <option value="Active Conflict">Active Conflict</option>
          </select>
        </div>
      </div>

      {/* Grid of Countries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCountries.map((country) => (
          <div 
            key={country.iso}
            onClick={() => handleGenerateSitrep(country)}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="text-3xl font-black text-slate-800 font-mono group-hover:text-blue-500/20 transition-colors">{country.iso}</div>
              <div className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getStabilityColor(country.stabilityIndex)}`}>
                {country.stabilityIndex}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{country.name}</h3>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{country.region}</p>
            <div className="mt-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-2">Analyze SITREP <ArrowUpRight size={12} /></span>
            </div>
          </div>
        ))}
      </div>

      {/* Deep SITREP Sidebar/Modal */}
      {selectedCountry && (
        <>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]" onClick={() => setSelectedCountry(null)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[750px] bg-slate-950 border-l border-slate-800 z-[61] overflow-y-auto animate-in slide-in-from-right p-0 flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-800 bg-slate-900 sticky top-0 z-10 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl italic">
                  {selectedCountry.iso}
                </div>
                <div>
                   <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mb-1">{selectedCountry.name}</h2>
                   <p className="text-blue-500 uppercase font-black text-xs tracking-[0.2em]">{selectedCountry.region} // Deep Forensic Dossier</p>
                </div>
              </div>
              <button onClick={() => setSelectedCountry(null)} className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><X size={28}/></button>
            </div>

            <div className="flex-1 p-8 space-y-10">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-8 py-20">
                   <div className="relative">
                      <div className="w-24 h-24 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
                      <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={32} />
                   </div>
                   <div className="text-center">
                      <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight italic">{t.loading}</h3>
                      <p className="text-xs text-slate-500 font-mono animate-pulse uppercase tracking-[0.3em]">Synching with Council of Strategists...</p>
                   </div>
                </div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-red-900/10 border border-red-500/20 rounded-3xl space-y-6">
                   <AlertTriangle size={64} className="text-red-500" />
                   <p className="text-red-400 font-black text-xl">{error}</p>
                   <button onClick={() => handleGenerateSitrep(selectedCountry)} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-all">Retry Analysis</button>
                </div>
              ) : sitrep ? (
                <div className="space-y-12 animate-fade-in pb-20">
                  
                  {/* Strategic Verdict Banner */}
                  <div className="bg-white p-10 rounded-3xl relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-l-[12px] border-blue-600">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                      <BrainCircuit size={18} /> {t.verdict}
                    </h4>
                    <p className="text-slate-900 text-2xl md:text-3xl italic font-serif leading-relaxed font-bold tracking-tight">
                      "{sitrep.strategicVerdict}"
                    </p>
                  </div>

                  {/* 30-Day Forecast */}
                  <div className="bg-blue-600 p-8 rounded-3xl shadow-xl flex items-center gap-6 group">
                     <div className="p-4 bg-white/20 rounded-2xl text-white">
                        <TrendingUp size={32} />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] mb-2">{t.forecast}</h4>
                        <p className="text-xl font-bold text-white">{sitrep.forecast30d}</p>
                     </div>
                  </div>

                  {/* Core Intel Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Target size={14} /> {t.politics}</h5>
                        <p className="text-slate-300 text-sm leading-relaxed">{sitrep.politicalStability}</p>
                     </div>
                     <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={14} /> {t.military}</h5>
                        <p className="text-slate-300 text-sm leading-relaxed">{sitrep.militaryPosture}</p>
                     </div>
                     <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Zap size={14} /> {t.finance}</h5>
                        <p className="text-slate-300 text-sm leading-relaxed">{sitrep.financialIntegrity}</p>
                     </div>
                     <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><History size={14} /> {t.culture}</h5>
                        <p className="text-slate-300 text-sm leading-relaxed">{sitrep.culturalDynamics}</p>
                     </div>
                  </div>

                  {/* External Actor Footprint */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-inner">
                     <div className="bg-slate-800 p-6 border-b border-slate-700 flex items-center gap-3">
                        <Lock className="text-red-500" size={18} />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{t.influences}</h4>
                     </div>
                     <div className="divide-y divide-slate-800">
                        {sitrep.externalInfluences?.map((actor, idx) => (
                           <div key={idx} className="p-8 hover:bg-slate-800/30 transition-all flex flex-col md:flex-row gap-8 items-start">
                              <div className="min-w-[140px]">
                                 <span className="text-lg font-black text-white italic">{actor.actor}</span>
                              </div>
                              <div className="flex-1 space-y-2">
                                 <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">{actor.footprint}</p>
                                 <p className="text-sm text-slate-400 italic leading-relaxed">"{actor.objective}"</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Grounding Sources */}
                  {sitrep.sources && sitrep.sources.length > 0 && (
                     <div className="space-y-4">
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2">{t.sources}</h5>
                        <div className="space-y-2">
                           {sitrep.sources.map((src, i) => (
                              <a 
                                 key={i} 
                                 href={src.web?.uri} 
                                 target="_blank" 
                                 rel="noreferrer" 
                                 className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all group"
                              >
                                 <div className="flex flex-col overflow-hidden pr-4">
                                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">{src.web?.title}</span>
                                    <span className="text-[10px] text-slate-600 truncate">{src.web?.uri}</span>
                                 </div>
                                 <ArrowUpRight size={16} className="text-slate-700 group-hover:text-blue-400 shrink-0" />
                              </a>
                           ))}
                        </div>
                     </div>
                  )}

                  <div className="pt-10 border-t border-slate-800 flex justify-between items-center opacity-30 px-4 font-mono text-[9px] uppercase tracking-[0.5em] text-slate-500">
                    <span>Salus SSR System Terminated</span>
                    <span>Node-AFR-X</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
