import { useState } from 'react';
import { SmimeCertificateDownloadStep } from '../smime/SmimeCertificateDownloadStep';
import { SmimeEmailChecksStep } from '../smime/SmimeEmailChecksStep';
import { SmimeEmailInputStep, SmimeCertificateType, smimeOrganizations } from '../smime/SmimeEmailInputStep';
import { SmimeEmailVerificationSentStep } from '../smime/SmimeEmailVerificationSentStep';
import { CertificateApprovalStatus, CertificateApprovalWaitingStep } from '../certificate-approval/CertificateApprovalWaitingStep';
import { CertificateApproverReviewStep } from '../certificate-approval/CertificateApproverReviewStep';
import { getRoleConfig, RoleOption, RoleSelector } from './RoleSelector';

type Step = 'email' | 'approval' | 'checks' | 'verify-email' | 'download';
type CertificateRole = 'requester' | 'approver';

interface SmimeCertificateState {
  emailAddress: string;
  certificateType: SmimeCertificateType;
  organizationId?: string;
  verificationCode: string;
  emailVerified: boolean;
  approvalStatus: CertificateApprovalStatus;
  rejectionReason?: string;
}

const createVerificationCode = () => String(Math.floor(100000 + Math.random() * 900000));

const certificateRoles: RoleOption[] = [
  {
    id: 'requester',
    label: 'Requester',
    description: 'Customer ordering an S/MIME certificate',
    accentColor: '#101F36',
    backgroundColor: '#e3f2fd',
  },
  {
    id: 'approver',
    label: 'Certificate Approver',
    description: 'Organisation certificate approver reviewing OV S/MIME orders',
    accentColor: '#00c853',
    backgroundColor: '#b9f6ca',
  },
];

export function SmimeCertificatePurchaseWorkflow() {
  const [role, setRole] = useState<CertificateRole>('requester');
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [certificateState, setCertificateState] = useState<SmimeCertificateState>({
    emailAddress: '',
    certificateType: 'personal',
    organizationId: undefined,
    verificationCode: createVerificationCode(),
    emailVerified: false,
    approvalStatus: 'pending_approval',
    rejectionReason: undefined,
  });

  const hasValidatedOrganization = true;
  const roleConfig = getRoleConfig(role, certificateRoles);
  const organization = smimeOrganizations.find((org) => org.id === certificateState.organizationId) || smimeOrganizations.find((org) => org.status === 'validated') || smimeOrganizations[0];
  const approverEmailAddress = certificateState.emailAddress || 'alex.morgan@acme.example';

  const resetWorkflow = () => {
    setCurrentStep('email');
    setCertificateState({
      emailAddress: '',
      certificateType: 'personal',
      organizationId: undefined,
      verificationCode: createVerificationCode(),
      emailVerified: false,
      approvalStatus: 'pending_approval',
      rejectionReason: undefined,
    });
  };

  const handleEmailSubmit = (emailAddress: string, certificateType: SmimeCertificateType, organizationId?: string) => {
    setCertificateState(prev => ({
      ...prev,
      emailAddress,
      certificateType,
      organizationId,
      verificationCode: createVerificationCode(),
      emailVerified: false,
      approvalStatus: 'pending_approval',
      rejectionReason: undefined,
    }));
    setCurrentStep(certificateType === 'ov' ? 'approval' : 'checks');
  };

  const handleSendVerificationEmail = () => {
    setCurrentStep('verify-email');
  };

  const handleEmailVerified = () => {
    setCertificateState(prev => ({ ...prev, emailVerified: true, approvalStatus: 'pending_approval', rejectionReason: undefined }));
    setCurrentStep('download');
  };

  const handleApprovalComplete = () => {
    setCertificateState(prev => ({ ...prev, approvalStatus: 'approved', rejectionReason: undefined }));
  };

  const handleApprovalRejected = (reason?: string) => {
    setCertificateState(prev => ({ ...prev, approvalStatus: 'rejected', rejectionReason: reason }));
  };

  const stepLabels = {
    email: 'Email',
    approval: 'Approval',
    checks: 'Checks',
    'verify-email': 'Verify',
    download: 'Download',
  };

  const steps: Step[] = ['email', 'approval', 'checks', 'verify-email', 'download'];
  const stepIndex = steps.indexOf(currentStep);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[0.875rem]">
        <span className="text-[#616161]">Certificates</span>
        <span className="text-[#616161]">/</span>
        <span className="text-[#212121] font-medium">Purchase S/MIME Certificate</span>
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

      {role === 'requester' && (
        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isComplete = index < stepIndex;
            const isCurrent = index === stepIndex;

            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-semibold transition-colors ${
                    isComplete ? 'bg-[#00c853] text-white' :
                    isCurrent ? 'bg-[#101F36] text-white' :
                    'bg-[#e0e0e0] text-[#616161]'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-[0.875rem] hidden sm:inline ${
                    isCurrent ? 'font-medium text-[#212121]' : 'text-[#616161]'
                  }`}>
                    {stepLabels[step]}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 transition-colors ${
                    isComplete ? 'bg-[#00c853]' : 'bg-[#e0e0e0]'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        </div>
      )}

      {role === 'requester' && currentStep === 'email' && (
        <SmimeEmailInputStep
          onNext={handleEmailSubmit}
          onCancel={resetWorkflow}
          hasValidatedOrganization={hasValidatedOrganization}
        />
      )}

      {role === 'requester' && currentStep === 'checks' && (
        <SmimeEmailChecksStep
          emailAddress={certificateState.emailAddress}
          onSendVerificationEmail={handleSendVerificationEmail}
          onBack={() => setCurrentStep('email')}
          onCancel={resetWorkflow}
        />
      )}

      {role === 'requester' && currentStep === 'verify-email' && (
        <SmimeEmailVerificationSentStep
          emailAddress={certificateState.emailAddress}
          verificationCode={certificateState.verificationCode}
          onVerified={handleEmailVerified}
          onBack={() => setCurrentStep('checks')}
          onCancel={resetWorkflow}
        />
      )}

      {role === 'requester' && currentStep === 'approval' && (
        <CertificateApprovalWaitingStep
          certificateLabel="OV S/MIME certificate"
          organizationName={organization.name}
          status={certificateState.approvalStatus}
          rejectionReason={certificateState.rejectionReason}
          onContinue={() => setCurrentStep('checks')}
          onBack={() => setCurrentStep('email')}
          onCancel={resetWorkflow}
          onStartNew={resetWorkflow}
          onAutoApprove={handleApprovalComplete}
        />
      )}

      {role === 'requester' && currentStep === 'download' && (
        <SmimeCertificateDownloadStep
          emailAddress={certificateState.emailAddress}
          certificateType={certificateState.certificateType}
          organizationId={certificateState.organizationId}
          onRevoke={resetWorkflow}
        />
      )}

      {role === 'approver' && (
        <CertificateApproverReviewStep
          title="Review S/MIME Certificate Order"
          certificateLabel="OV S/MIME certificate"
          organizationName={organization.name}
          subjectLabel="Email Address"
          subjectValue={approverEmailAddress}
          status={certificateState.approvalStatus}
          rejectionReason={certificateState.rejectionReason}
          onApprove={handleApprovalComplete}
          onReject={handleApprovalRejected}
        />
      )}
    </div>
  );
}
