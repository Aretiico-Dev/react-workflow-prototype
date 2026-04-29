import { useState } from 'react';
import { Search, Building2, CheckCircle } from 'lucide-react';

interface Organisation {
  id: string;
  name: string;
  type: string;
  registrationNumber: string;
  source: string;
  claimed?: boolean;
}

interface SearchOrganisationStepProps {
  onNext: (org: Organisation) => void;
}

export function SearchOrganisationStep({ onNext }: SearchOrganisationStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<Organisation | null>(null);
  const [searchResults, setSearchResults] = useState<Organisation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock organisations from various UK registers
  const mockOrganisations: Organisation[] = [
    { id: '1', name: 'ABC Limited', type: 'Private Limited Company', registrationNumber: '12345678', source: 'Companies House' },
    { id: '2', name: 'ABC Co-operative Society', type: 'Co-operative Society', registrationNumber: 'IP12345', source: 'FCA Mutuals Register' },
    { id: '3', name: 'ABC Bank PLC', type: 'Bank', registrationNumber: '987654', source: 'FCA Bank Register' },
    { id: '4', name: 'ABC Holdings Ltd', type: 'Private Limited Company', registrationNumber: '11223344', source: 'Companies House' },
    { id: '5', name: 'BCD Ltd', type: 'Private Limited Company', registrationNumber: '22334455', source: 'Companies House', claimed: true },
    { id: '6', name: 'XYZ Corporation', type: 'Public Limited Company', registrationNumber: '55667788', source: 'Companies House' },
  ];

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);

    // Simulate API search
    setTimeout(() => {
      const results = mockOrganisations.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.registrationNumber.includes(searchQuery)
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <div className="max-w-2xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Find Your Organisation
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Search for your organisation in our database of UK legal entities
          </p>

          {/* Search Input */}
          <div className="mb-6">
            <label className="text-[0.875rem] font-medium text-[#212121] block mb-3">
              Organisation Name or Registration Number
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#616161]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHasSearched(false);
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g. ABC Limited or 12345678"
                  className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] focus:outline-none focus:border-[#101F36]"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
                className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'SEARCHING...' : 'SEARCH'}
              </button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <p className="text-[0.875rem] font-medium text-[#212121] mb-3">
                Search Results ({searchResults.length})
              </p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {searchResults.map(org => (
                  <button
                    key={org.id}
                    onClick={() => setSelectedOrg(org)}
                    className={`w-full text-left p-4 border rounded-lg transition-all ${
                      selectedOrg?.id === org.id
                        ? 'border-[#101F36] bg-[#e3f2fd]'
                        : 'border-[#e0e0e0] hover:border-[#90caf9] hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Building2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        selectedOrg?.id === org.id ? 'text-[#101F36]' : 'text-[#616161]'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.875rem] font-medium text-[#212121]">{org.name}</p>
                            <p className="text-[0.75rem] text-[#616161] mt-1">{org.type}</p>
                          </div>
                          {selectedOrg?.id === org.id && (
                            <CheckCircle className="w-5 h-5 text-[#00c853] flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[0.75rem] text-[#616161]">
                            Reg: {org.registrationNumber}
                          </span>
                          <span className="text-[0.75rem] text-[#101F36]">
                            {org.source}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && hasSearched && !isSearching && (
            <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-6 text-center">
              <p className="text-[0.875rem] text-[#616161]">
                No organisations found matching "{searchQuery}"
              </p>
              <p className="text-[0.75rem] text-[#616161] mt-2">
                Try a different search term or contact support if you believe your organisation should be listed
              </p>
            </div>
          )}

          {/* Information */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4">
            <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Data Sources</p>
            <p className="text-[0.75rem] text-[#212121]">
              We search across Companies House, FCA Mutuals Register, FCA Bank Register, and other UK legal entity databases.
            </p>
          </div>

          {/* Action */}
          <div className="mt-6 pt-6 border-t border-[#e0e0e0] flex justify-end">
            <button
              onClick={() => selectedOrg && onNext(selectedOrg)}
              disabled={!selectedOrg}
              className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
