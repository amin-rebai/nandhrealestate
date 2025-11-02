import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SearchFilters {
  type: 'sale' | 'rent' | 'residential';
  location: string;
  propertyType: string;
  bedrooms: string;
  priceRange: string;
}

const PropertySearchWidget: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'residential'>('sale');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Navigate to properties page with search parameters
    const searchParams = new URLSearchParams();
    searchParams.set('category', activeTab);
    if (searchQuery.trim()) {
      searchParams.set('location', searchQuery.trim());
    }
    
    navigate(`/properties?${searchParams.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="property-search-widget">
      <div className="search-widget-container">
        {/* Search Tabs */}
        <div className="search-tabs">
          <button
            className={`search-tab ${activeTab === 'sale' ? 'active' : ''}`}
            onClick={() => setActiveTab('sale')}
          >
            Buy
          </button>
          <button
            className={`search-tab ${activeTab === 'rent' ? 'active' : ''}`}
            onClick={() => setActiveTab('rent')}
          >
            Rent
          </button>
          <button
            className={`search-tab ${activeTab === 'residential' ? 'active' : ''}`}
            onClick={() => setActiveTab('residential')}
          >
            Off-Plan
          </button>
        </div>

        {/* Search Input */}
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <svg 
              className="search-icon" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search apartments by location, building or community"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
          </div>
          
          <button 
            className="search-button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Quick Filters for Apartments */}
        <div className="quick-filters">
          <span className="filter-label">Popular Locations:</span>
          <button
            className="quick-filter-btn"
            onClick={() => {
              setSearchQuery('Lusail');
              setActiveTab('rent');
            }}
          >
            Lusail Apartments
          </button>
          <button
            className="quick-filter-btn"
            onClick={() => {
              setSearchQuery('West Bay');
              setActiveTab('rent');
            }}
          >
            West Bay Towers
          </button>
          <button
            className="quick-filter-btn"
            onClick={() => {
              setSearchQuery('Downtown Doha');
              setActiveTab('sale');
            }}
          >
            Downtown Condos
          </button>
          <button
            className="quick-filter-btn"
            onClick={() => {
              setSearchQuery('The Pearl');
              setActiveTab('sale');
            }}
          >
            The Pearl
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertySearchWidget;
