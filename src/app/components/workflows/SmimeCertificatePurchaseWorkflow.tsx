import { useState } from 'react';
import { SmimeCertificateDownloadStep } from '../smime/SmimeCertificateDownloadStep';
import { SmimeEmailChecksStep } from '../smime/SmimeEmailChecksStep';
import { SmimeEmailInputStep, SmimeCertificateType } from '../smime/SmimeEmailInputStep';
import { SmimeEmailVerificationSentStep } from '../smime/SmimeEmailVerificationSentStep';

type Step = 'email' | 'checks' | 'verify-email' | 'download';

interface SmimeCertificateState {
  emailAddress: string;
  certificateType: SmimeCertificateType;
  organizationId?: string;
  verificationCode: string;
  emailVerified: boolean;
}

const createVerificationCode = () => String(Math.floor(100000 + Math.random() * 900000));

export function SmimeCertificatePurchaseWorkflow() {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [certificateState, setCertificateState] = useState<SmimeCertificateState>({
    emailAddress: '',
    certificateType: 'personal',
    organizationId: undefined,
    verificationCode: createVerificationCode(),
    emailVerified: false,
  });

  const hasValidatedOrganization = true;

  const resetWorkflow = () => {
    setCurrentStep('email');
    setCertificateState({
      emailAddress: '',
      certificateType: 'personal',
      organizationId: undefined,
      verificationCode: createVerificationCode(),
      emailVerified: false,
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
    }));
    setCurrentStep('checks');
  };

  const handleSendVerificationEmail = () => {
    setCurrentStep('verify-email');
  };

  const handleEmailVerified = () => {
    setCertificateState(prev => ({ ...prev, emailVerified: true }));
    setCurrentStep('download');
  };

  const stepLabels = {
    email: 'Email',
    checks: 'Checks',
    'verify-email': 'Verify',
    download: 'Download',
  };

  const steps: Step[] = ['email', 'checks', 'verify-email', 'download'];
  const stepIndex = steps.indexOf(currentStep);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[0.875rem]">
        <span className="text-[#616161]">Certificates</span>
        <span className="text-[#616161]">/</span>
        <span className="text-[#212121] font-medium">Purchase S/MIME Certificate</span>
      </div>

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

      {currentStep === 'email' && (
        <SmimeEmailInputStep
          onNext={handleEmailSubmit}
          onCancel={resetWorkflow}
          hasValidatedOrganization={hasValidatedOrganization}
        />
      )}

      {currentStep === 'checks' && (
        <SmimeEmailChecksStep
          emailAddress={certificateState.emailAddress}
          onSendVerificationEmail={handleSendVerificationEmail}
          onBack={() => setCurrentStep('email')}
          onCancel={resetWorkflow}
        />
      )}

      {currentStep === 'verify-email' && (
        <SmimeEmailVerificationSentStep
          emailAddress={certificateState.emailAddress}
          verificationCode={certificateState.verificationCode}
          onVerified={handleEmailVerified}
          onBack={() => setCurrentStep('checks')}
          onCancel={resetWorkflow}
        />
      )}

      {currentStep === 'download' && (
        <SmimeCertificateDownloadStep
          emailAddress={certificateState.emailAddress}
          certificateType={certificateState.certificateType}
          organizationId={certificateState.organizationId}
        />
      )}
    </div>
  );
}
