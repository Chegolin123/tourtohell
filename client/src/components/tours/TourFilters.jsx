import React from 'react';


const TourFilters = ({ filters, setFilters }) => {
  const countries = [
    'Р РѕСЃСЃРёСЏ',
    'Р­С„РёРѕРїРёСЏ',
    'РСЃР»Р°РЅРґРёСЏ',
    'РРЅРґРѕРЅРµР·РёСЏ',
    'РџРµСЂСѓ',
    'РС‚Р°Р»РёСЏ',
    'РЇРїРѕРЅРёСЏ'
  ];

  const categories = [
    { value: 'all', label: 'Р’СЃРµ РЅР°РїСЂР°РІР»РµРЅРёСЏ' },
    { value: 'russia', label: 'рџ‡·рџ‡є Р РѕСЃСЃРёСЏ' },
    { value: 'world', label: 'рџЊЌ РњРёСЂ' },
    { value: 'exclusive', label: 'рџ”Ґ Р­РєСЃРєР»СЋР·РёРІ' }
  ];

  const durations = [
    { value: 'all', label: 'Р›СЋР±Р°СЏ РґР»РёС‚РµР»СЊРЅРѕСЃС‚СЊ' },
    { value: '1-3', label: '1-3 РґРЅСЏ' },
    { value: '4-7', label: '4-7 РґРЅРµР№' },
    { value: '8-14', label: '8-14 РґРЅРµР№' },
    { value: '15+', label: 'Р‘РѕР»РµРµ 14 РґРЅРµР№' }
  ];

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters({
      ...filters,
      priceRange: [filters.priceRange[0], value]
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      country: 'all',
      priceRange: [0, 500000],
      duration: 'all',
      sortBy: 'popular'
    });
  };

  return (
    <div className="filters-container">
      <h3>Р¤РёР»СЊС‚СЂС‹</h3>
      
      <div className="filter-section">
        <label>РџРѕРёСЃРє</label>
        <input
          type="text"
          placeholder="РќР°Р·РІР°РЅРёРµ РёР»Рё СЃС‚СЂР°РЅР°..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="filter-input"
        />
      </div>

      <div className="filter-section">
        <label>РљР°С‚РµРіРѕСЂРёСЏ</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          className="filter-select"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>РЎС‚СЂР°РЅР°</label>
        <select
          value={filters.country}
          onChange={(e) => setFilters({...filters, country: e.target.value})}
          className="filter-select"
        >
          <option value="all">Р’СЃРµ СЃС‚СЂР°РЅС‹</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Р¦РµРЅР° РґРѕ: {filters.priceRange[1].toLocaleString()} в‚Ѕ</label>
        <input
          type="range"
          min="0"
          max="500000"
          step="10000"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="filter-range"
        />
        <div className="price-labels">
          <span>0 в‚Ѕ</span>
          <span>500 000 в‚Ѕ</span>
        </div>
      </div>

      <div className="filter-section">
        <label>Р”Р»РёС‚РµР»СЊРЅРѕСЃС‚СЊ</label>
        <select
          value={filters.duration}
          onChange={(e) => setFilters({...filters, duration: e.target.value})}
          className="filter-select"
        >
          {durations.map(dur => (
            <option key={dur.value} value={dur.value}>{dur.label}</option>
          ))}
        </select>
      </div>

      <button onClick={resetFilters} className="btn-reset">
        РЎР±СЂРѕСЃРёС‚СЊ С„РёР»СЊС‚СЂС‹
      </button>
    </div>
  );
};

export default TourFilters;