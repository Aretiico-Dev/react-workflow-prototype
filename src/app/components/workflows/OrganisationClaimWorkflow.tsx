import { useState } from 'react';
import { RoleSelector, RoleOption, getRoleConfig } from './RoleSelector';
import { ClaimantSubmitStep } from '../org-claim/ClaimantSubmitStep';
import { ReviewerReviewStep } from '../org-claim/ReviewerReviewStep';
import { ApproverReviewStep } from '../org-claim/ApproverReviewStep';

type Role = 'claimant' | 'reviewer' | 'approver';
type ClaimScenario = 'standard' | 'dispute';

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
  const [scenario, setScenario] = useState<ClaimScenario>('standard');
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[1rem] font-semibold text-[#212121]">
              Viewing as: {roleConfig.label}
            </h3>
            <p className="text-[0.75rem] text-[#616161] mt-0.5">
              {roleConfig.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RoleSelector
              currentRole={role}
              onRoleChange={(nextRole) => setRole(nextRole as Role)}
              roles={organisationClaimRoles}
            />
            {(role === 'reviewer' || role === 'approver') && (
              <div className="relative">
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value as ClaimScenario)}
                  className="appearance-none px-4 py-2 pr-8 border border-[#e0e0e0] rounded bg-white text-[0.875rem] font-medium text-[#212121] hover:border-[#90caf9] focus:outline-none focus:border-[#101F36] focus:ring-1 focus:ring-[#101F36] cursor-pointer"
                >
                  <option value="standard">Standard Claim</option>
                  <option value="dispute">Disputed Claim</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-[#616161]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {role === 'claimant' && <ClaimantSubmitStep />}
      {role === 'reviewer' && <ReviewerReviewStep key={`reviewer-${scenario}`} scenario={scenario} />}
      {role === 'approver' && <ApproverReviewStep key={`approver-${scenario}`} scenario={scenario} />}
    </div>
  );
}
