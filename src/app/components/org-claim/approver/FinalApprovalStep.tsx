import { useState } from 'react';
import { Building2, Download, Flag, CheckCircle, XCircle, FileText, Video, Mail, AlertCircle } from 'lucide-react';

interface FinalApprovalStepProps {
  claimData: {
    organisationName: string;
    claimantName: string;
    role: string;
  };
  evidence: {
    automatedReportsCount: number;
    manualReportFileName: string;
    callRecordingFileName: string;
    callRecordingSize: number;
    emailConfirmationFileName: string;
    callComments: string;
  };
  flags: Array<{ step: string; comment: string }>;
  onDecision: (decision: 'approved' | 'rejected', reason?: string) => void;
}

export function FinalApprovalStep({ claimData, evidence, flags, onDecision }: FinalApprovalStepProps) {
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleSubmit = () => {
    if (decision === 'rejected' && !rejectionReason.trim()) {
      return;
    }

    if (decision) {
      onDecision(decision, decision === 'rejected' ? rejectionReason : undefined);
    }
  };

  return (
    <div className="space-y-6">
      {/* Flags Alert */}
      {flags.length > 0 && (
        <div className="bg-[#fff8e1] border border-[#ffc107] rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <Flag className="w-5 h-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.875rem] font-medium text-[#212121]">
                Reviewer Flags ({flags.length})
              </p>
              <p className="text-[0.75rem] text-[#616161] mt-1">
                The reviewer added the following concerns during the verification process
              </p>
            </div>
          </div>
          <div className="space-y-2 ml-8">
            {flags.map((flag, index) => (
              <div key={index} className="bg-white border border-[#e0e0e0] rounded p-3">
                <p className="text-[0.75rem] font-medium text-[#212121] mb-1">{flag.step}</p>
                <p className="text-[0.75rem] text-[#616161]">{flag.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <div className="max-w-4xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Final Organisation Claim Review
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Review all evidence and make a final decision on this organisation claim
          </p>

          {/* Claim Details */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-3">Claim Details</h5>
            <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[0.875rem] text-[#212121] mb-2">
                    <strong>{claimData.claimantName}</strong> is applying to represent{' '}
                    <strong>{claimData.organisationName}</strong>
                  </p>
                  <p className="text-[0.75rem] text-[#616161]">
                    Claimant Role: {claimData.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-3">Verification Evidence</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
                <CheckCircle className="w-5 h-5 text-[#00c853] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">Automated Verification Checks</p>
                  <p className="text-[0.75rem] text-[#616161]">
                    {evidence.automatedReportsCount} checks passed (sanctions, embargoes, PSC screening)
                  </p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.75rem]">
                  <Download className="w-3 h-3" />
                  View
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
                <FileText className="w-5 h-5 text-[#101F36] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">Manual Research Report</p>
                  <p className="text-[0.75rem] text-[#616161]">{evidence.manualReportFileName}</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.75rem]">
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
                <Video className="w-5 h-5 text-[#101F36] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">Teams Call Recording</p>
                  <p className="text-[0.75rem] text-[#616161]">
                    {evidence.callRecordingFileName} • {(evidence.callRecordingSize / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.75rem]">
                  <Download className="w-3 h-3" />
                  View
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
                <Mail className="w-5 h-5 text-[#101F36] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">Email Confirmation</p>
                  <p className="text-[0.75rem] text-[#616161]">{evidence.emailConfirmationFileName}</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.75rem]">
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Call Notes */}
          {evidence.callComments && (
            <div className="mb-6">
              <h5 className="text-[1rem] font-semibold text-[#212121] mb-3">Reviewer Call Notes</h5>
              <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4">
                <p className="text-[0.875rem] text-[#212121] whitespace-pre-wrap">{evidence.callComments}</p>
              </div>
            </div>
          )}

          {/* Decision Section */}
          <div className="pt-6 border-t border-[#e0e0e0]">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-4">Final Decision</h5>

            {!decision && (
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setDecision('approved')}
                  className="flex items-center justify-center gap-3 p-6 border-2 border-[#00c853] rounded-lg hover:bg-[#b9f6ca]/20 transition-colors group"
                >
                  <CheckCircle className="w-8 h-8 text-[#00c853]" />
                  <div className="text-left">
                    <p className="text-[1rem] font-semibold text-[#00c853]">Approve Claim</p>
                    <p className="text-[0.75rem] text-[#616161]">All evidence is satisfactory</p>
                  </div>
                </button>

                <button
                  onClick={() => setDecision('rejected')}
                  className="flex items-center justify-center gap-3 p-6 border-2 border-[#f44336] rounded-lg hover:bg-[#f9d8d8]/20 transition-colors group"
                >
                  <XCircle className="w-8 h-8 text-[#f44336]" />
                  <div className="text-left">
                    <p className="text-[1rem] font-semibold text-[#f44336]">Reject Claim</p>
                    <p className="text-[0.75rem] text-[#616161]">Evidence is insufficient or invalid</p>
                  </div>
                </button>
              </div>
            )}

            {decision === 'approved' && (
              <div className="bg-[#b9f6ca]/30 border border-[#00c853] rounded-lg p-6 mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-[#00c853] flex-shrink-0" />
                  <div>
                    <p className="text-[1rem] font-semibold text-[#212121]">Approve This Claim</p>
                    <p className="text-[0.75rem] text-[#616161] mt-1">
                      The claimant will be granted representative status for {claimData.organisationName} and
                      will receive confirmation via email.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setDecision(null)}
                    className="px-4 py-2 border border-[#e0e0e0] rounded hover:bg-white transition-colors text-[0.875rem]"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-[#00c853] text-white rounded hover:bg-[#00a844] transition-colors text-[0.875rem] font-medium"
                  >
                    CONFIRM APPROVAL
                  </button>
                </div>
              </div>
            )}

            {decision === 'rejected' && (
              <div className="bg-[#f9d8d8]/30 border border-[#f44336] rounded-lg p-6 mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-[#f44336] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[1rem] font-semibold text-[#212121] mb-2">Reject This Claim</p>
                    <label className="text-[0.875rem] font-medium text-[#212121] block mb-2">
                      Reason for Rejection *
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a detailed explanation for why this claim is being rejected..."
                      className="w-full px-4 py-3 border border-[#e0e0e0] rounded text-[0.875rem] min-h-[120px] resize-none focus:outline-none focus:border-[#f44336]"
                    />
                    <p className="text-[0.75rem] text-[#616161] mt-2">
                      This reason will be included in the notification email sent to the claimant
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setDecision(null);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 border border-[#e0e0e0] rounded hover:bg-white transition-colors text-[0.875rem]"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!rejectionReason.trim()}
                    className="px-6 py-2 bg-[#f44336] text-white rounded hover:bg-[#d32f2f] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    CONFIRM REJECTION
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
