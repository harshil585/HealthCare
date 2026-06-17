import { useState } from 'react';
import { MapPin, Search, Navigation, Building2 } from 'lucide-react';

const mockHospitals = [
  { id: 1, name: 'City General Hospital', address: '123 Health Ave, Downtown', distance: '2.4 km away', query: 'City+General+Hospital' },
  { id: 2, name: 'Metro Heart Institute', address: '456 Wellness Blvd, Uptown', distance: '4.1 km away', query: 'Metro+Heart+Institute' },
  { id: 3, name: 'CarePlus Multi-Specialty', address: '789 Recovery Rd, Suburbs', distance: '6.8 km away', query: 'CarePlus+Hospital' },
];

const GoogleMapCard = () => {
  const [search, setSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0]);
  const [customQuery, setCustomQuery] = useState('');

  const filteredHospitals = mockHospitals.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) || 
    h.address.toLowerCase().includes(search.toLowerCase())
  );

  const activeQuery = customQuery || selectedHospital.query;
  // Clean safe embedded Google Maps URL
  const mapIframeUrl = `https://maps.google.com/maps?q=${activeQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white dark:bg-[#0c0c0c] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
            Nearby Hospitals & Navigation
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time interactive routing and proximity tracking
          </p>
        </div>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${activeQuery}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
        >
          <Navigation size={14} /> View on Map
        </a>
      </div>

      {/* Autocomplete / Search input */}
      <div className="relative mb-8">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <Search size={18} className="text-blue-600 dark:text-blue-500" />
          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
        </div>
        <input 
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value.trim().length > 3) {
              setCustomQuery(encodeURIComponent(e.target.value));
            } else if (e.target.value.trim().length === 0) {
              setCustomQuery('');
            }
          }}
          placeholder="Search hospitals by name, area, or address..."
          className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-800 text-base text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
        />
      </div>

      {/* Main Map + Side Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map Canvas */}
        <div className="lg:col-span-2 h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 relative bg-slate-100 dark:bg-black">
          <iframe
            title="Google Maps Location Preview"
            src={mapIframeUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>

        {/* Proximity Facilities List */}
        <div className="space-y-3 overflow-y-auto max-h-72 sm:max-h-80 pr-1 scrollbar-thin">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Proximity Mapping
          </p>
          {filteredHospitals.map((h) => (
            <div 
              key={h.id}
              onClick={() => {
                setSelectedHospital(h);
                setCustomQuery('');
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                selectedHospital.id === h.id && !customQuery
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
                  : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-[#121212]'
              }`}
            >
              <div className="p-2 rounded-lg bg-white dark:bg-black border border-slate-100 dark:border-slate-800 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                <Building2 size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                  {h.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {h.address}
                </p>
                <span className="inline-block mt-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                  {h.distance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapCard;
