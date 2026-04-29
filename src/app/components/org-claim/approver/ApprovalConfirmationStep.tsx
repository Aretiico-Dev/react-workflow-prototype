import { CheckCircle2, XCircle, Mail } from 'lucide-react';

interface ApprovalConfirmationStepProps {
  decision: 'approved' | 'rejected';
  claimantName: string;
  organisationName: string;
}

export function ApprovalConfirmationStep({ decision, claimantName, organisationName }: ApprovalConfirmationStepProps) {
  const isApproved = decision === 'approved';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12">
        <div className="text-center max-w-lg mx-auto">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isApproved ? 'bg-[#b9f6ca]' : 'bg-[#f9d8d8]'
          }`}>
            {isApproved ? (
              <CheckCircle2 className="w-12 h-12 text-[#00c853]" />
            ) : (
              <XCircle className="w-12 h-12 text-[#f44336]" />
            )}
          </div>

          <h4 className="text-[1.5rem] font-semibold text-[#212121] mb-3">
            {isApproved ? 'Claim Approved' : 'Claim Rejected'}
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-8">
            {isApproved
              ? `You approved the organisation claim for ${claimantName}`
              : `You rejected the organisation claim for ${claimantName}`}
          </p>

          {/* Claim Info */}
          <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-6 mb-6">
            <p className="text-[0.75rem] text-[#616161] mb-2">Claimant</p>
            <p className="text-[1rem] font-semibold text-[#212121] mb-3">{claimantName}</p>
            <p className="text-[0.75rem] text-[#616161] mb-2">Organisation</p>
            <p className="text-[1rem] font-semibold text-[#212121]">{organisationName}</p>
          </div>

          {/* Status Details */}
          <div className={`border rounded-lg p-4 mb-6 ${
            isApproved
              ? 'bg-[#b9f6ca]/20 border-[#00c853]'
              : 'bg-[#f9d8d8]/20 border-[#f44336]'
          }`}>
            <div className="flex items-start gap-3">
              <Mail className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isApproved ? 'text-[#00c853]' : 'text-[#f44336]'
              }`} />
              <div className="text-left">
                <p className="text-[0.875rem] font-medium text-[#212121]">
                  {isApproved ? 'Approval Email Sent' : 'Rejection Email Sent'}
                </p>
                <p className="text-[0.75rem] text-[#616161] mt-1">
                  {isApproved
                    ? `${claimantName} has been notified that their claim has been approved and they can now represent ${organisationName}`
                    : `${claimantName} has been notified of the rejection with the reason provided`}
                </p>
              </div>
            </div>
          </div>

          {isApproved && (
            <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 text-left mb-6">
              <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Representative Status Granted</p>
              <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#101F36]">•</span>
                  <span>{claimantName} can now act on behalf of {organisationName}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#101F36]">•</span>
                  <span>Access to organisation management features enabled</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#101F36]">•</span>
                  <span>Can purchase certificates and manage validation status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#101F36]">•</span>
                  <span>Representative record archived in system</span>
                </li>
              </ul>
            </div>
          )}

          {!isApproved && (
            <div className="bg-[#fff8e1] border border-[#ffc107] rounded-lg p-4 text-left mb-6">
              <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Claim Rejected</p>
              <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffc107]">•</span>
                  <span>Claimant can address the issues and reapply</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffc107]">•</span>
                  <span>Rejection reason included in notification email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffc107]">•</span>
                  <span>Claimant can contact support for clarification</span>
                </li>
              </ul>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium"
          >
            RETURN TO DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
