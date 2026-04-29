import { useState } from 'react';
import { Upload, FileText, Mail, Flag, X, AlertCircle } from 'lucide-react';

interface UploadEmailStepProps {
  onNext: (emailPdf: File, flag?: { comment: string }) => void;
}

export function UploadEmailStep({ onNext }: UploadEmailStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const [emailPdf, setEmailPdf] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setEmailPdf(file);
    }
  };

  const handleContinue = () => {
    if (!emailPdf) return;

    if (flagged && flagComment.trim()) {
      onNext(emailPdf, { comment: flagComment });
    } else if (!flagged) {
      onNext(emailPdf);
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
                This claim has been flagged for review
              </p>
              <textarea
                value={flagComment}
                onChange={(e) => setFlagComment(e.target.value)}
                placeholder="Add a comment explaining why this claim has been flagged..."
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

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8">
        <div className="max-w-2xl mx-auto">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Organisation Email Confirmation
          </h4>
          <p className="text-[0.875rem] text-[#616161] mb-6">
            Upload the digitally signed email confirmation from the organisation
          </p>

          {/* Instructions */}
          <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[0.75rem] font-medium text-[#212121] mb-2">What to expect</p>
                <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>Email must be sent from an organisation-affiliated email address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>Email should confirm the claimant's authority to represent the organisation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>Save the email as a PDF with digital signature intact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#101F36]">•</span>
                    <span>Upload the PDF here for verification</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-6">
            <label className="text-[0.875rem] font-medium text-[#212121] block mb-3">
              Email Confirmation (PDF) *
            </label>
            {!emailPdf ? (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-[#101F36] rounded-lg p-8 hover:bg-[#e3f2fd] transition-colors">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-[#101F36] mx-auto mb-3" />
                    <p className="text-[0.875rem] font-medium text-[#212121] mb-1">
                      Upload Email PDF
                    </p>
                    <p className="text-[0.75rem] text-[#616161]">
                      Click to browse or drag and drop the PDF file here
                    </p>
                  </div>
                </div>
              </label>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-[#b9f6ca]/20 border border-[#00c853] rounded-lg">
                <FileText className="w-8 h-8 text-[#00c853] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-[#212121]">{emailPdf.name}</p>
                  <p className="text-[0.75rem] text-[#616161]">
                    {(emailPdf.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  onClick={() => setEmailPdf(null)}
                  className="px-3 py-1.5 text-[0.75rem] text-[#f44336] hover:bg-[#f9d8d8] rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Verification Checklist */}
          <div className="bg-[#fff8e1] border border-[#ffc107] rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#ffc107] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Before uploading, verify:</p>
                <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">✓</span>
                    <span>Email sender address matches the organisation's domain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">✓</span>
                    <span>Email contains clear confirmation of the claimant's authority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">✓</span>
                    <span>PDF includes email headers showing sender and date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffc107]">✓</span>
                    <span>Digital signature is present and valid</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#e0e0e0] flex gap-3 justify-end">
            {!flagged && emailPdf && (
              <button
                onClick={() => setFlagged(true)}
                className="flex items-center gap-2 px-6 py-3 border border-[#ffc107] text-[#ffc107] rounded hover:bg-[#fff8e1] transition-colors text-[0.875rem] font-medium"
              >
                <Flag className="w-4 h-4" />
                FLAG FOR REVIEW
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!emailPdf || (flagged && !flagComment.trim())}
              className="px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
