import { useState } from 'react';
import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { CertificateApprovalStatus } from './CertificateApprovalWaitingStep';

interface CertificateApproverReviewStepProps {
  title: string;
  certificateLabel: string;
  organizationName: string;
  subjectLabel: string;
  subjectValue: string;
  status: CertificateApprovalStatus;
  rejectionReason?: string;
  onApprove: () => void;
  onReject: (reason?: string) => void;
}

export function CertificateApproverReviewStep({
  title,
  certificateLabel,
  organizationName,
  subjectLabel,
  subjectValue,
  status,
  rejectionReason,
  onApprove,
  onReject,
}: CertificateApproverReviewStepProps) {
  const [reason, setReason] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">{title}</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Review the organisation-attested certificate request and approve or reject issuance.
        </p>
      </div>

      {status === 'approved' && (
        <div className="flex items-start gap-3 p-4 bg-[#b9f6ca] border border-[#00c853] rounded">
          <CheckCircle2 className="h-5 w-5 text-[#00c853] flex-shrink-0 mt-0.5" />
          <p className="text-[0.875rem] text-[#212121]">This certificate order has been approved.</p>
        </div>
      )}

      {status === 'rejected' && (
        <div className="flex items-start gap-3 p-4 bg-[#f9d8d8] border border-[#f44336] rounded">
          <XCircle className="h-5 w-5 text-[#f44336] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[0.875rem] text-[#212121]">This certificate order has been rejected.</p>
            {rejectionReason && (
              <p className="text-[0.75rem] text-[#616161] mt-1">{rejectionReason}</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#101F36]" />
            Order Details
          </h4>
          <p className="text-[0.75rem] text-[#616161] mt-1">Submitted for organisation certificate approval</p>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border border-[#e0e0e0] rounded">
              <p className="text-[0.75rem] text-[#616161]">Organisation</p>
              <p className="text-[0.875rem] font-medium text-[#212121] mt-1">{organizationName}</p>
            </div>
            <div className="p-4 border border-[#e0e0e0] rounded">
              <p className="text-[0.75rem] text-[#616161]">Certificate Type</p>
              <p className="text-[0.875rem] font-medium text-[#212121] mt-1">{certificateLabel}</p>
            </div>
            <div className="p-4 border border-[#e0e0e0] rounded md:col-span-2">
              <p className="text-[0.75rem] text-[#616161]">{subjectLabel}</p>
              <p className="text-[0.875rem] font-medium text-[#212121] mt-1 break-all">{subjectValue}</p>
            </div>
          </div>

          {status === 'pending_approval' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor={`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-reason`} className="block text-[0.875rem] font-medium text-[#212121]">
                  Rejection reason (optional)
                </label>
                <textarea
                  id={`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-reason`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Add a reason if rejecting this certificate order..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-[#787878] rounded-lg focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36] resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onReject(reason.trim() || undefined)}
                  className="flex-1 px-6 py-3 border border-[#f44336] text-[#f44336] rounded hover:bg-[#f9d8d8] transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  REJECT ORDER
                </button>
                <button
                  type="button"
                  onClick={onApprove}
                  className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  APPROVE ORDER
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
