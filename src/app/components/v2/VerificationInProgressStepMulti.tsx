import { useState } from 'react';
import { ArrowLeft, Copy, CheckCircle2, Clock, XCircle, RefreshCw, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { CancelOrderDialog } from './CancelOrderDialog';

interface VerificationInProgressStepMultiProps {
  domains: string[];
  method: 'http' | 'dns';
  onVerified: () => void;
  onBack: () => void;
  onCancel?: () => void;
}

type VerificationStatus = 'pending' | 'verifying' | 'success' | 'failed';

interface DomainVerification {
  domain: string;
  status: VerificationStatus;
  token: string;
  lastChecked: Date | null;
  attempts: number;
  expanded: boolean;
}

export function VerificationInProgressStepMulti({ domains, method, onVerified, onBack, onCancel }: VerificationInProgressStepMultiProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [domainVerifications, setDomainVerifications] = useState<DomainVerification[]>(
    domains.map(domain => ({
      domain,
      status: 'pending' as VerificationStatus,
      token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      lastChecked: null,
      attempts: 0,
      expanded: domains.length === 1,
    }))
  );

  const allVerified = domainVerifications.every(dv => dv.status === 'success');
  const anyVerifying = domainVerifications.some(dv => dv.status === 'verifying');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const toggleExpanded = (index: number) => {
    setDomainVerifications(prev =>
      prev.map((dv, i) => i === index ? { ...dv, expanded: !dv.expanded } : dv)
    );
  };

  const simulateVerification = (index: number) => {
    setDomainVerifications(prev =>
      prev.map((dv, i) => i === index ? {
        ...dv,
        status: 'verifying' as VerificationStatus,
        lastChecked: new Date(),
        attempts: dv.attempts + 1,
      } : dv)
    );

    setTimeout(() => {
      setDomainVerifications(prev =>
        prev.map((dv, i) => i === index ? {
          ...dv,
          status: (Math.random() > 0.3 && dv.attempts >= 1) ? 'success' as VerificationStatus : 'failed' as VerificationStatus,
        } : dv)
      );

      setTimeout(() => {
        const allSuccess = domainVerifications.every((dv, i) =>
          i === index ? (Math.random() > 0.3 && dv.attempts >= 1) : dv.status === 'success'
        );
        if (allSuccess) {
          setTimeout(() => onVerified(), 1500);
        }
      }, 100);
    }, 2000);
  };

  const handleCancelOrder = (reason?: string) => {
    setCancelDialogOpen(false);
    if (onCancel) {
      onCancel();
    }
  };

  const getRecordName = (domain: string) => {
    const baseDomain = domain.replace(/^\*\./, '');
    return `_acme-challenge.${baseDomain}`;
  };

  const getFilePath = (domain: string) => {
    return `http://${domain}/.well-known/pki-validation/fileauth.txt`;
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        disabled={anyVerifying}
        className="flex items-center gap-2 text-[0.875rem] text-[#616161] hover:text-[#101F36] disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Verify Domain Ownership</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Complete the verification process for {domains.length === 1 ? domains[0] : `${domains.length} domains`}
        </p>
      </div>

      {allVerified && (
        <div className="flex items-start gap-3 p-4 bg-[#b9f6ca] border border-[#00c853] rounded">
          <CheckCircle2 className="h-5 w-5 text-[#00c853] flex-shrink-0 mt-0.5" />
          <p className="text-[0.875rem] text-[#212121]">
            All domains verified successfully! Proceeding to next step...
          </p>
        </div>
      )}

      <div className="space-y-4">
        {domainVerifications.map((dv, index) => (
          <div
            key={index}
            className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]"
          >
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-center gap-3 flex-1">
                {dv.status === 'success' && <CheckCircle2 className="w-5 h-5 text-[#00c853]" />}
                {dv.status === 'failed' && <XCircle className="w-5 h-5 text-[#f44336]" />}
                {dv.status === 'verifying' && <RefreshCw className="w-5 h-5 text-[#101F36] animate-spin" />}
                {dv.status === 'pending' && <Clock className="w-5 h-5 text-[#616161]" />}

                <div className="flex-1">
                  <h4 className="text-[1rem] font-semibold text-[#212121]">{dv.domain}</h4>
                  <p className="text-[0.75rem] text-[#616161] mt-0.5">
                    {dv.status === 'success' && 'Verified'}
                    {dv.status === 'failed' && 'Verification failed'}
                    {dv.status === 'verifying' && 'Verifying...'}
                    {dv.status === 'pending' && 'Awaiting verification'}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[0.625rem] font-semibold border ${
                    dv.status === 'success' ? 'bg-[#b9f6ca] text-[#00c853] border-[#00c853]' :
                    dv.status === 'failed' ? 'bg-[#f9d8d8] text-[#f44336] border-[#f44336]' :
                    dv.status === 'verifying' ? 'bg-[#e3f2fd] text-[#101F36] border-[#90caf9]' :
                    'bg-[#fafafa] text-[#616161] border-[#e0e0e0]'
                  }`}
                >
                  {dv.status === 'success' && 'VERIFIED'}
                  {dv.status === 'failed' && 'FAILED'}
                  {dv.status === 'verifying' && 'VERIFYING'}
                  {dv.status === 'pending' && 'PENDING'}
                </span>
              </div>

              <button className="ml-4 p-1">
                {dv.expanded ? <ChevronUp className="w-5 h-5 text-[#616161]" /> : <ChevronDown className="w-5 h-5 text-[#616161]" />}
              </button>
            </div>

            {dv.expanded && (
              <>
                <div className="border-t border-[#e0e0e0]"></div>
                <div className="px-6 py-6 space-y-6">
                  {dv.status === 'failed' && (
                    <div className="flex items-start gap-3 p-4 bg-[#f9d8d8] border border-[#f44336] rounded">
                      <XCircle className="h-5 w-5 text-[#f44336] flex-shrink-0 mt-0.5" />
                      <p className="text-[0.875rem] text-[#212121]">
                        Verification failed. Please check your configuration and try again.
                        {method === 'dns' && ' DNS records may take up to 30 minutes to propagate.'}
                      </p>
                    </div>
                  )}

                  {method === 'http' && (
                    <div className="space-y-2">
                      <label className="block text-[0.875rem] font-medium text-[#212121]">File Location</label>
                      <div className="p-3 bg-[#fafafa] border border-[#e0e0e0] rounded text-[0.75rem] font-mono text-[#212121] break-all">
                        {getFilePath(dv.domain)}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-[0.875rem] font-medium text-[#212121]">
                      {method === 'dns' ? 'Record Name' : 'Verification Token'}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-[#fafafa] border border-[#e0e0e0] rounded font-mono text-[0.75rem] break-all">
                        {method === 'dns' ? getRecordName(dv.domain) : dv.token}
                      </div>
                      <button
                        onClick={() => copyToClipboard(
                          method === 'dns' ? getRecordName(dv.domain) : dv.token,
                          method === 'dns' ? 'Record name' : 'Token'
                        )}
                        className="px-3 py-2 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors"
                      >
                        <Copy className="w-4 h-4 text-[#616161]" />
                      </button>
                    </div>
                  </div>

                  {method === 'dns' && (
                    <div className="space-y-2">
                      <label className="block text-[0.875rem] font-medium text-[#212121]">Record Value</label>
                      <div className="flex gap-2">
                        <div className="flex-1 p-3 bg-[#fafafa] border border-[#e0e0e0] rounded font-mono text-[0.75rem] break-all">
                          {dv.token}
                        </div>
                        <button
                          onClick={() => copyToClipboard(dv.token, 'Record value')}
                          className="px-3 py-2 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors"
                        >
                          <Copy className="w-4 h-4 text-[#616161]" />
                        </button>
                      </div>
                    </div>
                  )}

                  {dv.lastChecked && (
                    <div className="flex items-center gap-2 text-[0.75rem] text-[#616161]">
                      <Clock className="w-4 h-4" />
                      Last checked: {dv.lastChecked.toLocaleTimeString()}
                    </div>
                  )}

                  <button
                    onClick={() => simulateVerification(index)}
                    disabled={dv.status === 'verifying' || dv.status === 'success'}
                    className="w-full px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {dv.status === 'verifying' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        VERIFYING...
                      </>
                    ) : dv.status === 'success' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        VERIFIED
                      </>
                    ) : (
                      'VERIFY DOMAIN'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {method === 'dns' && (
        <div className="flex items-start gap-3 p-4 bg-[#fff8e1] border border-[#ffc107] rounded">
          <AlertCircle className="h-5 w-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
          <p className="text-[0.875rem] text-[#212121]">
            DNS changes can take 5-30 minutes to propagate globally. If verification fails, please wait and try again.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={() => setCancelDialogOpen(true)}
            disabled={anyVerifying}
            className="flex-1 px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors disabled:opacity-50"
          >
            CANCEL ORDER
          </button>
        )}
        <button
          onClick={onVerified}
          disabled={!allVerified || anyVerifying}
          className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          CONTINUE
        </button>
      </div>

      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelOrder}
      />
    </div>
  );
}
