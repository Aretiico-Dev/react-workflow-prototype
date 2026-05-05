import { useState } from 'react';
import { DomainInputStep } from '../v2/DomainInputStep';
import { VerificationMethodStep } from '../v2/VerificationMethodStep';
import { VerificationInProgressStepMulti } from '../v2/VerificationInProgressStepMulti';
import { CertificateDownloadStep } from '../v2/CertificateDownloadStep';
import { CertificateApprovalStatus, CertificateApprovalWaitingStep } from '../certificate-approval/CertificateApprovalWaitingStep';
import { CertificateApproverReviewStep } from '../certificate-approval/CertificateApproverReviewStep';
import { getRoleConfig, RoleOption, RoleSelector } from './RoleSelector';
import { WorkflowProgressStepper } from './WorkflowProgressStepper';

type Step = 'domain' | 'approval' | 'verification-method' | 'verification' | 'download';
type CertificateRole = 'requester' | 'approver';

interface CertificateState {
  domains: string[];
  isWildcard: boolean;
  certificateType: 'dv' | 'ov';
  verificationMethod: 'http' | 'dns';
  includeOrg: boolean;
  organizationId?: string;
  approvalStatus: CertificateApprovalStatus;
  rejectionReason?: string;
}

const certificateRoles: RoleOption[] = [
  {
    id: 'requester',
    label: 'Requester',
    description: 'Customer ordering a TLS certificate',
    accentColor: '#101F36',
    backgroundColor: '#e3f2fd',
  },
  {
    id: 'approver',
    label: 'Certificate Approver',
    description: 'Organisation certificate approver reviewing OV TLS orders',
    accentColor: '#00c853',
    backgroundColor: '#b9f6ca',
  },
];

export function CertificatePurchaseWorkflow() {
  const [role, setRole] = useState<CertificateRole>('requester');
  const [currentStep, setCurrentStep] = useState<Step>('domain');
  const [certificateState, setCertificateState] = useState<CertificateState>({
    domains: [],
    isWildcard: false,
    certificateType: 'dv',
    verificationMethod: 'http',
    includeOrg: false,
    organizationId: undefined,
    approvalStatus: 'pending_approval',
    rejectionReason: undefined,
  });

  const hasValidatedOrganization = true;
  const organizationName = 'Acme Corporation';
  const roleConfig = getRoleConfig(role, certificateRoles);

  const handleDomainSubmit = (domains: string[], certificateType: 'dv' | 'ov', isWildcard: boolean, organizationId?: string) => {
    const includeOrg = certificateType === 'ov';
    setCertificateState(prev => ({
      ...prev,
      domains,
      certificateType,
      isWildcard,
      includeOrg,
      organizationId,
      approvalStatus: 'pending_approval',
      rejectionReason: undefined,
    }));
    setCurrentStep(includeOrg ? 'approval' : 'verification-method');
  };

  const handleVerificationMethodSubmit = (method: 'http' | 'dns') => {
    setCertificateState(prev => ({ ...prev, verificationMethod: method }));
    setCurrentStep('verification');
  };

  const handleVerificationComplete = () => {
    setCurrentStep('download');
  };

  const handleApprovalComplete = () => {
    setCertificateState(prev => ({ ...prev, approvalStatus: 'approved', rejectionReason: undefined }));
  };

  const handleApprovalRejected = (reason?: string) => {
    setCertificateState(prev => ({ ...prev, approvalStatus: 'rejected', rejectionReason: reason }));
  };

  const handleCancelOrder = () => {
    setCurrentStep('domain');
    setCertificateState({
      domains: [],
      isWildcard: false,
      certificateType: 'dv',
      verificationMethod: 'http',
      includeOrg: false,
      organizationId: undefined,
      approvalStatus: 'pending_approval',
      rejectionReason: undefined,
    });
  };

  const handleRevokeCertificate = () => {
    setCurrentStep('domain');
    setCertificateState({
      domains: [],
      isWildcard: false,
      certificateType: 'dv',
      verificationMethod: 'http',
      includeOrg: false,
      organizationId: undefined,
      approvalStatus: 'pending_approval',
      rejectionReason: undefined,
    });
  };

  const stepLabels = {
    'domain': 'Domain',
    'approval': 'Approval',
    'verification-method': 'Method',
    'verification': 'Verify',
    'download': 'Download',
  };

  const steps: Step[] = certificateState.includeOrg || currentStep === 'approval'
    ? ['domain', 'approval', 'verification-method', 'verification', 'download']
    : ['domain', 'verification-method', 'verification', 'download'];
  const progressSteps = steps.map((step) => ({ id: step, label: stepLabels[step] }));
  const approverDomains = certificateState.domains.length > 0 ? certificateState.domains.join(', ') : 'example.com';

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[0.875rem]">
        <span className="text-[#616161]">Certificates</span>
        <span className="text-[#616161]">/</span>
        <span className="text-[#212121] font-medium">Purchase Certificate</span>
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
            onRoleChange={(nextRole) => setRole(nextRole as CertificateRole)}
            roles={certificateRoles}
          />
        </div>
      </div>

      {/* Progress Steps */}
      {role === 'requester' && (
        <WorkflowProgressStepper steps={progressSteps} currentStepId={currentStep} />
      )}

      {/* Step Content */}
      {role === 'requester' && currentStep === 'domain' && (
        <DomainInputStep
          onNext={handleDomainSubmit}
          hasValidatedOrganization={hasValidatedOrganization}
        />
      )}

      {role === 'requester' && currentStep === 'verification-method' && (
        <VerificationMethodStep
          domains={certificateState.domains}
          isWildcard={certificateState.isWildcard}
          onNext={handleVerificationMethodSubmit}
          onBack={() => setCurrentStep(certificateState.includeOrg ? 'approval' : 'domain')}
          onCancel={handleCancelOrder}
        />
      )}

      {role === 'requester' && currentStep === 'verification' && (
        <VerificationInProgressStepMulti
          domains={certificateState.domains}
          method={certificateState.verificationMethod}
          onVerified={handleVerificationComplete}
          onBack={() => setCurrentStep('verification-method')}
          onCancel={handleCancelOrder}
        />
      )}

      {role === 'requester' && currentStep === 'approval' && (
        <CertificateApprovalWaitingStep
          certificateLabel="OV TLS certificate"
          organizationName={organizationName}
          status={certificateState.approvalStatus}
          rejectionReason={certificateState.rejectionReason}
          onContinue={() => setCurrentStep('verification-method')}
          onBack={() => setCurrentStep('domain')}
          onCancel={handleCancelOrder}
          onStartNew={handleCancelOrder}
          onAutoApprove={handleApprovalComplete}
        />
      )}

      {role === 'requester' && currentStep === 'download' && (
        <CertificateDownloadStep
          domain={certificateState.domains.join(', ')}
          certificateType={certificateState.certificateType}
          includeOrg={certificateState.includeOrg}
          onRevoke={handleRevokeCertificate}
        />
      )}

      {role === 'approver' && (
        <CertificateApproverReviewStep
          title="Review TLS Certificate Order"
          certificateLabel="OV TLS certificate"
          organizationName={organizationName}
          subjectLabel="Domains"
          subjectValue={approverDomains}
          status={certificateState.approvalStatus}
          rejectionReason={certificateState.rejectionReason}
          onApprove={handleApprovalComplete}
          onReject={handleApprovalRejected}
        />
      )}
    </div>
  );
}
