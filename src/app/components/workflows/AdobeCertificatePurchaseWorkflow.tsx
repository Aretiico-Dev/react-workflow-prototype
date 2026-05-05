import { useState } from 'react';
import { AdobeApproverReviewStep } from '../adobe-signing/AdobeApproverReviewStep';
import { AdobeCertificateApprovalStep } from '../adobe-signing/AdobeCertificateApprovalStep';
import { AdobeCertificateDownloadStep } from '../adobe-signing/AdobeCertificateDownloadStep';
import { AdobeCertificateOrderStep } from '../adobe-signing/AdobeCertificateOrderStep';
import { adobeOrganizations, adobeOrganizationUsers } from '../adobe-signing/adobeSigningData';
import { getRoleConfig, RoleOption, RoleSelector } from './RoleSelector';
import { WorkflowProgressStepper } from './WorkflowProgressStepper';

type Step = 'order' | 'approval' | 'download';
type AdobeRole = 'requester' | 'approver';
type AdobeOrderStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected';

interface AdobeCertificateState {
  organizationId: string;
  userId?: string;
  status: AdobeOrderStatus;
  rejectionReason?: string;
}

const adobeRoles: RoleOption[] = [
  {
    id: 'requester',
    label: 'Requester',
    description: 'Organisation member ordering an Adobe document signing certificate',
    accentColor: '#101F36',
    backgroundColor: '#e3f2fd',
  },
  {
    id: 'approver',
    label: 'Certificate Approver',
    description: 'Anne Apple reviewing Adobe certificate orders for the organisation',
    accentColor: '#00c853',
    backgroundColor: '#b9f6ca',
  },
];

export function AdobeCertificatePurchaseWorkflow() {
  const [role, setRole] = useState<AdobeRole>('requester');
  const [currentStep, setCurrentStep] = useState<Step>('order');
  const [certificateState, setCertificateState] = useState<AdobeCertificateState>({
    organizationId: '',
    userId: undefined,
    status: 'draft',
    rejectionReason: undefined,
  });

  const resetWorkflow = () => {
    setCurrentStep('order');
    setCertificateState({
      organizationId: '',
      userId: undefined,
      status: 'draft',
      rejectionReason: undefined,
    });
  };

  const handleOrderSubmit = (organizationId: string, userId?: string) => {
    setCertificateState({
      organizationId,
      userId,
      status: 'pending_approval',
      rejectionReason: undefined,
    });
    setCurrentStep('approval');
  };

  const handleApproved = () => {
    setCertificateState(prev => ({ ...prev, status: 'approved', rejectionReason: undefined }));
    setCurrentStep('download');
  };

  const handleRejected = (reason?: string) => {
    setCertificateState(prev => ({ ...prev, status: 'rejected', rejectionReason: reason }));
    setCurrentStep('approval');
  };

  const roleConfig = getRoleConfig(role, adobeRoles);
  const organizationId = certificateState.organizationId || 'org-1';
  const userId = certificateState.organizationId ? certificateState.userId : 'user-1';
  const approverStatus: Exclude<AdobeOrderStatus, 'draft'> =
    certificateState.status === 'draft' ? 'pending_approval' : certificateState.status;
  const organization = adobeOrganizations.find((org) => org.id === organizationId) || adobeOrganizations[0];
  const selectedUser = adobeOrganizationUsers.find((user) => user.id === userId);

  const stepLabels = {
    order: 'Order',
    approval: 'Approval',
    download: 'Download',
  };

  const steps: Step[] = ['order', 'approval', 'download'];
  const progressSteps = steps.map((step) => ({ id: step, label: stepLabels[step] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[0.875rem]">
        <span className="text-[#616161]">Certificates</span>
        <span className="text-[#616161]">/</span>
        <span className="text-[#212121] font-medium">Purchase Adobe Document Signing Certificate</span>
      </div>

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
            onRoleChange={(nextRole) => setRole(nextRole as AdobeRole)}
            roles={adobeRoles}
          />
        </div>
      </div>

      {role === 'requester' && (
        <WorkflowProgressStepper steps={progressSteps} currentStepId={currentStep} />
      )}

      {role === 'requester' && currentStep === 'order' && (
        <AdobeCertificateOrderStep
          onNext={handleOrderSubmit}
          onCancel={resetWorkflow}
        />
      )}

      {role === 'requester' && currentStep === 'approval' && certificateState.status !== 'rejected' && (
        <AdobeCertificateApprovalStep
          organization={organization}
          selectedUser={selectedUser}
          onApproved={handleApproved}
          onBack={() => setCurrentStep('order')}
          onCancel={resetWorkflow}
        />
      )}

      {role === 'requester' && currentStep === 'approval' && certificateState.status === 'rejected' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Order Rejected</h3>
            <p className="text-[0.875rem] text-[#616161]">
              Anne Apple rejected this Adobe document signing certificate order.
            </p>
          </div>
          <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
            <p className="text-[0.875rem] font-medium text-[#212121]">Rejection reason</p>
            <p className="text-[0.875rem] text-[#616161] mt-2">
              {certificateState.rejectionReason || 'No reason was provided.'}
            </p>
          </div>
          <button
            type="button"
            onClick={resetWorkflow}
            className="w-full px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] transition-colors"
          >
            START NEW ORDER
          </button>
        </div>
      )}

      {role === 'requester' && currentStep === 'download' && (
        <AdobeCertificateDownloadStep
          organization={organization}
          selectedUser={selectedUser}
          onRevoke={resetWorkflow}
        />
      )}

      {role === 'approver' && (
        <AdobeApproverReviewStep
          organization={organization}
          selectedUser={selectedUser}
          status={approverStatus}
          rejectionReason={certificateState.rejectionReason}
          onApprove={handleApproved}
          onReject={handleRejected}
        />
      )}
    </div>
  );
}
