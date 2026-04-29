import { useState } from 'react';
import { Shield, Building2, AlertCircle, Plus, X } from 'lucide-react';
import { CancelOrderDialog } from './CancelOrderDialog';

interface DomainInputStepProps {
  onNext: (domains: string[], certificateType: 'dv' | 'ov', isWildcard: boolean, organizationId?: string) => void;
  onCancel?: () => void;
  hasValidatedOrganization: boolean;
}

type OrganizationStatus = 'validated' | 'expired' | 'suspended' | 'not-validated';

interface Organization {
  id: string;
  name: string;
  status: OrganizationStatus;
  validatedUntil?: string;
}

const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Global Trading Corp',
    status: 'expired',
    validatedUntil: '2025-12-15',
  },
  {
    id: 'org-2',
    name: 'Suspended Industries Ltd',
    status: 'suspended',
  },
  {
    id: 'org-3',
    name: 'Acme Corporation',
    status: 'validated',
    validatedUntil: '2027-03-20',
  },
  {
    id: 'org-4',
    name: 'NewTech Ventures Inc',
    status: 'not-validated',
  },
];

const statusConfig = {
  validated: {
    label: 'Validated',
    color: 'bg-[#b9f6ca] text-[#00c853] border-[#00c853]',
  },
  expired: {
    label: 'Expired',
    color: 'bg-[#f9d8d8] text-[#f44336] border-[#f44336]',
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-[#fff8e1] text-[#ffc107] border-[#ffc107]',
  },
  'not-validated': {
    label: 'Not Validated',
    color: 'bg-[#e0e0e0] text-[#616161] border-[#787878]',
  },
};

export function DomainInputStep({ onNext, onCancel, hasValidatedOrganization }: DomainInputStepProps) {
  const [domains, setDomains] = useState<string[]>(['']);
  const [isWildcard, setIsWildcard] = useState(false);
  const [certificateType, setCertificateType] = useState<'dv' | 'ov'>('dv');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validDomains = domains.filter(d => d.trim() !== '');
    if (validDomains.length > 0 && (certificateType === 'dv' || (certificateType === 'ov' && selectedOrganization))) {
      const processedDomains = isWildcard && validDomains[0]
        ? validDomains.slice(0, 1).map(d => {
            const trimmed = d.trim();
            return trimmed.startsWith('*.') ? trimmed : `*.${trimmed}`;
          })
        : validDomains.map(d => d.trim());
      onNext(processedDomains, certificateType, isWildcard, selectedOrganization || undefined);
    }
  };

  const handleCancelOrder = (reason?: string) => {
    setCancelDialogOpen(false);
    if (onCancel) {
      onCancel();
    }
  };

  const addDomain = () => {
    setDomains([...domains, '']);
  };

  const removeDomain = (index: number) => {
    setDomains(domains.filter((_, i) => i !== index));
  };

  const updateDomain = (index: number, value: string) => {
    const newDomains = [...domains];
    newDomains[index] = value;
    setDomains(newDomains);
  };

  const handleWildcardToggle = (checked: boolean) => {
    setIsWildcard(checked);
    if (checked && domains.length > 1) {
      setDomains([domains[0]]);
    }
  };

  const validatedOrg = mockOrganizations.find(org => org.status === 'validated');
  const hasValidDomain = domains.some(d => d.trim() !== '');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Purchase TLS Certificate</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Secure your domain with SSL/TLS encryption
        </p>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Domain Information</h4>
          <p className="text-[0.875rem] text-[#616161] mt-1">Enter the domain you want to secure</p>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-[0.875rem] font-medium text-[#212121]">
                  Domain Names
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWildcard}
                    onChange={(e) => handleWildcardToggle(e.target.checked)}
                    className="accent-[#101F36]"
                  />
                  <span className="text-[0.875rem] text-[#212121]">Wildcard Certificate</span>
                </label>
              </div>

              {isWildcard && (
                <div className="flex items-start gap-2 p-3 bg-[#e3f2fd] border border-[#90caf9] rounded">
                  <AlertCircle className="w-4 h-4 text-[#101F36] mt-0.5 flex-shrink-0" />
                  <p className="text-[0.75rem] text-[#212121]">
                    Wildcard certificates cover all subdomains (e.g., *.example.com covers app.example.com, api.example.com, etc.)
                    and can only be verified via DNS.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {domains.map((domain, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {isWildcard && (
                          <span className="text-[0.875rem] text-[#616161] font-mono">*.</span>
                        )}
                        <input
                          type="text"
                          placeholder={isWildcard ? "example.com" : "example.com"}
                          value={domain}
                          onChange={(e) => updateDomain(index, e.target.value)}
                          required
                          className="flex-1 px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
                        />
                        {domains.length > 1 && !isWildcard && (
                          <button
                            type="button"
                            onClick={() => removeDomain(index)}
                            className="p-2 text-[#f44336] hover:bg-[#f9d8d8] rounded transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {!isWildcard && (
                  <button
                    type="button"
                    onClick={addDomain}
                    className="flex items-center gap-2 px-4 py-2 text-[0.875rem] text-[#101F36] border border-[#90caf9] rounded hover:bg-[#e3f2fd] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Additional Domain
                  </button>
                )}
              </div>

              <p className="text-[0.75rem] text-[#616161]">
                {isWildcard
                  ? 'Enter the base domain without the wildcard prefix'
                  : 'Enter domain names without protocol (e.g., example.com)'}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-[0.875rem] font-medium text-[#212121]">
                Certificate Type
              </label>

              <label className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-colors ${
                certificateType === 'dv' ? 'border-[#101F36] bg-[#e3f2fd]' : 'border-[#e0e0e0] hover:border-[#90caf9]'
              }`}>
                <input
                  type="radio"
                  name="certificateType"
                  value="dv"
                  checked={certificateType === 'dv'}
                  onChange={(e) => {
                    setCertificateType(e.target.value as 'dv');
                    setSelectedOrganization('');
                  }}
                  className="mt-1 accent-[#101F36]"
                />
                <div className="flex-1">
                  <div className="text-[0.875rem] font-medium text-[#212121]">Domain Validated (DV)</div>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Basic validation. Verifies domain ownership only. Issued within minutes.
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-colors ${
                certificateType === 'ov' ? 'border-[#101F36] bg-[#e3f2fd]' : 'border-[#e0e0e0] hover:border-[#90caf9]'
              } ${!hasValidatedOrganization ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name="certificateType"
                  value="ov"
                  checked={certificateType === 'ov'}
                  onChange={(e) => {
                    setCertificateType(e.target.value as 'ov');
                    if (validatedOrg) {
                      setSelectedOrganization(validatedOrg.id);
                    }
                  }}
                  disabled={!hasValidatedOrganization}
                  className="mt-1 accent-[#101F36]"
                />
                <div className="flex-1">
                  <div className="text-[0.875rem] font-medium text-[#212121]">Organization Validated (OV)</div>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Enhanced validation. Includes organization details in certificate. Better trust indicators.
                  </p>
                  {!hasValidatedOrganization && (
                    <p className="text-[0.75rem] text-[#ffc107] mt-2">
                      You must belong to a validated organization to purchase OV certificates.
                    </p>
                  )}
                </div>
              </label>
            </div>

            {certificateType === 'ov' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-[#101F36]">
                  <Building2 className="w-4 h-4" />
                  <label className="block text-[0.875rem] font-medium text-[#212121]">
                    Select Organization
                  </label>
                </div>

                <div className="space-y-2">
                  {mockOrganizations.map((org) => {
                    const config = statusConfig[org.status];
                    const isSelectable = org.status === 'validated';

                    return (
                      <label
                        key={org.id}
                        className={`flex items-start gap-3 p-3 border rounded transition-colors ${
                          selectedOrganization === org.id
                            ? 'border-[#101F36] bg-[#e3f2fd]'
                            : 'border-[#e0e0e0]'
                        } ${
                          isSelectable
                            ? 'cursor-pointer hover:border-[#90caf9]'
                            : 'cursor-not-allowed opacity-60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="organization"
                          value={org.id}
                          checked={selectedOrganization === org.id}
                          onChange={(e) => setSelectedOrganization(e.target.value)}
                          disabled={!isSelectable}
                          className="mt-1 accent-[#101F36]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[0.875rem] font-medium text-[#212121]">
                              {org.name}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-semibold border ${config.color}`}
                            >
                              {config.label}
                            </span>
                          </div>
                          {org.validatedUntil && org.status === 'validated' && (
                            <p className="text-[0.75rem] text-[#616161] mt-1">
                              Valid until {new Date(org.validatedUntil).toLocaleDateString()}
                            </p>
                          )}
                          {org.status === 'expired' && org.validatedUntil && (
                            <p className="text-[0.75rem] text-[#f44336] mt-1">
                              Validation expired on {new Date(org.validatedUntil).toLocaleDateString()}
                            </p>
                          )}
                          {org.status === 'suspended' && (
                            <p className="text-[0.75rem] text-[#ffc107] mt-1">
                              Organisation access suspended - contact support
                            </p>
                          )}
                          {org.status === 'not-validated' && (
                            <p className="text-[0.75rem] text-[#616161] mt-1">
                              Organisation validation pending
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {certificateType === 'ov' && !selectedOrganization && (
                  <div className="flex items-start gap-2 p-3 bg-[#fff8e1] border border-[#ffc107] rounded">
                    <AlertCircle className="w-4 h-4 text-[#ffc107] mt-0.5 flex-shrink-0" />
                    <p className="text-[0.75rem] text-[#212121]">
                      Please select a validated organization to continue with OV certificate
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={() => setCancelDialogOpen(true)}
                  className="flex-1 px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors"
                >
                  CANCEL ORDER
                </button>
              )}
              <button
                type="submit"
                disabled={!hasValidDomain || (certificateType === 'ov' && !selectedOrganization)}
                className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                CONTINUE TO VERIFICATION
              </button>
            </div>
          </form>
        </div>
      </div>

      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelOrder}
      />
    </div>
  );
}
