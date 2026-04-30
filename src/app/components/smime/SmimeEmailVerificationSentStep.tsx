import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import { CancelOrderDialog } from '../v2/CancelOrderDialog';

interface SmimeEmailVerificationSentStepProps {
  emailAddress: string;
  verificationCode: string;
  onVerified: () => void;
  onBack: () => void;
  onCancel?: () => void;
}

export function SmimeEmailVerificationSentStep({
  emailAddress,
  verificationCode,
  onVerified,
  onBack,
  onCancel,
}: SmimeEmailVerificationSentStepProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleVerified = () => {
    setVerifying(true);
    window.setTimeout(() => {
      setVerifying(false);
      onVerified();
    }, 1000);
  };

  const handleCancelOrder = () => {
    setCancelDialogOpen(false);
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        disabled={verifying}
        className="flex items-center gap-2 text-[0.875rem] text-[#616161] hover:text-[#101F36] disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Verify Email Control</h3>
        <p className="text-[0.875rem] text-[#616161]">
          We sent a verification email to {emailAddress}
        </p>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Verification Code</h4>
          <p className="text-[0.75rem] text-[#616161] mt-1">Use this code on the page opened from your email link</p>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded">
            <Mail className="h-5 w-5 text-[#101F36] flex-shrink-0 mt-0.5" />
            <p className="text-[0.875rem] text-[#212121]">
              Open your inbox, click the link in the verification email, and enter the code below on the verification page.
            </p>
          </div>

          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center px-8 py-5 bg-[#fafafa] border border-[#e0e0e0] rounded">
              <span className="font-mono text-[2rem] tracking-[0.35em] text-[#101F36] pl-[0.35em]">
                {verificationCode}
              </span>
            </div>
            <p className="text-[0.75rem] text-[#616161] mt-3">
              This code expires when the certificate order is cancelled.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[#b9f6ca] border border-[#00c853] rounded">
            <CheckCircle2 className="h-5 w-5 text-[#00c853] flex-shrink-0 mt-0.5" />
            <p className="text-[0.875rem] text-[#212121]">
              For this prototype, use the button below to simulate the user completing the external verification page.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={() => setCancelDialogOpen(true)}
            disabled={verifying}
            className="flex-1 px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors disabled:opacity-50"
          >
            CANCEL ORDER
          </button>
        )}
        <button
          onClick={handleVerified}
          disabled={verifying}
          className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          {verifying ? 'VERIFYING...' : 'CONTINUE'}
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
