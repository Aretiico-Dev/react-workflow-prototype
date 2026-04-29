import { useState } from 'react';
import { RoleSelector, RoleOption, getRoleConfig } from './RoleSelector';
import { ClaimantSubmitStep } from '../org-claim/ClaimantSubmitStep';
import { ReviewerReviewStep } from '../org-claim/ReviewerReviewStep';
import { ApproverReviewStep } from '../org-claim/ApproverReviewStep';

type Role = 'claimant' | 'reviewer' | 'approver';

const organisationClaimRoles: RoleOption[] = [
  {
    id: 'claimant',
    label: 'Customer',
    description: 'User submitting an organisation claim',
    accentColor: '#101F36',
    backgroundColor: '#e3f2fd',
  },
  {
    id: 'reviewer',
    label: 'Application Reviewer',
    description: 'First-level organisation claim review',
    accentColor: '#ffc107',
    backgroundColor: '#fff8e1',
  },
  {
    id: 'approver',
    label: 'Admin Approver',
    description: 'Final approval authority',
    accentColor: '#00c853',
    backgroundColor: '#b9f6ca',
  },
];

export function OrganisationClaimWorkflow() {
  const [role, setRole] = useState<Role>('claimant');
  const roleConfig = getRoleConfig(role, organisationClaimRoles);

  return (
    <div className="space-y-6">
      <div
        className="p-4 rounded border-l-4"
        style={{
          backgroundColor: roleConfig.backgroundColor,
          borderLeftColor: roleConfig.accentColor,
        }}
      >
        <div className="flex items-center justify-between">
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
            onRoleChange={(nextRole) => setRole(nextRole as Role)}
            roles={organisationClaimRoles}
          />
        </div>
      </div>

      {role === 'claimant' && <ClaimantSubmitStep />}
      {role === 'reviewer' && <ReviewerReviewStep />}
      {role === 'approver' && <ApproverReviewStep />}
    </div>
  );
}
