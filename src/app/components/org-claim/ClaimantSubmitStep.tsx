import { useState } from 'react';
import { SearchOrganisationStep } from './claimant/SearchOrganisationStep';
import { OrganisationDetailsStep } from './claimant/OrganisationDetailsStep';
import { AcceptTermsStep } from './claimant/AcceptTermsStep';
import { PendingReviewStep } from './claimant/PendingReviewStep';
import { ApplicationResultStep } from './claimant/ApplicationResultStep';
import { ClaimedOrgOptionsStep } from './claimant/ClaimedOrgOptionsStep';
import { JoinRequestSubmittedStep } from './claimant/JoinRequestSubmittedStep';

type ClaimantStep =
  | 'search-organisation'
  | 'claimed-org-options'
  | 'join-request-submitted'
  | 'organisation-details'
  | 'accept-terms'
  | 'pending-review'
  | 'result';

type ClaimantBranch =
  | 'standard-claim'
  | 'claimed-org-choice'
  | 'join-request'
  | 'ownership-dispute';

interface Organisation {
  id: string;
  name: string;
  type: string;
  registrationNumber: string;
  source: string;
  claimed?: boolean;
}

export function ClaimantSubmitStep() {
  const [currentStep, setCurrentStep] = useState<ClaimantStep>('search-organisation');
  const [branch, setBranch] = useState<ClaimantBranch>('standard-claim');
  const [resultStatus, setResultStatus] = useState<'approved' | 'rejected'>('approved');

  const [claimData, setClaimData] = useState({
    organisation: null as Organisation | null,
    claimantName: 'John Smith', // Mock - in real app would come from authenticated user
    role: '',
    website: '',
    telephone: '',
    email: '',
    isPSC: false,
    pscName: '',
    pscRole: '',
  });

  const visibleStepsByBranch: Record<ClaimantBranch, { id: ClaimantStep; label: string }[]> = {
    'standard-claim': [
      { id: 'search-organisation', label: 'Find Organisation' },
      { id: 'organisation-details', label: 'Organisation Details' },
      { id: 'accept-terms', label: 'Accept Terms' },
    ],
    'claimed-org-choice': [
      { id: 'search-organisation', label: 'Find Organisation' },
      { id: 'claimed-org-options', label: 'Organisation Already Claimed' },
    ],
    'join-request': [
      { id: 'search-organisation', label: 'Find Organisation' },
      { id: 'claimed-org-options', label: 'Organisation Already Claimed' },
      { id: 'join-request-submitted', label: 'Join Request Submitted' },
    ],
    'ownership-dispute': [
      { id: 'search-organisation', label: 'Find Organisation' },
      { id: 'claimed-org-options', label: 'Organisation Already Claimed' },
      { id: 'organisation-details', label: 'Organisation Details' },
      { id: 'accept-terms', label: 'Accept Terms' },
    ],
  };

  const visibleSteps = visibleStepsByBranch[branch];
  const currentStepIndex = visibleSteps.findIndex(step => step.id === currentStep);

  const resetClaimFlow = () => {
    setClaimData(prev => ({ ...prev, organisation: null }));
    setBranch('standard-claim');
    setCurrentStep('search-organisation');
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {currentStep !== 'result' && currentStep !== 'pending-review' && (
        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
          <div className="flex items-start justify-center">
            {visibleSteps.map((step, index) => {
              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.id} className="flex items-start flex-none">
                  <div className="flex w-24 flex-col items-center text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-semibold transition-colors ${
                        isComplete
                          ? 'bg-[#00c853] text-white'
                          : isCurrent
                          ? 'bg-[#101F36] text-white'
                          : 'bg-[#e0e0e0] text-[#616161]'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-[0.75rem] mt-2 hidden sm:block ${
                        isCurrent ? 'font-medium text-[#212121]' : 'text-[#616161]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < visibleSteps.length - 1 && (
                    <div
                      className={`mt-4 mx-2 h-0.5 w-12 max-w-12 sm:w-16 sm:max-w-16 md:w-20 md:max-w-20 transition-colors ${
                        isComplete ? 'bg-[#00c853]' : 'bg-[#e0e0e0]'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step Content */}
      {currentStep === 'search-organisation' && (
        <SearchOrganisationStep
          onNext={(org) => {
            setClaimData(prev => ({ ...prev, organisation: org }));

            if (org.claimed) {
              setBranch('claimed-org-choice');
              setCurrentStep('claimed-org-options');
              return;
            }

            setBranch('standard-claim');
            setCurrentStep('organisation-details');
          }}
        />
      )}

      {currentStep === 'claimed-org-options' && claimData.organisation && (
        <ClaimedOrgOptionsStep
          organisationName={claimData.organisation.name}
          onRequestJoin={() => {
            setBranch('join-request');
            setCurrentStep('join-request-submitted');
          }}
          onDisputeOwnership={() => {
            setBranch('ownership-dispute');
            setCurrentStep('organisation-details');
          }}
        />
      )}

      {currentStep === 'join-request-submitted' && claimData.organisation && (
        <JoinRequestSubmittedStep
          organisationName={claimData.organisation.name}
          onDone={resetClaimFlow}
        />
      )}

      {currentStep === 'organisation-details' && claimData.organisation && (
        <OrganisationDetailsStep
          organisation={claimData.organisation}
          claimantName={claimData.claimantName}
          onRequestJoinInstead={branch === 'ownership-dispute'
            ? () => {
                setBranch('join-request');
                setCurrentStep('join-request-submitted');
              }
            : undefined}
          onNext={(details) => {
            setClaimData(prev => ({ ...prev, ...details }));
            setCurrentStep('accept-terms');
          }}
        />
      )}

      {currentStep === 'accept-terms' && (
        <AcceptTermsStep
          onNext={() => setCurrentStep('pending-review')}
        />
      )}

      {currentStep === 'pending-review' && claimData.organisation && (
        <PendingReviewStep
          organisationName={claimData.organisation.name}
        />
      )}

      {currentStep === 'result' && claimData.organisation && (
        <ApplicationResultStep
          status={resultStatus}
          organisationName={claimData.organisation.name}
          rejectionReason={resultStatus === 'rejected' ? 'We were unable to verify your authority to represent this organisation. The person with significant control we contacted did not confirm your role.' : undefined}
        />
      )}

      {/* Debug - Quick jump to result */}
      {currentStep === 'pending-review' && (
        <div className="bg-[#fafafa] rounded border border-[#e0e0e0] p-4">
          <p className="text-[0.75rem] font-medium text-[#616161] mb-2">DEBUG: Jump to result</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setResultStatus('approved');
                setCurrentStep('result');
              }}
              className="px-3 py-1 text-[0.75rem] rounded bg-[#00c853] text-white"
            >
              Approved
            </button>
            <button
              onClick={() => {
                setResultStatus('rejected');
                setCurrentStep('result');
              }}
              className="px-3 py-1 text-[0.75rem] rounded bg-[#f44336] text-white"
            >
              Rejected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
