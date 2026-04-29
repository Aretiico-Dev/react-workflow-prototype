import { useEffect, useState } from 'react';
import { ArrowLeft, Copy, CheckCircle2, Clock, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CancelOrderDialog } from './CancelOrderDialog';

interface VerificationInProgressStepProps {
  domain: string;
  method: 'http' | 'dns';
  onVerified: () => void;
  onBack: () => void;
  onCancel?: () => void;
}

type VerificationStatus = 'pending' | 'verifying' | 'success' | 'failed';

export function VerificationInProgressStep({ domain, method, onVerified, onBack, onCancel }: VerificationInProgressStepProps) {
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [verificationToken] = useState(() =>
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  );
  const [attempts, setAttempts] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const verificationInstructions = method === 'http' ? {
    title: 'HTTP File Upload Instructions',
    steps: [
      'Download or create a file named "fileauth.txt"',
      `Upload the file to: http://${domain}/.well-known/pki-validation/`,
      'Ensure the file is publicly accessible',
      'Click "Verify Domain" to check'
    ],
    filepath: `http://${domain}/.well-known/pki-validation/fileauth.txt`,
  } : {
    title: 'DNS TXT Record Instructions',
    steps: [
      'Log in to your DNS provider',
      `Add a TXT record with name: _acme-challenge.${domain}`,
      `Set the value to: ${verificationToken}`,
      'Wait for DNS propagation (typically 5-30 minutes)',
      'Click "Verify Domain" to check'
    ],
    recordName: `_acme-challenge.${domain}`,
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const simulateVerification = () => {
    setStatus('verifying');
    setLastChecked(new Date());
    setAttempts(prev => prev + 1);

    setTimeout(() => {
      if (Math.random() > 0.3 && attempts >= 1) {
        setStatus('success');
        setTimeout(() => onVerified(), 1500);
      } else {
        setStatus('failed');
      }
    }, 2000);
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
        disabled={status === 'verifying'}
        className="flex items-center gap-2 text-[0.875rem] text-[#616161] hover:text-[#101F36] disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Verify Domain Ownership</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Complete the verification process for {domain}
        </p>
      </div>

      {status === 'success' && (
        <div className="flex items-start gap-3 p-4 bg-[#b9f6ca] border border-[#00c853] rounded">
          <CheckCircle2 className="h-5 w-5 text-[#00c853] flex-shrink-0 mt-0.5" />
          <p className="text-[0.875rem] text-[#212121]">
            Domain verified successfully! Proceeding to next step...
          </p>
        </div>
      )}

      {status === 'failed' && (
        <div className="flex items-start gap-3 p-4 bg-[#f9d8d8] border border-[#f44336] rounded">
          <XCircle className="h-5 w-5 text-[#f44336] flex-shrink-0 mt-0.5" />
          <p className="text-[0.875rem] text-[#212121]">
            Verification failed. Please check your configuration and try again.
            {method === 'dns' && ' DNS records may take up to 30 minutes to propagate.'}
          </p>
        </div>
      )}

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">{verificationInstructions.title}</h4>
          <p className="text-[0.875rem] text-[#616161] mt-1">Follow these steps to verify your domain ownership</p>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="space-y-3">
            {verificationInstructions.steps.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e3f2fd] text-[#101F36] text-[0.75rem] font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-[0.875rem] text-[#212121] pt-0.5">{step}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {method === 'http' && (
              <div className="space-y-2">
                <label className="block text-[0.875rem] font-medium text-[#212121]">Verification Token</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-[#fafafa] border border-[#e0e0e0] rounded font-mono text-[0.75rem] break-all">
                    {verificationToken}
                  </div>
                  <button
                    onClick={() => copyToClipboard(verificationToken, 'Token')}
                    className="px-3 py-2 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors"
                  >
                    <Copy className="w-4 h-4 text-[#616161]" />
                  </button>
                </div>
                <p className="text-[0.75rem] text-[#616161]">This is the content your file should contain</p>
              </div>
            )}

            {method === 'dns' && (
              <>
                <div className="space-y-2">
                  <label className="block text-[0.875rem] font-medium text-[#212121]">Record Name</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-[#fafafa] border border-[#e0e0e0] rounded font-mono text-[0.75rem] break-all">
                      {verificationInstructions.recordName}
                    </div>
                    <button
                      onClick={() => copyToClipboard(verificationInstructions.recordName!, 'Record name')}
                      className="px-3 py-2 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors"
                    >
                      <Copy className="w-4 h-4 text-[#616161]" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[0.875rem] font-medium text-[#212121]">Record Value</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-[#fafafa] border border-[#e0e0e0] rounded font-mono text-[0.75rem] break-all">
                      {verificationToken}
                    </div>
                    <button
                      onClick={() => copyToClipboard(verificationToken, 'Record value')}
                      className="px-3 py-2 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors"
                    >
                      <Copy className="w-4 h-4 text-[#616161]" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#fff8e1] border border-[#ffc107] rounded">
                  <AlertCircle className="h-5 w-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
                  <p className="text-[0.875rem] text-[#212121]">
                    DNS changes can take 5-30 minutes to propagate globally. If verification fails, please wait and try again.
                  </p>
                </div>
              </>
            )}
          </div>

          {lastChecked && (
            <div className="flex items-center gap-2 text-[0.75rem] text-[#616161]">
              <Clock className="w-4 h-4" />
              Last checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}

          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={() => setCancelDialogOpen(true)}
                disabled={status === 'verifying'}
                className="flex-1 px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors disabled:opacity-50"
              >
                CANCEL ORDER
              </button>
            )}
            <button
              onClick={simulateVerification}
              disabled={status === 'verifying'}
              className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {status === 'verifying' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  VERIFYING...
                </>
              ) : (
                'VERIFY DOMAIN'
              )}
            </button>
          </div>

          <p className="text-[0.75rem] text-[#616161] text-center">
            Verification is automatic. Click the button above after completing the setup.
          </p>
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
