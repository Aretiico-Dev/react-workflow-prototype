import { useState } from 'react';
import { FileText, Flag } from 'lucide-react';

interface AdminTwoFactorResetApproverStepProps {
  request: {
    aretiicoId: string;
    legalName: string;
    email: string;
    idFileName: string;
    idFileUrl: string;
    linkedUser: {
      id: string;
      name: string;
      aretiicoId: string;
      emails: string[];
      idDocument: {
        fileUrl: string;
        type: string;
      };
    };
    reviewerDecisionContext?: {
      notes: string;
      attachments: Array<{
        name: string;
        sizeLabel: string;
      }>;
      flag?: {
        comment: string;
      };
    };
  };
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export function AdminTwoFactorResetApproverStep({ request, onApprove, onReject }: AdminTwoFactorResetApproverStepProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const reviewerContext = request.reviewerDecisionContext;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded shadow p-8 mt-8">
      <h2 className="text-xl font-semibold mb-4">2FA Reset Approval</h2>
      {reviewerContext?.flag && (
        <div className="mb-6 rounded border-l-4 border-[#ffc107] bg-[#fff8e1] p-4">
          <div className="flex items-start gap-3">
            <Flag className="w-5 h-5 text-[#c77800] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.875rem] font-medium text-[#212121]">Reviewer flagged this request</p>
              <p className="mt-1 text-[0.875rem] text-[#212121]">{reviewerContext.flag.comment}</p>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-6 mb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-6">
          <h3 className="text-[1rem] font-semibold text-[#212121] mb-4">Submitted identity document</h3>
          <div className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
            <img
              src={request.idFileUrl}
              alt={`${request.legalName} identity document`}
              className="w-full h-auto"
            />
          </div>
          <div className="mt-3 flex items-center gap-2 text-[0.75rem] text-[#616161]">
            <FileText className="w-4 h-4" />
            <span>{request.idFileName}</span>
          </div>
        </div>

        <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-6">
          <h3 className="text-[1rem] font-semibold text-[#212121] mb-4">Request details</h3>
          <div className="space-y-3">
            <div className="rounded border border-[#e0e0e0] bg-white p-3">
              <p className="text-[0.75rem] text-[#616161] mb-1">Aretiico ID</p>
              <p className="text-[0.875rem] font-medium text-[#212121]">{request.aretiicoId}</p>
            </div>
            <div className="rounded border border-[#e0e0e0] bg-white p-3">
              <p className="text-[0.75rem] text-[#616161] mb-1">Full legal name</p>
              <p className="text-[0.875rem] font-medium text-[#212121]">{request.legalName}</p>
            </div>
            <div className="rounded border border-[#e0e0e0] bg-white p-3">
              <p className="text-[0.75rem] text-[#616161] mb-1">Primary email</p>
              <p className="text-[0.875rem] font-medium text-[#212121]">{request.email}</p>
            </div>
            <div className="rounded border border-[#e0e0e0] bg-white p-3">
              <p className="text-[0.75rem] text-[#616161] mb-1">Linked user</p>
              <button
                type="button"
                onClick={() => window.alert(`Demo: open profile for ${request.linkedUser.name} (${request.linkedUser.aretiicoId})`)}
                className="text-[0.875rem] font-medium text-[#0057b8] underline underline-offset-2 hover:text-[#003f82]"
              >
                {request.linkedUser.name} ({request.linkedUser.aretiicoId})
              </button>
            </div>
            <div className="rounded border border-[#e0e0e0] bg-white p-3">
              <p className="text-[0.75rem] text-[#616161] mb-2">All account emails</p>
              <ul className="space-y-1">
                {request.linkedUser.emails.map((email) => (
                  <li key={email} className="text-[0.875rem] text-[#212121]">{email}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {reviewerContext && (
        <div className="mb-6 rounded border border-[#e0e0e0] bg-[#fafafa] p-4">
          <h3 className="text-[1rem] font-semibold text-[#212121] mb-3">Reviewer context</h3>
          {reviewerContext.notes && (
            <div className="mb-4">
              <p className="text-[0.75rem] text-[#616161] mb-1">Comments</p>
              <p className="text-[0.875rem] text-[#212121] whitespace-pre-wrap">{reviewerContext.notes}</p>
            </div>
          )}
          {reviewerContext.attachments.length > 0 && (
            <div>
              <p className="text-[0.75rem] text-[#616161] mb-2">Supporting files</p>
              <div className="space-y-2">
                {reviewerContext.attachments.map((attachment) => (
                  <div
                    key={`${attachment.name}-${attachment.sizeLabel}`}
                    className="flex items-center gap-2 rounded border border-[#e0e0e0] bg-white px-3 py-2"
                  >
                    <FileText className="w-4 h-4 text-[#616161]" />
                    <span className="text-[0.875rem] text-[#212121]">{attachment.name}</span>
                    <span className="text-[0.75rem] text-[#616161]">({attachment.sizeLabel})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!reviewerContext.notes && reviewerContext.attachments.length === 0 && (
            <p className="text-[0.875rem] text-[#616161]">No additional reviewer context was provided.</p>
          )}
        </div>
      )}
      <div className="flex gap-4 mt-6">
        <button
          className="flex-1 rounded bg-[#101F36] text-white py-3 font-medium"
          onClick={onApprove}
        >
          Reset two factor authentication
        </button>
        <button
          className="flex-1 rounded bg-red-600 text-white py-3 font-medium"
          onClick={() => setShowRejectModal(true)}
        >
          Reject
        </button>
      </div>
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Reject Request</h3>
            <label className="block mb-2">Reason for rejection (required):</label>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              required
            />
            <div className="flex gap-2 justify-end">
              <button
                className="rounded px-4 py-2 bg-gray-200"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded px-4 py-2 bg-red-600 text-white disabled:opacity-50"
                disabled={!rejectReason.trim()}
                onClick={() => {
                  if (rejectReason.trim()) {
                    onReject(rejectReason);
                    setShowRejectModal(false);
                  }
                }}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
