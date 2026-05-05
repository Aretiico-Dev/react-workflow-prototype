import { useState } from 'react';
import { RoleOption, RoleSelector, getRoleConfig } from './RoleSelector';
import { TwoFactorResetRequestStep } from '../2fa/TwoFactorResetRequestStep';
import { TwoFactorResetRequestConfirmation } from '../2fa/TwoFactorResetRequestConfirmation';
import { AdminTwoFactorResetReviewStep } from '../2fa/AdminTwoFactorResetReviewStep';
import { AdminTwoFactorResetSentForApproval } from '../2fa/AdminTwoFactorResetSentForApproval';
import { AdminTwoFactorResetApproverStep } from '../2fa/AdminTwoFactorResetApproverStep';
import { AdminTwoFactorResetApprovedConfirmation } from '../2fa/AdminTwoFactorResetApprovedConfirmation';
import { AdminTwoFactorResetRejectedConfirmation } from '../2fa/AdminTwoFactorResetRejectedConfirmation';

type TwoFactorRole = 'customer' | 'reviewer' | 'approver';
type TwoFactorStatus =
  | 'draft'
  | 'submitted'
  | 'sent_for_approval'
  | 'approved'
  | 'rejected';

interface ResetRequest {
  aretiicoId: string;
  legalName: string;
  email: string;
  idFileName: string;
  idFileUrl: string;
  linkedUser?: {
    id: string;
    name: string;
    aretiicoId: string;
    dateOfBirth: string;
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
}

interface RejectionRecord {
  reason: string;
  rejectedBy: string;
  rejectedAt: string;
}

interface ApprovalSubmissionRecord {
  submittedBy: string;
  submittedAt: string;
  pendingWith: string;
}

const twoFactorRoles: RoleOption[] = [
  {
    id: 'customer',
    label: 'Customer',
    description: 'User requesting a two factor authentication reset',
    accentColor: '#101F36',
    backgroundColor: '#e3f2fd',
  },
  {
    id: 'reviewer',
    label: 'Application Reviewer',
    description: 'Administrator validating identity and linking the account',
    accentColor: '#ffc107',
    backgroundColor: '#fff8e1',
  },
  {
    id: 'approver',
    label: 'Admin Approver',
    description: 'Final approver authorising the reset request',
    accentColor: '#00c853',
    backgroundColor: '#b9f6ca',
  },
];

const mockUsers = [
  {
    id: 'usr-2001',
    name: 'Sarah Meredyth Morgan',
    aretiicoId: '100200300401',
    dateOfBirth: '1976-03-11',
    emails: ['sarah.morgan@example.com', 's.morgan@northbridge.test'],
    idDocument: {
      fileUrl: '/src/imports/driving_license.jpeg',
      type: 'UK Driving Licence',
    },
  },
  {
    id: 'usr-2002',
    name: 'Sam Patel',
    aretiicoId: '100200300402',
    dateOfBirth: '1989-10-02',
    emails: ['sam.patel@example.com'],
    idDocument: {
      fileUrl: '/src/imports/driving_license.jpeg',
      type: 'UK Driving Licence',
    },
  },
  {
    id: 'usr-2003',
    name: 'Jordan Lee',
    aretiicoId: '100200300403',
    dateOfBirth: '1992-07-24',
    emails: ['jordan.lee@example.com', 'j.lee+admin@example.com'],
    idDocument: {
      fileUrl: '/src/imports/driving_license.jpeg',
      type: 'UK Driving Licence',
    },
  },
];

const starterRequest: ResetRequest = {
  aretiicoId: '100200300401',
  legalName: 'Sarah Meredyth Morgan',
  email: 'sarah.morgan@example.com',
  idFileName: 'sarah-morgan-driving-licence.jpeg',
  idFileUrl: '/src/imports/driving_license.jpeg',
  linkedUser: mockUsers[0],
};

export function TwoFactorResetWorkflow() {
  const [role, setRole] = useState<TwoFactorRole>('customer');
  const [status, setStatus] = useState<TwoFactorStatus>('draft');
  const [rejectionRecord, setRejectionRecord] = useState<RejectionRecord | null>(null);
  const [approvalSubmissionRecord, setApprovalSubmissionRecord] = useState<ApprovalSubmissionRecord | null>(null);
  const [request, setRequest] = useState<ResetRequest>(starterRequest);

  const roleConfig = getRoleConfig(role, twoFactorRoles);

  function handleCustomerSubmit(data: {
    aretiicoId: string;
    legalName: string;
    email: string;
    idFile: File | null;
  }) {
    setRequest({
      aretiicoId: data.aretiicoId,
      legalName: data.legalName,
      email: data.email,
      idFileName: data.idFile?.name || 'government-id.pdf',
      idFileUrl: starterRequest.idFileUrl,
      linkedUser: starterRequest.linkedUser,
    });
    setRejectionRecord(null);
    setApprovalSubmissionRecord(null);
    setStatus('submitted');
  }

  function handleSendForApproval(payload: {
    userId: string;
    reviewerNotes: string;
    reviewerFiles: File[];
    flag?: { comment: string };
  }) {
    const linkedUser = mockUsers.find((user) => user.id === payload.userId) || mockUsers[0];
    setRequest((current) => ({
      ...current,
      linkedUser,
      reviewerDecisionContext: {
        notes: payload.reviewerNotes,
        attachments: payload.reviewerFiles.map((file) => ({
          name: file.name,
          sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        })),
        flag: payload.flag,
      },
    }));
    setRejectionRecord(null);
    setApprovalSubmissionRecord({
      submittedBy: 'Priya Shah, Application Reviewer',
      submittedAt: new Date().toISOString(),
      pendingWith: 'Martin Hughes, Admin Approver',
    });
    setStatus('sent_for_approval');
  }

  function handleReject(reason: string) {
    const rejectedBy = role === 'reviewer' ? 'Priya Shah, Application Reviewer' : 'Martin Hughes, Admin Approver';
    setRejectionRecord({
      reason,
      rejectedBy,
      rejectedAt: new Date().toISOString(),
    });
    if (status !== 'sent_for_approval') {
      setApprovalSubmissionRecord(null);
    }
    setStatus('rejected');
  }

  function handleApprove() {
    setRejectionRecord(null);
    setStatus('approved');
  }

  function resetCustomerDraft() {
    setRejectionRecord(null);
    setApprovalSubmissionRecord(null);
    setStatus('draft');
  }

  return (
    <div className="space-y-6">
      <div
        className="p-4 rounded border-l-4"
        style={{
          backgroundColor: roleConfig.backgroundColor,
          borderLeftColor: roleConfig.accentColor,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[1rem] font-semibold text-[#212121]">
              Viewing as: {roleConfig.label}
            </h3>
            <p className="text-[0.75rem] text-[#616161] mt-0.5">
              {roleConfig.description}
            </p>
          </div>
          <RoleSelector
            currentRole={role}
            onRoleChange={(nextRole) => setRole(nextRole as TwoFactorRole)}
            roles={twoFactorRoles}
          />
        </div>
      </div>

      {role === 'customer' && status === 'draft' && (
        <TwoFactorResetRequestStep onSubmit={handleCustomerSubmit} />
      )}
      {role === 'customer' && status !== 'draft' && (
        <TwoFactorResetRequestConfirmation onStartAnotherRequest={resetCustomerDraft} />
      )}
      {role === 'reviewer' && status !== 'sent_for_approval' && status !== 'approved' && status !== 'rejected' && (
        <AdminTwoFactorResetReviewStep
          request={request}
          users={mockUsers}
          onSendForApproval={handleSendForApproval}
          onReject={handleReject}
        />
      )}
      {role === 'reviewer' && status === 'sent_for_approval' && (
        approvalSubmissionRecord && <AdminTwoFactorResetSentForApproval request={request} approvalSubmission={approvalSubmissionRecord} />
      )}
      {role === 'reviewer' && status === 'rejected' && (
        rejectionRecord && <AdminTwoFactorResetRejectedConfirmation request={request} rejection={rejectionRecord} />
      )}
      {role === 'approver' && status === 'sent_for_approval' && request.linkedUser && (
        <AdminTwoFactorResetApproverStep
          request={{
            ...request,
            linkedUser: request.linkedUser,
          }}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
      {role === 'approver' && status === 'approved' && (
        <AdminTwoFactorResetApprovedConfirmation />
      )}
      {role === 'approver' && status === 'rejected' && (
        rejectionRecord && <AdminTwoFactorResetRejectedConfirmation request={request} rejection={rejectionRecord} />
      )}

      <div className="bg-[#fafafa] rounded border border-[#e0e0e0] p-4">
        <p className="text-[0.75rem] font-medium text-[#616161] mb-2">PROTOTYPE STATE</p>
        <div className="flex gap-2 flex-wrap">
          {(['draft', 'submitted', 'sent_for_approval', 'approved', 'rejected'] as TwoFactorStatus[]).map((nextStatus) => (
            <button
              key={nextStatus}
              onClick={() => setStatus(nextStatus)}
              className={`px-3 py-1 text-[0.75rem] rounded border ${
                status === nextStatus
                  ? 'bg-[#101F36] text-white border-[#101F36]'
                  : 'bg-white text-[#212121] border-[#e0e0e0] hover:border-[#90caf9]'
              }`}
            >
              {nextStatus.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
