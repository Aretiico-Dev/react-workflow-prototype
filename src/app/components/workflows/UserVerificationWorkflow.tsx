import { useState } from 'react';
import { UserRole, RoleSelector, getRoleConfig } from './RoleSelector';
import { VerificationStatusTimeline, VerificationStatus } from './VerificationStatusTimeline';
import { CustomerSubmitStep } from '../user-verification/CustomerSubmitStep';
import { CustomerTrackingStep } from '../user-verification/CustomerTrackingStep';
import { ReviewerReviewStep } from '../user-verification/ReviewerReviewStep';
import { ApproverReviewStep } from '../user-verification/ApproverReviewStep';

export function UserVerificationWorkflow() {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('draft');

  const roleConfig = getRoleConfig(currentRole);

  // Mock verification data - will be replaced with real state
  const verificationData = {
    id: 'VER-2026-0042',
    customerName: 'John Smith',
    submittedDate: '2026-04-20',
    status: verificationStatus,
  };

  return (
    <div className="space-y-6">
      {/* Role Context Banner */}
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
          <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[0.875rem]">
        <span className="text-[#616161]">Verifications</span>
        <span className="text-[#616161]">/</span>
        <span className="text-[#212121] font-medium">
          {currentRole === 'customer' ? 'My Verification' : `Review ${verificationData.id}`}
        </span>
      </div>

      {/* Verification Info Card */}
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[1.25rem] font-semibold text-[#212121]">
              User Verification: {verificationData.id}
            </h3>
            {currentRole !== 'customer' && (
              <p className="text-[0.875rem] text-[#616161] mt-1">
                Customer: {verificationData.customerName}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[0.75rem] text-[#616161]">Submitted</p>
            <p className="text-[0.875rem] font-medium text-[#212121]">{verificationData.submittedDate}</p>
          </div>
        </div>
      </div>

      {/* Status Timeline - only show after submission */}
      {verificationStatus !== 'draft' && (
        <VerificationStatusTimeline currentStatus={verificationStatus} />
      )}

      {/* Role-Specific Content */}
      <div className="space-y-6">
        {currentRole === 'customer' && verificationStatus === 'draft' && <CustomerSubmitStep />}
        {currentRole === 'customer' && verificationStatus !== 'draft' && <CustomerTrackingStep />}
        {currentRole === 'reviewer' && <ReviewerReviewStep />}
        {currentRole === 'approver' && <ApproverReviewStep />}
      </div>

      {/* Debug Controls - Remove in production */}
      <div className="bg-[#fafafa] rounded border border-[#e0e0e0] p-4">
        <p className="text-[0.75rem] font-medium text-[#616161] mb-2">DEBUG: Change Status</p>
        <div className="flex gap-2 flex-wrap">
          {(['draft', 'submitted', 'under_review', 'reviewed', 'approved', 'rejected', 'changes_requested'] as VerificationStatus[]).map(status => (
            <button
              key={status}
              onClick={() => setVerificationStatus(status)}
              className={`px-3 py-1 text-[0.75rem] rounded border ${
                verificationStatus === status
                  ? 'bg-[#101F36] text-white border-[#101F36]'
                  : 'bg-white text-[#212121] border-[#e0e0e0] hover:border-[#90caf9]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
