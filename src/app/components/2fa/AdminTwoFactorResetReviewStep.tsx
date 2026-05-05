import { ChangeEvent, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, Flag, Paperclip, Search, ShieldAlert, X, XCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  aretiicoId: string;
  dateOfBirth: string;
  emails: string[];
  idDocument: {
    fileUrl: string;
    type: string;
  };
}

interface AdminTwoFactorResetReviewStepProps {
  request: {
    aretiicoId: string;
    legalName: string;
    email: string;
    idFileName: string;
    idFileUrl: string;
  };
  users: User[];
  onSendForApproval: (payload: {
    userId: string;
    reviewerNotes: string;
    reviewerFiles: File[];
    flag?: { comment: string };
  }) => void;
  onReject: (reason: string) => void;
}

export function AdminTwoFactorResetReviewStep({ request, users, onSendForApproval, onReject }: AdminTwoFactorResetReviewStepProps) {
  const [scenario, setScenario] = useState<'probable-match' | 'no-match'>('probable-match');
  const [selectedUser, setSelectedUser] = useState(users[0]?.id || '');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [reviewerFiles, setReviewerFiles] = useState<File[]>([]);
  const [flagged, setFlagged] = useState(false);
  const [flagComment, setFlagComment] = useState('');
  const probableMatch = users[0];

  useEffect(() => {
    if (!users.length) {
      setSelectedUser('');
      return;
    }

    setSelectedUser((current) => {
      if (scenario === 'probable-match') return probableMatch?.id || current;
      return '';
    });
  }, [probableMatch?.id, scenario, users]);

  const selectedMatch = users.find((user) => user.id === selectedUser) || null;
  const canSendForApproval = Boolean(selectedUser) && (!flagged || Boolean(flagComment.trim()));

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setReviewerFiles((current) => [...current, ...files]);
    event.target.value = '';
  }

  function removeReviewerFile(indexToRemove: number) {
    setReviewerFiles((current) => current.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8 mt-8">
      {flagged && (
        <div className="mb-6 rounded border-l-4 border-[#ffc107] bg-[#fff8e1] p-4">
          <div className="flex items-start gap-3">
            <Flag className="w-5 h-5 text-[#c77800] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[0.875rem] font-medium text-[#212121] mb-2">
                This request has been flagged for the approver
              </p>
              <textarea
                value={flagComment}
                onChange={(event) => setFlagComment(event.target.value)}
                placeholder="Explain what the approver should pay attention to before making a final decision..."
                className="w-full min-h-[96px] resize-none rounded border border-[#e0e0e0] px-3 py-2 text-[0.875rem] text-[#212121] focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setFlagged(false);
                setFlagComment('');
              }}
              className="rounded p-1 hover:bg-[#ffc107]/10"
            >
              <X className="w-4 h-4 text-[#616161]" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <h2 className="text-[1.75rem] font-semibold text-[#212121] mb-2">2FA Reset Request Review</h2>
          <p className="text-[0.875rem] text-[#616161]">
            Validate the uploaded identity document and confirm whether the request can be linked to an existing Aretiico user.
          </p>
        </div>
        <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-1 flex items-center gap-1 self-start">
          <button
            type="button"
            onClick={() => setScenario('probable-match')}
            className={`rounded px-3 py-2 text-[0.75rem] font-medium transition-colors ${
              scenario === 'probable-match'
                ? 'bg-[#101F36] text-white'
                : 'text-[#616161] hover:bg-white'
            }`}
          >
            Probable match found
          </button>
          <button
            type="button"
            onClick={() => setScenario('no-match')}
            className={`rounded px-3 py-2 text-[0.75rem] font-medium transition-colors ${
              scenario === 'no-match'
                ? 'bg-[#101F36] text-white'
                : 'text-[#616161] hover:bg-white'
            }`}
          >
            No likely match
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-6">
            <div className="mb-4">
              <h3 className="text-[1rem] font-semibold text-[#212121]">Submitted Request</h3>
              <p className="text-[0.75rem] text-[#616161] mt-1">
                Review the information supplied by the requester alongside the uploaded identity document.
              </p>
            </div>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
              <div>
                <div className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
                  <img
                    src={request.idFileUrl}
                    alt={`${request.legalName} identity document`}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-2 flex items-center gap-2 text-[0.75rem] text-[#616161]">
                  <FileText className="w-4 h-4" />
                  <span>{request.idFileName}</span>
                </div>
              </div>
              <div className="grid gap-3 content-start">
                <div className="rounded border border-[#e0e0e0] bg-white p-3">
                  <label className="block text-[0.75rem] text-[#616161] mb-1">Aretiico ID</label>
                  <p className="text-[0.875rem] font-medium text-[#212121]">{request.aretiicoId}</p>
                </div>
                <div className="rounded border border-[#e0e0e0] bg-white p-3">
                  <label className="block text-[0.75rem] text-[#616161] mb-1">Full Legal Name</label>
                  <p className="text-[0.875rem] font-medium text-[#212121]">{request.legalName}</p>
                </div>
                <div className="rounded border border-[#e0e0e0] bg-white p-3">
                  <label className="block text-[0.75rem] text-[#616161] mb-1">Email</label>
                  <p className="text-[0.875rem] font-medium text-[#212121]">{request.email}</p>
                </div>
              </div>
            </div>
          </div>

          {scenario === 'probable-match' && probableMatch && (
            <div className="rounded border border-[#90caf9] bg-[#e3f2fd] p-6">
              <div className="flex items-start gap-3 mb-5">
                <CheckCircle2 className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[1rem] font-semibold text-[#212121]">Probable system match found</h3>
                  <p className="text-[0.75rem] text-[#616161] mt-1">
                    Automated matching found one likely existing user account based on the submitted details and identity document.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_240px]">
                <div className="grid gap-3 content-start">
                  <div className="rounded border border-[#90caf9] bg-white p-3">
                    <label className="block text-[0.75rem] text-[#616161] mb-1">Matched user</label>
                    <p className="text-[0.875rem] font-medium text-[#212121]">{probableMatch.name}</p>
                  </div>
                  <div className="rounded border border-[#90caf9] bg-white p-3">
                    <label className="block text-[0.75rem] text-[#616161] mb-1">Date of birth</label>
                    <p className="text-[0.875rem] font-medium text-[#212121]">
                      {new Date(probableMatch.dateOfBirth).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="rounded border border-[#90caf9] bg-white p-3">
                    <label className="block text-[0.75rem] text-[#616161] mb-1">Emails on account</label>
                    <div className="flex flex-wrap gap-2">
                      {probableMatch.emails.map((email) => (
                        <span
                          key={email}
                          className="rounded-full bg-[#e3f2fd] px-2.5 py-1 text-[0.75rem] font-medium text-[#101F36]"
                        >
                          {email}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded border border-[#90caf9] bg-white p-3">
                    <label className="block text-[0.75rem] text-[#616161] mb-1">Matched Aretiico ID</label>
                    <p className="text-[0.875rem] font-medium text-[#212121]">{probableMatch.aretiicoId}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[0.875rem] font-medium text-[#212121] mb-3">Matched ID document</h4>
                  <div className="overflow-hidden rounded-lg border border-[#90caf9] bg-white">
                    <img
                      src={probableMatch.idDocument.fileUrl}
                      alt={`${probableMatch.name} matched identity document`}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[0.75rem] text-[#616161]">
                    <FileText className="w-4 h-4" />
                    <span>{probableMatch.idDocument.type}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {scenario === 'no-match' && (
            <div className="rounded border border-[#ffc107] bg-[#fff8e1] p-6">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#c77800] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[1rem] font-semibold text-[#212121]">No likely system match found</h3>
                  <p className="text-[0.875rem] text-[#616161] mt-1">
                    Automated matching did not find an existing user with a strong enough confidence score. The reviewer must either link the request manually or reject it for further investigation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded border border-[#e0e0e0] bg-white p-6">
            <div className="flex items-start gap-3 mb-4">
              <Search className="w-5 h-5 text-[#101F36] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-[1rem] font-semibold text-[#212121]">Link to user in system</h3>
                <p className="text-[0.75rem] text-[#616161] mt-1">
                  {scenario === 'probable-match'
                    ? 'The suggested match is preselected. Confirm it or choose a different user before sending for approval.'
                    : 'No likely match was found automatically. Search and choose a user manually only if you are confident the request belongs to that account.'}
                </p>
              </div>
            </div>

            <label className="block text-[0.75rem] font-medium text-[#616161] uppercase tracking-wide mb-2">Candidate user</label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded border border-[#e0e0e0] bg-white px-4 py-3 pr-18 text-[0.875rem] font-medium text-[#212121] hover:border-[#90caf9] focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
              >
                <option value="">Select user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.aretiicoId})</option>
                ))}
              </select>
              {selectedUser && (
                <button
                  type="button"
                  onClick={() => setSelectedUser('')}
                  className="absolute right-9 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#616161] hover:bg-[#f0f0f0] hover:text-[#212121]"
                  aria-label="Clear selected user"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#616161]">⌄</div>
            </div>

            {selectedMatch ? (
              <div className="mt-4 rounded border border-[#e0e0e0] bg-[#fafafa] p-4 space-y-3">
                <div>
                  <p className="text-[0.75rem] text-[#616161] mb-1">Selected account</p>
                  <p className="text-[0.875rem] font-medium text-[#212121]">{selectedMatch.name}</p>
                </div>
                <div>
                  <p className="text-[0.75rem] text-[#616161] mb-1">Aretiico ID</p>
                  <p className="text-[0.875rem] text-[#212121]">{selectedMatch.aretiicoId}</p>
                </div>
                <div>
                  <p className="text-[0.75rem] text-[#616161] mb-1">Emails</p>
                  <ul className="space-y-1">
                    {selectedMatch.emails.map((email) => (
                      <li key={email} className="text-[0.875rem] text-[#212121]">{email}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded border border-dashed border-[#e0e0e0] bg-[#fafafa] p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#616161] flex-shrink-0 mt-0.5" />
                  <p className="text-[0.875rem] text-[#616161]">
                    No user has been linked yet. Select an account if you want to continue to approval, or reject the request if the identity cannot be established safely.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded border border-[#e0e0e0] bg-white p-6">
            <div className="mb-4">
              <h3 className="text-[1rem] font-semibold text-[#212121]">Reviewer context for approver</h3>
              <p className="text-[0.75rem] text-[#616161] mt-1">
                Add optional notes and supporting files so the final decision maker understands any edge cases or manual checks.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[0.75rem] font-medium text-[#616161] uppercase tracking-wide mb-2">
                  Reviewer comments
                </label>
                <textarea
                  value={reviewerNotes}
                  onChange={(event) => setReviewerNotes(event.target.value)}
                  placeholder="Optional context for the approver, such as how the identity was verified or any caveats noticed during review."
                  className="w-full min-h-[132px] resize-none rounded border border-[#e0e0e0] px-3 py-3 text-[0.875rem] text-[#212121] focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36]"
                />
              </div>

              <div>
                <label className="block text-[0.75rem] font-medium text-[#616161] uppercase tracking-wide mb-2">
                  Supporting files
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-[#90caf9] bg-[#fafafa] px-4 py-4 text-[0.875rem] font-medium text-[#101F36] hover:bg-[#e3f2fd]">
                  <Paperclip className="w-4 h-4" />
                  Upload evidence for approver
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {reviewerFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {reviewerFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded border border-[#e0e0e0] bg-[#fafafa] px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[0.875rem] font-medium text-[#212121]">{file.name}</p>
                          <p className="text-[0.75rem] text-[#616161]">{Math.max(1, Math.round(file.size / 1024))} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeReviewerFile(index)}
                          className="rounded p-1 text-[#616161] hover:bg-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-4">
            <p className="text-[0.75rem] font-medium text-[#616161] mb-2">Reviewer checklist</p>
            <ul className="space-y-2 text-[0.875rem] text-[#212121]">
              <li>Compare the uploaded ID image with the matched account details.</li>
              <li>Check whether the user has multiple emails associated with the account.</li>
              <li>Only send for approval when the linkage is defensible.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        {!flagged && (
          <button
            type="button"
            onClick={() => setFlagged(true)}
            className="flex items-center justify-center gap-2 rounded border border-[#ffc107] px-6 py-3 font-medium text-[#c77800] hover:bg-[#fff8e1]"
          >
            <Flag className="w-4 h-4" />
            Flag for Approval Review
          </button>
        )}
        <button
          className="flex-1 rounded bg-[#101F36] text-white py-3 font-medium disabled:opacity-50"
          disabled={!canSendForApproval}
          onClick={() => selectedUser && onSendForApproval({
            userId: selectedUser,
            reviewerNotes: reviewerNotes.trim(),
            reviewerFiles,
            flag: flagged ? { comment: flagComment.trim() } : undefined,
          })}
        >
          Send for Approval
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
