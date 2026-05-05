interface AdminTwoFactorResetSentForApprovalProps {
  request: {
    aretiicoId: string;
    legalName: string;
    email: string;
    idFileName: string;
    linkedUser?: {
      id: string;
      name: string;
      aretiicoId: string;
      emails?: string[];
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
  approvalSubmission: {
    submittedBy: string;
    submittedAt: string;
    pendingWith: string;
  };
}

export function AdminTwoFactorResetSentForApproval({ request, approvalSubmission }: AdminTwoFactorResetSentForApprovalProps) {
  const submittedAtLabel = new Date(approvalSubmission.submittedAt).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-8 mt-8">
      <div className="mb-8">
        <h2 className="text-[1.75rem] font-semibold text-[#212121] mb-2">Pending Admin Approval</h2>
        <p className="text-[0.875rem] text-[#616161]">
          The reviewer has completed their assessment. This request is now waiting for an admin approver to make the final decision.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-6">
            <h3 className="text-[1rem] font-semibold text-[#212121] mb-4">Request details</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-[#e0e0e0] bg-white p-3">
                <p className="text-[0.75rem] text-[#616161] mb-1">Aretiico ID</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">{request.aretiicoId}</p>
              </div>
              <div className="rounded border border-[#e0e0e0] bg-white p-3">
                <p className="text-[0.75rem] text-[#616161] mb-1">Full legal name</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">{request.legalName}</p>
              </div>
              <div className="rounded border border-[#e0e0e0] bg-white p-3">
                <p className="text-[0.75rem] text-[#616161] mb-1">Email</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">{request.email}</p>
              </div>
              <div className="rounded border border-[#e0e0e0] bg-white p-3">
                <p className="text-[0.75rem] text-[#616161] mb-1">ID document</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">{request.idFileName}</p>
              </div>
            </div>
          </div>

          <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-6">
            <h3 className="text-[1rem] font-semibold text-[#212121] mb-4">Linked account context</h3>
            {request.linkedUser ? (
              <div className="space-y-3">
                <div className="rounded border border-[#e0e0e0] bg-white p-3">
                  <p className="text-[0.75rem] text-[#616161] mb-1">Linked user</p>
                  <p className="text-[0.875rem] font-medium text-[#212121]">
                    {request.linkedUser.name} ({request.linkedUser.aretiicoId})
                  </p>
                </div>
                {request.linkedUser.emails && request.linkedUser.emails.length > 0 && (
                  <div className="rounded border border-[#e0e0e0] bg-white p-3">
                    <p className="text-[0.75rem] text-[#616161] mb-2">Account emails</p>
                    <ul className="space-y-1">
                      {request.linkedUser.emails.map((email) => (
                        <li key={email} className="text-[0.875rem] text-[#212121]">{email}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded border border-dashed border-[#e0e0e0] bg-white p-4">
                <p className="text-[0.875rem] text-[#616161]">No account has been linked yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded border border-[#90caf9] bg-[#e3f2fd] p-6">
            <h3 className="text-[1rem] font-semibold text-[#212121] mb-4">Approval status</h3>
            <div className="space-y-3">
              <div className="rounded border border-[#90caf9] bg-white p-3">
                <p className="text-[0.75rem] text-[#616161] mb-1">Status</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">Pending admin approver decision</p>
              </div>
              <div className="rounded border border-[#90caf9] bg-white p-3">
                <p className="text-[0.75rem] text-[#616161] mb-1">Sent by</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">{approvalSubmission.submittedBy}</p>
              </div>
              <div className="rounded border border-[#90caf9] bg-white p-3">
                <p className="text-[0.75rem] text-[#616161] mb-1">Sent at</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">{submittedAtLabel}</p>
              </div>
              <div className="rounded border border-[#90caf9] bg-white p-3">
                <p className="text-[0.75rem] text-[#616161] mb-1">Pending with</p>
                <p className="text-[0.875rem] font-medium text-[#212121]">{approvalSubmission.pendingWith}</p>
              </div>
            </div>
          </div>

          {request.reviewerDecisionContext && (
            <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-6">
              <h3 className="text-[1rem] font-semibold text-[#212121] mb-4">Reviewer notes for approver</h3>
              {request.reviewerDecisionContext.flag && (
                <div className="mb-3 rounded border-l-4 border-[#ffc107] bg-[#fff8e1] p-3">
                  <p className="text-[0.75rem] font-medium text-[#212121] mb-1">Flag raised for approver</p>
                  <p className="text-[0.875rem] text-[#212121]">{request.reviewerDecisionContext.flag.comment}</p>
                </div>
              )}
              {request.reviewerDecisionContext.notes && (
                <div className="rounded border border-[#e0e0e0] bg-white p-3 mb-3">
                  <p className="text-[0.75rem] text-[#616161] mb-1">Comments</p>
                  <p className="text-[0.875rem] text-[#212121] whitespace-pre-wrap">{request.reviewerDecisionContext.notes}</p>
                </div>
              )}
              {request.reviewerDecisionContext.attachments.length > 0 && (
                <div className="rounded border border-[#e0e0e0] bg-white p-3">
                  <p className="text-[0.75rem] text-[#616161] mb-2">Attachments</p>
                  <ul className="space-y-1">
                    {request.reviewerDecisionContext.attachments.map((attachment) => (
                      <li key={`${attachment.name}-${attachment.sizeLabel}`} className="text-[0.875rem] text-[#212121]">
                        {attachment.name} ({attachment.sizeLabel})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!request.reviewerDecisionContext.notes && request.reviewerDecisionContext.attachments.length === 0 && !request.reviewerDecisionContext.flag && (
                <p className="text-[0.875rem] text-[#616161]">No additional reviewer context was provided.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
