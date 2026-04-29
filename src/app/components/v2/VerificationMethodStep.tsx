import { useState } from 'react';
import { ArrowLeft, Globe, FileText } from 'lucide-react';
import { CancelOrderDialog } from './CancelOrderDialog';

interface VerificationMethodStepProps {
  domains: string[];
  isWildcard: boolean;
  onNext: (method: 'http' | 'dns') => void;
  onBack: () => void;
  onCancel?: () => void;
}

export function VerificationMethodStep({ domains, isWildcard, onNext, onBack, onCancel }: VerificationMethodStepProps) {
  const [method, setMethod] = useState<'http' | 'dns'>(isWildcard ? 'dns' : 'http');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(method);
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
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Domain Verification</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Choose how you want to verify ownership of {domains.length === 1 ? domains[0] : `${domains.length} domains`}
        </p>
      </div>

      {domains.length > 1 && (
        <div className="bg-white rounded border border-[#e0e0e0] p-4">
          <p className="text-[0.875rem] font-medium text-[#212121] mb-2">Domains to verify:</p>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain, index) => (
              <span key={index} className="px-3 py-1 bg-[#e3f2fd] text-[#101F36] text-[0.75rem] rounded-full border border-[#90caf9]">
                {domain}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Verification Method</h4>
          <p className="text-[0.875rem] text-[#616161] mt-1">Select your preferred verification method</p>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-[0.875rem] font-medium text-[#212121]">
                How would you like to verify domain control?
              </label>

              <label className={`flex items-start gap-4 p-4 border rounded transition-colors ${
                isWildcard ? 'opacity-50 cursor-not-allowed border-[#e0e0e0]' :
                method === 'http' ? 'border-[#101F36] bg-[#e3f2fd] cursor-pointer' : 'border-[#e0e0e0] hover:border-[#90caf9] cursor-pointer'
              }`}>
                <input
                  type="radio"
                  name="method"
                  value="http"
                  checked={method === 'http'}
                  onChange={(e) => setMethod(e.target.value as 'http')}
                  disabled={isWildcard}
                  className="mt-1 accent-[#101F36]"
                />
                <FileText className="w-5 h-5 text-[#616161] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[0.875rem] font-medium text-[#212121]">
                    HTTP File Upload
                    {isWildcard && (
                      <span className="ml-2 px-2 py-0.5 bg-[#e0e0e0] text-[#616161] text-[0.625rem] rounded-full">
                        Not available for wildcard
                      </span>
                    )}
                  </div>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Upload a verification file to your web server at a specific path
                  </p>
                  {!isWildcard && domains.length === 1 && (
                    <div className="mt-3 p-3 bg-[#fafafa] rounded text-[0.75rem] font-mono text-[#212121] break-all">
                      http://{domains[0]}/.well-known/pki-validation/fileauth.txt
                    </div>
                  )}
                  <div className="mt-2 text-[0.75rem] text-[#616161]">
                    <strong>Best for:</strong> Users with direct file system or FTP access
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-4 p-4 border rounded cursor-pointer transition-colors ${
                method === 'dns' ? 'border-[#101F36] bg-[#e3f2fd]' : 'border-[#e0e0e0] hover:border-[#90caf9]'
              }`}>
                <input
                  type="radio"
                  name="method"
                  value="dns"
                  checked={method === 'dns'}
                  onChange={(e) => setMethod(e.target.value as 'dns')}
                  className="mt-1 accent-[#101F36]"
                />
                <Globe className="w-5 h-5 text-[#616161] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[0.875rem] font-medium text-[#212121]">
                    DNS TXT Record
                    {isWildcard && (
                      <span className="ml-2 px-2 py-0.5 bg-[#b9f6ca] text-[#00c853] text-[0.625rem] rounded-full border border-[#00c853]">
                        Required for wildcard
                      </span>
                    )}
                  </div>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Add a TXT record to your domain's DNS configuration
                  </p>
                  {domains.length === 1 && (
                    <div className="mt-3 p-3 bg-[#fafafa] rounded text-[0.75rem] font-mono text-[#212121] break-all">
                      _acme-challenge.{domains[0].replace(/^\*\./, '')}
                    </div>
                  )}
                  <div className="mt-2 text-[0.75rem] text-[#616161]">
                    <strong>Best for:</strong> Users with DNS management access. {isWildcard ? 'Required for wildcard certificates.' : 'May take longer due to DNS propagation.'}
                  </div>
                </div>
              </label>
            </div>

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
                CONTINUE
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
