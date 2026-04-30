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
  linkedUser?: {
    id: string;
    name: string;
    aretiicoId: string;
  };
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
  { id: 'usr-2001', name: 'Alex Morgan', aretiicoId: '100200300401' },
  { id: 'usr-2002', name: 'Sam Patel', aretiicoId: '100200300402' },
  { id: 'usr-2003', name: 'Jordan Lee', aretiicoId: '100200300403' },
];

const starterRequest: ResetRequest = {
  aretiicoId: '100200300401',
  legalName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  idFileName: 'alex-morgan-passport.pdf',
  linkedUser: mockUsers[0],
};

export function TwoFactorResetWorkflow() {
  const [role, setRole] = useState<TwoFactorRole>('customer');
  const [status, setStatus] = useState<TwoFactorStatus>('draft');
  const [rejectionReason, setRejectionReason] = useState('');
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
      linkedUser: starterRequest.linkedUser,
    });
    setRejectionReason('');
    setStatus('submitted');
  }

  function handleSendForApproval(userId: string) {
    const linkedUser = mockUsers.find((user) => user.id === userId) || mockUsers[0];
    setRequest((current) => ({
      ...current,
      linkedUser,
    }));
    setRejectionReason('');
    setStatus('sent_for_approval');
  }

  function handleReject(reason: string) {
    setRejectionReason(reason);
    setStatus('rejected');
  }

  function handleApprove() {
    setRejectionReason('');
    setStatus('approved');
  }

  function resetCustomerDraft() {
    setRejectionReason('');
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
        <AdminTwoFactorResetSentForApproval />
      )}
      {role === 'reviewer' && status === 'rejected' && (
        <AdminTwoFactorResetRejectedConfirmation reason={rejectionReason} />
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
        <AdminTwoFactorResetRejectedConfirmation reason={rejectionReason} />
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
