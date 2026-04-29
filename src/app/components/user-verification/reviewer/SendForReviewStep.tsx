import { useState } from 'react';
import { FileText, Download, Video, CheckCircle, Flag, X, Send } from 'lucide-react';

interface SendForReviewStepProps {
  evidence: {
    idDocument: { fileUrl: string; type: string };
    addressDocument: { fileUrl: string; type: string };
    personalDetails: any;
    addressDetails: any;
    automatedReportUrl: string;
    manualReportFile: File;
    callRecordingFile: File;
    callComments: string;
  };
  flags: Array<{ step: string; comment: string }>;
  onSendForReview: (flag?: { comment: string }) => void;
}

export function SendForReviewStep({ evidence, flags, onSendForReview }: SendForReviewStepProps) {
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
      {/* Flag Banner */}
      {flagged && (
        <div className="bg-[#fff8e1] border-l-4 border-[#ffc107] p-4 rounded">
          <div className="flex items-start gap-3">
            <Flag className="w-5 h-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[0.875rem] font-medium text-[#212121] mb-2">
                This verification has been flagged for review
              </p>
              <textarea
                value={flagComment}
                onChange={(e) => setFlagComment(e.target.value)}
                placeholder="Add a comment explaining why this verification has been flagged..."
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded text-[0.875rem] min-h-[80px] resize-none"
              />
            </div>
            <button
              onClick={() => {
                setFlagged(false);
                setFlagComment('');
              }}
              className="p-1 hover:bg-[#ffc107]/10 rounded"
            >
              <X className="w-4 h-4 text-[#616161]" />
            </button>
          </div>
        </div>
      )}

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
                The following concerns were noted during the verification process
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
        <div className="max-w-3xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Send for Admin Review
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Review all collected evidence before sending to the admin approver
          </p>

          {/* User Details */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-3">User Details</h5>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-[#fafafa] border border-[#e0e0e0] rounded p-3">
                <label className="text-[0.75rem] text-[#616161] block mb-1">Full Name</label>
                <p className="text-[0.875rem] text-[#212121]">
                  {[evidence.personalDetails.title, evidence.personalDetails.firstName, evidence.personalDetails.middleName, evidence.personalDetails.lastName, evidence.personalDetails.suffix]
                    .filter(Boolean)
                    .join(' ')}
                </p>
              </div>
              <div className="bg-[#fafafa] border border-[#e0e0e0] rounded p-3">
                <label className="text-[0.75rem] text-[#616161] block mb-1">Date of Birth</label>
                <p className="text-[0.875rem] text-[#212121]">
                  {new Date(evidence.personalDetails.dateOfBirth).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-3">Submitted Documents</h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-[#e0e0e0] rounded-lg overflow-hidden">
                <img src={evidence.idDocument.fileUrl} alt="ID Document" className="w-full h-48 object-cover bg-[#fafafa]" />
                <div className="p-3 bg-[#fafafa] border-t border-[#e0e0e0]">
                  <p className="text-[0.75rem] text-[#616161]">{evidence.idDocument.type}</p>
                </div>
              </div>
              <div className="border border-[#e0e0e0] rounded-lg overflow-hidden">
                <img src={evidence.addressDocument.fileUrl} alt="Proof of Address" className="w-full h-48 object-cover bg-[#fafafa]" />
                <div className="p-3 bg-[#fafafa] border-t border-[#e0e0e0]">
                  <p className="text-[0.75rem] text-[#616161]">{evidence.addressDocument.type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="mb-6">
            <h5 className="text-[1rem] font-semibold text-[#212121] mb-3">Verification Reports</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-[#e0e0e0] rounded-lg bg-[#fafafa]">
                <CheckCircle className="w-5 h-5 text-[#00c853] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">Automated Verification Report</p>
                  <p className="text-[0.75rem] text-[#616161]">System-generated checks (identity, sanctions, PEP)</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.75rem]">
                  <Download className="w-3 h-3" />
                  Download
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
                  <p className="text-[0.875rem] font-medium text-[#212121]">Video Call Recording</p>
                  <p className="text-[0.75rem] text-[#616161]">
                    {evidence.callRecordingFile.name} • {(evidence.callRecordingFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-[#101F36] text-[#101F36] rounded hover:bg-[#e3f2fd] transition-colors text-[0.75rem]">
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Call Comments */}
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
                <span>ID document verified and transcribed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span>Proof of address verified and transcribed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span>Automated checks completed successfully</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span>Manual research report completed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00c853]" />
                <span>Video call conducted and recorded</span>
              </li>
            </ul>
          </div>

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
