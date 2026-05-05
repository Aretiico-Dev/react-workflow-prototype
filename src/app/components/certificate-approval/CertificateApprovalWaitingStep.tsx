import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { CancelOrderDialog } from '../v2/CancelOrderDialog';

export type CertificateApprovalStatus = 'pending_approval' | 'approved' | 'rejected';

interface CertificateApprovalWaitingStepProps {
  certificateLabel: string;
  organizationName: string;
  approverName?: string;
  status: CertificateApprovalStatus;
  rejectionReason?: string;
  onContinue: () => void;
  onBack: () => void;
  onCancel?: () => void;
  onStartNew?: () => void;
  onAutoApprove?: () => void;
}

export function CertificateApprovalWaitingStep({
  certificateLabel,
  organizationName,
  approverName = 'Anne Apple',
  status,
  rejectionReason,
  onContinue,
  onBack,
  onCancel,
  onStartNew,
  onAutoApprove,
}: CertificateApprovalWaitingStepProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    if (status !== 'pending_approval' || !onAutoApprove) {
      return;
    }

    const timer = window.setTimeout(onAutoApprove, 5000);
    return () => window.clearTimeout(timer);
  }, [status, onAutoApprove]);

  const handleCancelOrder = () => {
    setCancelDialogOpen(false);
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        disabled={status !== 'pending_approval'}
        className="flex items-center gap-2 text-[0.875rem] text-[#616161] hover:text-[#101F36] disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Awaiting Organisation Approval</h3>
        <p className="text-[0.875rem] text-[#616161]">
          The organisation details must be approved before this {certificateLabel} can be issued.
        </p>
      </div>

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Approval Request</h4>
          <p className="text-[0.75rem] text-[#616161] mt-1">{approverName} has been asked to review the certificate order.</p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {status === 'pending_approval' && (
            <div className="flex items-start gap-3 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded">
              <Loader2 className="h-5 w-5 text-[#101F36] animate-spin flex-shrink-0 mt-0.5" />
              <p className="text-[0.875rem] text-[#212121]">
                {approverName}, the organisation certificate approver, has been asked to review the certificate order.
              </p>
            </div>
          )}

          {status === 'approved' && (
            <div className="flex items-start gap-3 p-4 bg-[#b9f6ca] border border-[#00c853] rounded">
              <CheckCircle2 className="h-5 w-5 text-[#00c853] flex-shrink-0 mt-0.5" />
              <p className="text-[0.875rem] text-[#212121]">
                {approverName} approved this certificate order.
              </p>
            </div>
          )}

          {status === 'rejected' && (
            <div className="flex items-start gap-3 p-4 bg-[#f9d8d8] border border-[#f44336] rounded">
              <XCircle className="h-5 w-5 text-[#f44336] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[0.875rem] text-[#212121]">
                  {approverName} rejected this certificate order.
                </p>
                <p className="text-[0.75rem] text-[#616161] mt-1">
                  {rejectionReason || 'No reason was provided.'}
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border border-[#e0e0e0] rounded">
              <p className="text-[0.75rem] text-[#616161]">Organisation</p>
              <p className="text-[0.875rem] font-medium text-[#212121] mt-1">{organizationName}</p>
            </div>
            <div className="p-4 border border-[#e0e0e0] rounded">
              <p className="text-[0.75rem] text-[#616161]">Certificate</p>
              <p className="text-[0.875rem] font-medium text-[#212121] mt-1">{certificateLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel && status === 'pending_approval' && (
          <button
            type="button"
            onClick={() => setCancelDialogOpen(true)}
            className="flex-1 px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors"
          >
            CANCEL ORDER
          </button>
        )}
        {status === 'approved' && (
          <button
            onClick={onContinue}
            className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors"
          >
            CONTINUE TO VERIFICATION
          </button>
        )}
        {status === 'rejected' && onStartNew && (
          <button
            onClick={onStartNew}
            className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors"
          >
            START NEW ORDER
          </button>
        )}
      </div>

      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelOrder}
      />
    </div>
  );
}
