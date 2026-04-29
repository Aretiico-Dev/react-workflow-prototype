import { useState } from 'react';
import { Building2, Download, Flag, Send, CheckCircle, FileText, Video, Mail } from 'lucide-react';

interface SendForReviewStepProps {
  claimData: {
    organisationName: string;
    claimantName: string;
    role: string;
  };
  evidence: {
    automatedReportsCount: number;
    manualReportFile: File;
    callRecordingFile: File;
    emailConfirmationFile: File;
    callComments: string;
    pscDecisionNotes: string;
    pscSupportingFiles: File[];
  };
  flags: Array<{ step: string; comment: string }>;
  onSendForReview: (flag?: { comment: string }) => void;
}

export function SendForReviewStep({ claimData, evidence, flags, onSendForReview }: SendForReviewStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');

  const handleSend = () => {
    if (flagged && flagComment.trim()) {
      onSendForReview({ comment: flagComment });
    } else if (!flagged) {
      onSendForReview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Flags */}
      {flags.length > 0 && (
        <div className="bg-[#fff8e1] border border-[#ffc107] rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <Flag className="w-5 h-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.875rem] font-medium text-[#212121]">
                Flags Added During Review ({flags.length})
              </p>
              <p className="text-[0.75rem] text-[#616161] mt-1">
                The following concerns were noted during the claim verification process
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
            Send for Admin Review
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Review all collected evidence before sending to the admin approver
          </p>

          {/* Claim Summary */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-3">Claim Summary</h5>
            <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[0.875rem] text-[#212121]">
                    <strong>{claimData.claimantName}</strong> ({claimData.role}) is applying to represent{' '}
                    <strong>{claimData.organisationName}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Collected */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-3">Evidence Collected</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
                <CheckCircle className="w-5 h-5 text-[#00c853] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">Automated Verification Checks</p>
                  <p className="text-[0.75rem] text-[#616161]">
                    {evidence.automatedReportsCount} checks passed (sanctions, embargoes, PSC identification)
                  </p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.75rem]">
                  <Download className="w-3 h-3" />
                  View Reports
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
                <FileText className="w-5 h-5 text-[#101F36] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">Manual Research Report</p>
                  <p className="text-[0.75rem] text-[#616161]">{evidence.manualReportFile.name}</p>
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
                    {evidence.callRecordingFile.name} • {(evidence.callRecordingFile.size / (1024 * 1024)).toFixed(2)} MB
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
                  <p className="text-[0.75rem] text-[#616161]">{evidence.emailConfirmationFile.name}</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.75rem]">
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>

              {(evidence.pscDecisionNotes || evidence.pscSupportingFiles.length > 0) && (
                <div className="p-3 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-[0.875rem] font-medium text-[#212121]">PSC Verification Evidence</p>
                        <p className="text-[0.75rem] text-[#616161]">
                          Optional reviewer rationale and supporting evidence for the PSC validation decision
                        </p>
                      </div>
                      {evidence.pscDecisionNotes && (
                        <div>
                          <p className="text-[0.75rem] font-medium text-[#212121] mb-1">Reviewer Notes</p>
                          <p className="text-[0.75rem] text-[#616161] whitespace-pre-wrap">{evidence.pscDecisionNotes}</p>
                        </div>
                      )}
                      {evidence.pscSupportingFiles.length > 0 && (
                        <div>
                          <p className="text-[0.75rem] font-medium text-[#212121] mb-1">
                            Supporting Files ({evidence.pscSupportingFiles.length})
                          </p>
                          <ul className="space-y-1">
                            {evidence.pscSupportingFiles.map((file, index) => (
                              <li key={`${file.name}-${index}`} className="text-[0.75rem] text-[#616161]">
                                {file.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Call Notes */}
          {evidence.callComments && (
            <div className="mb-6">
              <h5 className="text-[1rem] font-semibold text-[#212121] mb-3">Call Notes</h5>
              <div className="bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4">
                <p className="text-[0.875rem] text-[#212121] whitespace-pre-wrap">{evidence.callComments}</p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 mb-6">
            <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Verification Summary</p>
            <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span>All automated checks passed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span>Manual research completed and documented</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span>PSC contact details verified</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span>Phone verification completed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span>Teams call conducted and recorded</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span>Email confirmation received and uploaded</span>
              </li>
            </ul>
          </div>

          {/* Final Flag Option */}
          {flagged && (
            <div className="bg-[#fff8e1] border-l-4 border-[#ffc107] p-4 rounded mb-6">
              <div className="flex items-start gap-3">
                <Flag className="w-5 h-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121] mb-2">
                    This claim has been flagged for review
                  </p>
                  <textarea
                    value={flagComment}
                    onChange={(e) => setFlagComment(e.target.value)}
                    placeholder="Add a comment explaining why this claim has been flagged..."
                    className="w-full px-3 py-2 border border-[#e0e0e0] rounded text-[0.875rem] min-h-[80px] resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-6 border-t border-[#e0e0e0] flex gap-3 justify-end">
            {!flagged && (
              <button
                onClick={() => setFlagged(true)}
                className="flex items-center gap-2 px-6 py-3 border border-[#ffc107] text-[#ffc107] rounded hover:bg-[#fff8e1] transition-colors text-[0.875rem] font-medium"
              >
                <Flag className="w-4 h-4" />
                FLAG FOR REVIEW
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={flagged && !flagComment.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              SEND FOR ADMIN REVIEW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
