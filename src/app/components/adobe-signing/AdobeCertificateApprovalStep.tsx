import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Loader2, ShieldCheck } from 'lucide-react';
import { CancelOrderDialog } from '../v2/CancelOrderDialog';
import { AdobeOrganization, AdobeOrganizationUser } from './adobeSigningData';

interface AdobeCertificateApprovalStepProps {
  organization: AdobeOrganization;
  selectedUser?: AdobeOrganizationUser;
  onApproved: () => void;
  onBack: () => void;
  onCancel?: () => void;
}

export function AdobeCertificateApprovalStep({
  organization,
  selectedUser,
  onApproved,
  onBack,
  onCancel,
}: AdobeCertificateApprovalStepProps) {
  const [approved, setApproved] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setApproved(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const handleCancelOrder = () => {
    setCancelDialogOpen(false);
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        disabled={approved}
        className="flex items-center gap-2 text-[0.875rem] text-[#616161] hover:text-[#101F36] disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Awaiting Organisation Approval</h3>
        <p className="text-[0.875rem] text-[#616161]">
          The certificate request must be approved before issuance.
        </p>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Approval Request</h4>
          <p className="text-[0.75rem] text-[#616161] mt-1">Anne Apple has been asked to review the certificate order.</p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {!approved && (
            <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded">
              <Loader2 className="h-5 w-5 text-[#101F36] animate-spin flex-shrink-0 mt-0.5" />
              <p className="text-[0.875rem] text-[#212121]">
                Anne Apple, the organisation certificate approver, has been asked to review the certificate order.
              </p>
            </div>
          )}

          {approved && (
            <div className="flex items-start gap-3 p-4 bg-[#b9f6ca] border border-[#00c853] rounded">
              <CheckCircle2 className="h-5 w-5 text-[#00c853] flex-shrink-0 mt-0.5" />
              <p className="text-[0.875rem] text-[#212121]">
                Anne Apple approved this Adobe document signing certificate order.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border border-[#e0e0e0] rounded">
              <p className="text-[0.75rem] text-[#616161]">Organisation</p>
              <p className="text-[0.875rem] font-medium text-[#212121] mt-1">{organization.name}</p>
            </div>
            <div className="p-4 border border-[#e0e0e0] rounded">
              <p className="text-[0.75rem] text-[#616161]">Certificate Type</p>
              <p className="text-[0.875rem] font-medium text-[#212121] mt-1">
                {selectedUser ? 'OVIV - Organisation and Individual Validated' : 'OV - Organisation Validated'}
              </p>
            </div>
            <div className="p-4 border border-[#e0e0e0] rounded md:col-span-2">
              <p className="text-[0.75rem] text-[#616161]">Individual Attestation</p>
              <p className="text-[0.875rem] font-medium text-[#212121] mt-1">
                {selectedUser ? `${selectedUser.name} · ${selectedUser.email}` : 'Not requested'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[0.75rem] text-[#616161]">
            <Clock className="w-4 h-4" />
            {approved ? 'Approved just now' : 'Waiting for approver response'}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={() => setCancelDialogOpen(true)}
            disabled={approved}
            className="flex-1 px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors disabled:opacity-50"
          >
            CANCEL ORDER
          </button>
        )}
        <button
          onClick={onApproved}
          disabled={!approved}
          className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          CONTINUE TO DOWNLOAD
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
