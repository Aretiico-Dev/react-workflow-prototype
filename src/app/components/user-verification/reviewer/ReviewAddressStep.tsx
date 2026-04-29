import { useState } from 'react';
import { FileText, CheckCircle, Flag, X } from 'lucide-react';

interface ReviewAddressStepProps {
  addressDocument: {
    fileUrl: string;
    type: string;
  };
  extractedDetails: {
    issuer: string;
    issueDate: string;
    documentType: string;
  };
  onNext: (flag?: { comment: string }) => void;
}

export function ReviewAddressStep({ addressDocument, extractedDetails, onNext }: ReviewAddressStepProps) {
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');

  const handleConfirm = () => {
    if (flagged && flagComment.trim()) {
      onNext({ comment: flagComment });
    } else if (!flagged) {
      onNext();
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

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
        <div className="mb-6">
          <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-2">
            Review Proof of Address
          </h4>
          <p className="text-[0.875rem] text-[#616161]">
            Verify that the proof of address document is valid and the extracted details are accurate
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Document Preview */}
          <div>
            <h5 className="text-[0.875rem] font-medium text-[#212121] mb-3">Document Image</h5>
            <div className="border border-[#e0e0e0] rounded-lg overflow-hidden bg-[#fafafa]">
              <img
                src={addressDocument.fileUrl}
                alt="Proof of Address"
                className="w-full h-auto"
              />
            </div>
            <div className="mt-2 flex items-center gap-2 text-[0.75rem] text-[#616161]">
              <FileText className="w-4 h-4" />
              <span>{addressDocument.type}</span>
            </div>
          </div>

          {/* Extracted Details */}
          <div>
            <h5 className="text-[0.875rem] font-medium text-[#212121] mb-3">Extracted Details</h5>
            <div className="space-y-3">
              <div className="bg-[#fafafa] border border-[#e0e0e0] rounded p-3">
                <label className="text-[0.75rem] text-[#616161] block mb-1">Document Type</label>
                <p className="text-[0.875rem] text-[#212121]">{extractedDetails.documentType}</p>
              </div>

              <div className="bg-[#fafafa] border border-[#e0e0e0] rounded p-3">
                <label className="text-[0.75rem] text-[#616161] block mb-1">Issuer</label>
                <p className="text-[0.875rem] text-[#212121]">{extractedDetails.issuer}</p>
              </div>

              <div className="bg-[#fafafa] border border-[#e0e0e0] rounded p-3">
                <label className="text-[0.75rem] text-[#616161] block mb-1">Issue Date</label>
                <p className="text-[0.875rem] text-[#212121]">
                  {new Date(extractedDetails.issueDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="mt-6 p-4 bg-[#e3f2fd] border border-[#90caf9] rounded">
              <p className="text-[0.75rem] font-medium text-[#212121] mb-2">Verification Checklist</p>
              <ul className="text-[0.75rem] text-[#212121] space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
                  <span>Document is clear and legible</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
                  <span>Document is within 3 months</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
                  <span>Extracted details match document</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#00c853] flex-shrink-0 mt-0.5" />
                  <span>Address is visible and complete</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-[#e0e0e0] flex gap-3 justify-end">
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
            onClick={handleConfirm}
            disabled={flagged && !flagComment.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-[#00c853] text-white rounded hover:bg-[#00a844] transition-colors text-[0.875rem] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            CONFIRM ADDRESS VALID
          </button>
        </div>
      </div>
    </div>
  );
}
