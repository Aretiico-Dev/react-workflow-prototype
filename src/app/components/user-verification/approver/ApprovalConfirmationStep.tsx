import { CheckCircle2, XCircle, Mail } from 'lucide-react';

interface ApprovalConfirmationStepProps {
  decision: 'approved' | 'rejected';
  applicantName: string;
}

export function ApprovalConfirmationStep({ decision, applicantName }: ApprovalConfirmationStepProps) {
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
            {isApproved ? 'Verification Approved' : 'Verification Rejected'}
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-8">
            {isApproved
              ? 'The verification has been successfully approved and the applicant has been notified'
              : 'The verification has been rejected and the applicant has been notified with the reason provided'}
          </p>

          {/* Applicant Info */}
          <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-6 mb-6">
            <p className="text-[0.75rem] text-[#616161] mb-2">Applicant</p>
            <p className="text-[1rem] font-semibold text-[#212121]">{applicantName}</p>
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
                    ? 'The applicant has received confirmation that their verification is approved and valid for one year'
                    : 'The applicant has been notified of the rejection with the reason provided and information about reapplication'}
                </p>
              </div>
            </div>
          </div>

          {isApproved && (
            <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 text-left mb-6">
              <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Verification Details</p>
              <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#101F36]">•</span>
                  <span>Valid for one year from today</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#101F36]">•</span>
                  <span>Renewal reminder will be sent one month before expiry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#101F36]">•</span>
                  <span>Verification record archived in system</span>
                </li>
              </ul>
            </div>
          )}

          {!isApproved && (
            <div className="bg-[#fff8e1] border border-[#ffc107] rounded-lg p-4 text-left mb-6">
              <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Next Steps for Applicant</p>
              <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#ffc107]">•</span>
                  <span>Must wait 3 months before reapplying</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffc107]">•</span>
                  <span>Can contact support for clarification on rejection reason</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ffc107]">•</span>
                  <span>Should address the issues mentioned before reapplying</span>
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
