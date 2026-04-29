import { useState } from 'react';
import { DomainInputStep } from '../v2/DomainInputStep';
import { VerificationMethodStep } from '../v2/VerificationMethodStep';
import { VerificationInProgressStepMulti } from '../v2/VerificationInProgressStepMulti';
import { OrganizationDetailsStep } from '../v2/OrganizationDetailsStep';
import { CertificateDownloadStep } from '../v2/CertificateDownloadStep';

type Step = 'domain' | 'verification-method' | 'verification' | 'organization' | 'download';

interface CertificateState {
  domains: string[];
  isWildcard: boolean;
  certificateType: 'dv' | 'ov';
  verificationMethod: 'http' | 'dns';
  includeOrg: boolean;
  organizationId?: string;
}

export function CertificatePurchaseWorkflow() {
  const [currentStep, setCurrentStep] = useState<Step>('domain');
  const [certificateState, setCertificateState] = useState<CertificateState>({
    domains: [],
    isWildcard: false,
    certificateType: 'dv',
    verificationMethod: 'http',
    includeOrg: false,
    organizationId: undefined,
  });

  const hasValidatedOrganization = true;

  const handleDomainSubmit = (domains: string[], certificateType: 'dv' | 'ov', isWildcard: boolean, organizationId?: string) => {
    setCertificateState(prev => ({ ...prev, domains, certificateType, isWildcard, organizationId }));
    setCurrentStep('verification-method');
  };

  const handleVerificationMethodSubmit = (method: 'http' | 'dns') => {
    setCertificateState(prev => ({ ...prev, verificationMethod: method }));
    setCurrentStep('verification');
  };

  const handleVerificationComplete = () => {
    setCurrentStep('organization');
  };

  const handleOrganizationSubmit = (includeOrg: boolean) => {
    setCertificateState(prev => ({ ...prev, includeOrg }));
    setCurrentStep('download');
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
    });
  };

  const stepLabels = {
    'domain': 'Domain',
    'verification-method': 'Method',
    'verification': 'Verify',
    'organization': 'Organization',
    'download': 'Download',
  };

  const steps: Step[] = ['domain', 'verification-method', 'verification', 'organization', 'download'];
  const stepIndex = steps.indexOf(currentStep);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[0.875rem]">
        <span className="text-[#616161]">Certificates</span>
        <span className="text-[#616161]">/</span>
        <span className="text-[#212121] font-medium">Purchase Certificate</span>
      </div>

      {/* Progress Steps */}
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

      {/* Step Content */}
      {currentStep === 'domain' && (
        <DomainInputStep
          onNext={handleDomainSubmit}
          hasValidatedOrganization={hasValidatedOrganization}
        />
      )}

      {currentStep === 'verification-method' && (
        <VerificationMethodStep
          domains={certificateState.domains}
          isWildcard={certificateState.isWildcard}
          onNext={handleVerificationMethodSubmit}
          onBack={() => setCurrentStep('domain')}
          onCancel={handleCancelOrder}
        />
      )}

      {currentStep === 'verification' && (
        <VerificationInProgressStepMulti
          domains={certificateState.domains}
          method={certificateState.verificationMethod}
          onVerified={handleVerificationComplete}
          onBack={() => setCurrentStep('verification-method')}
          onCancel={handleCancelOrder}
        />
      )}

      {currentStep === 'organization' && (
        <OrganizationDetailsStep
          domain={certificateState.domains[0]}
          domains={certificateState.domains}
          certificateType={certificateState.certificateType}
          organizationId={certificateState.organizationId}
          onNext={handleOrganizationSubmit}
          onBack={() => setCurrentStep('verification')}
          onCancel={handleCancelOrder}
        />
      )}

      {currentStep === 'download' && (
        <CertificateDownloadStep
          domain={certificateState.domains.join(', ')}
          certificateType={certificateState.certificateType}
          includeOrg={certificateState.includeOrg}
          onRevoke={handleRevokeCertificate}
        />
      )}
    </div>
  );
}
