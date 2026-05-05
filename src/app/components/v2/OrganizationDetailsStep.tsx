import { useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2, Globe } from 'lucide-react';
import { CancelOrderDialog } from './CancelOrderDialog';

interface OrganizationDetailsStepProps {
  domain: string;
  domains?: string[];
  certificateType: 'dv' | 'ov';
  organizationId?: string;
  onNext: (includeOrg: boolean) => void;
  onBack: () => void;
  onCancel?: () => void;
}

export function OrganizationDetailsStep({ domain, domains, certificateType, organizationId, onNext, onBack, onCancel }: OrganizationDetailsStepProps) {
  const [includeOrg, setIncludeOrg] = useState(certificateType === 'ov');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const displayDomains = domains || [domain];

  const mockOrgData = {
    id: organizationId || 'org-3',
    name: 'Acme Corporation',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    validatedDate: '2025-08-15',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(includeOrg);
  };

  const handleCancelOrder = (reason?: string) => {
    setCancelDialogOpen(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[0.875rem] text-[#616161] hover:text-[#101F36]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Organization Details</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Configure organization validation for your certificate
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded">
        <CheckCircle2 className="h-5 w-5 text-[#00c853] flex-shrink-0 mt-0.5" />
        <p className="text-[0.875rem] text-[#212121]">
          {displayDomains.length === 1 ? 'Domain' : 'Domains'} captured successfully. Domain ownership verification will follow organisation approval if required.
        </p>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#101F36]" />
            <h4 className="text-[1.125rem] font-semibold text-[#212121]">Certificate Domains</h4>
          </div>
        </div>
        <div className="px-6 py-6">
          <p className="text-[0.875rem] text-[#616161] mb-3">
            {displayDomains.length === 1 ? 'This certificate will be issued for:' : `This certificate will be issued for ${displayDomains.length} domains:`}
          </p>
          <div className="flex flex-wrap gap-2">
            {displayDomains.map((d, index) => (
              <span key={index} className="px-3 py-2 bg-[#e3f2fd] text-[#101F36] text-[0.875rem] font-mono rounded border border-[#90caf9]">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Certificate Type</h4>
          <p className="text-[0.875rem] text-[#616161] mt-1">Choose whether to include your organization details</p>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-colors ${
                !includeOrg ? 'border-[#101F36] bg-[#e3f2fd]' : 'border-[#e0e0e0] hover:border-[#90caf9]'
              }`}>
                <input
                  type="radio"
                  name="orgOption"
                  checked={!includeOrg}
                  onChange={() => setIncludeOrg(false)}
                  className="mt-1 accent-[#101F36]"
                />
                <div className="flex-1">
                  <div className="text-[0.875rem] font-medium text-[#212121]">Domain Validated Only</div>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Issue a standard DV certificate without organization information
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-colors ${
                includeOrg ? 'border-[#101F36] bg-[#e3f2fd]' : 'border-[#e0e0e0] hover:border-[#90caf9]'
              }`}>
                <input
                  type="radio"
                  name="orgOption"
                  checked={includeOrg}
                  onChange={() => setIncludeOrg(true)}
                  className="mt-1 accent-[#101F36]"
                />
                <div className="flex-1">
                  <div className="text-[0.875rem] font-medium text-[#212121]">Organization Validated (OV)</div>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Include your validated organization details in the certificate for enhanced trust
                  </p>
                </div>
              </label>
            </div>

            {includeOrg && (
              <div className="bg-[#fafafa] rounded border border-[#e0e0e0] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-[#101F36]" />
                  <h5 className="text-[1rem] font-semibold text-[#212121]">Validated Organization</h5>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[0.75rem] text-[#616161]">Organization Name</p>
                      <p className="text-[0.875rem] font-medium text-[#212121]">{mockOrgData.name}</p>
                    </div>
                    <div>
                      <p className="text-[0.75rem] text-[#616161]">Country</p>
                      <p className="text-[0.875rem] font-medium text-[#212121]">{mockOrgData.country}</p>
                    </div>
                    <div>
                      <p className="text-[0.75rem] text-[#616161]">State/Province</p>
                      <p className="text-[0.875rem] font-medium text-[#212121]">{mockOrgData.state}</p>
                    </div>
                    <div>
                      <p className="text-[0.75rem] text-[#616161]">City</p>
                      <p className="text-[0.875rem] font-medium text-[#212121]">{mockOrgData.city}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e0e0e0]">
                    <p className="text-[0.75rem] text-[#616161]">Validated on</p>
                    <p className="text-[0.875rem] font-medium text-[#212121]">
                      {new Date(mockOrgData.validatedDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-white border border-[#e0e0e0] rounded p-3">
                    <p className="text-[0.75rem] text-[#616161]">
                      These details will be included in your certificate's subject field
                    </p>
                  </div>
                </div>
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
                className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors"
              >
                {includeOrg ? 'ORDER OV CERTIFICATE' : 'ORDER DV CERTIFICATE'}
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
