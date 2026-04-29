import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AutomatedChecksReviewStep } from './reviewer/AutomatedChecksReviewStep';
import { ExtractLocalityStep } from './reviewer/ExtractLocalityStep';
import { ManualResearchStep } from './reviewer/ManualResearchStep';
import { VerifyPSCContactsStep } from './reviewer/VerifyPSCContactsStep';
import { PhoneCallStep } from './reviewer/PhoneCallStep';
import { JoinTeamsCallStep } from './reviewer/JoinTeamsCallStep';
import { RecordCallStep } from './reviewer/RecordCallStep';
import { UploadEmailStep } from './reviewer/UploadEmailStep';
import { SendForReviewStep } from './reviewer/SendForReviewStep';
import { DisputeReviewStep } from './reviewer/DisputeReviewStep';
import { ReviewSentStep } from './reviewer/ReviewSentStep';

type ReviewerStep =
  | 'automated-checks'
  | 'extract-locality'
  | 'manual-research'
  | 'verify-psc'
  | 'phone-call'
  | 'join-teams'
  | 'record-call'
  | 'upload-email'
  | 'dispute-review'
  | 'send-review'
  | 'review-sent';

interface ReviewerReviewStepProps {
  scenario: 'standard' | 'dispute';
}

export function ReviewerReviewStep({ scenario }: ReviewerReviewStepProps) {
  const [currentStep, setCurrentStep] = useState<ReviewerStep>('automated-checks');
  const [flags, setFlags] = useState<Array<{ step: string; comment: string }>>([]);
  const [cancelled, setCancelled] = useState(false);
  const reviewerName = 'Sindy Jones';

  // Mock data
  const [claimData] = useState({
    organisationName: 'ABC Limited',
    claimantName: 'John Smith',
    role: 'Director',
    registeredAddress: {
      line1: '123 Oxford Street',
      line2: 'Marylebone',
      line3: 'London',
      postcode: 'W1D 1LL',
      country: 'United Kingdom',
    },
  });

  const [locationData, setLocationData] = useState({
    locality: '',
    state: '',
  });

  const [pscContact, setPscContact] = useState({
    name: 'Jane Director',
    role: 'CEO',
    phone: '+44 20 1234 5678',
    email: 'jane.director@abclimited.com',
  });

  const disputeData = {
    activeRepresentative: {
      name: 'Sarah Williams',
      role: 'Compliance Manager',
      email: 'sarah.williams@abclimited.com',
      phone: '+44 20 9876 5432',
      supportedByPsc: 'Michael Brown, Chair',
      supportEmail: 'michael.brown@abclimited.com',
      claimSummary: 'Current representative since May 2024 with active certificate management access.',
    },
    claimant: {
      name: claimData.claimantName,
      role: claimData.role,
      email: 'john.smith@abclimited.com',
      phone: '+44 20 1234 2222',
      supportedByPsc: `${pscContact.name}, ${pscContact.role}`,
      supportEmail: pscContact.email,
      claimSummary: 'Submitted a dispute stating the current representative is no longer authorised to act.',
    },
  };

  const [evidenceFiles, setEvidenceFiles] = useState<{
    manualReport: File | null;
    callRecording: File | null;
    emailConfirmation: File | null;
    callComments: string;
    callDateTime: string;
    pscDecisionNotes: string;
    pscSupportingFiles: File[];
    disputeRecommendation: 'active-representative' | 'claimant' | null;
    disputeRecommendationReason: string;
  }>({
    manualReport: null,
    callRecording: null,
    emailConfirmation: null,
    callComments: '',
    callDateTime: '',
    pscDecisionNotes: '',
    pscSupportingFiles: [],
    disputeRecommendation: null,
    disputeRecommendationReason: '',
  });

  const addFlag = (step: string, comment: string) => {
    setFlags(prev => [...prev, { step, comment }]);
  };

  const steps: { id: ReviewerStep; label: string }[] = [
    { id: 'automated-checks', label: 'Automated Checks' },
    { id: 'extract-locality', label: 'Extract Locality' },
    { id: 'manual-research', label: 'Manual Research' },
    { id: 'verify-psc', label: 'Verify PSC' },
    { id: 'phone-call', label: 'Phone Call' },
    { id: 'join-teams', label: 'Teams Call' },
    { id: 'record-call', label: 'Record Call' },
    { id: 'upload-email', label: 'Email Confirmation' },
    ...(scenario === 'dispute'
      ? [{ id: 'dispute-review' as ReviewerStep, label: 'Dispute Review' }]
      : [{ id: 'send-review' as ReviewerStep, label: 'Send for Review' }]),
    { id: 'review-sent', label: 'Complete' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const navigationLockStep: ReviewerStep = scenario === 'dispute' ? 'dispute-review' : 'send-review';
  const navigationLockIndex = steps.findIndex(s => s.id === navigationLockStep);
  const canNavigateBack = currentStepIndex > 0 && currentStepIndex < navigationLockIndex;

  const navigateToStep = (stepId: ReviewerStep) => {
    if (currentStepIndex >= navigationLockIndex) return;

    const targetIndex = steps.findIndex(step => step.id === stepId);
    if (targetIndex >= 0 && targetIndex < currentStepIndex) {
      setCurrentStep(stepId);
    }
  };

  const goToPreviousStep = () => {
    if (!canNavigateBack) return;
    setCurrentStep(steps[currentStepIndex - 1].id);
  };

  if (cancelled) {
    return (
      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-12 text-center">
        <h4 className="text-[1.125rem] font-semibold text-[#212121] mb-4">
          Application Cancelled
        </h4>
        <p className="text-[0.875rem] text-[#616161]">
          This organisation claim has been cancelled and the claimant has been notified.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {currentStep !== 'review-sent' && (
        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => {
              if (step.id === 'review-sent') return null;

              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isClickable = currentStepIndex < navigationLockIndex && index < currentStepIndex;

              return (
                <div key={step.id} className="flex items-center flex-1 min-w-[100px]">
                  <button
                    type="button"
                    onClick={() => navigateToStep(step.id)}
                    disabled={!isClickable}
                    className={`flex flex-col items-center ${
                      isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                    } disabled:opacity-100`}
                  >
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
                      className={`text-[0.75rem] mt-2 text-center ${
                        isCurrent ? 'font-medium text-[#212121]' : 'text-[#616161]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                  {index < steps.length - 2 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-colors ${
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

      {canNavigateBack && (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#e0e0e0] rounded bg-white text-[0.875rem] font-medium text-[#212121] hover:bg-[#fafafa] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      )}

      {/* Step Content */}
      {currentStep === 'automated-checks' && (
        <AutomatedChecksReviewStep
          onNext={(flag) => {
            if (flag) addFlag('Automated Checks', flag.comment);
            setCurrentStep('extract-locality');
          }}
        />
      )}

      {currentStep === 'extract-locality' && (
        <ExtractLocalityStep
          organisationName={claimData.organisationName}
          registeredAddress={claimData.registeredAddress}
          onNext={(locality, state, flag) => {
            setLocationData({ locality, state });
            if (flag) addFlag('Locality Extraction', flag.comment);
            setCurrentStep('manual-research');
          }}
        />
      )}

      {currentStep === 'manual-research' && (
        <ManualResearchStep
          onNext={(report, flag) => {
            setEvidenceFiles(prev => ({ ...prev, manualReport: report }));
            if (flag) addFlag('Manual Research', flag.comment);
            setCurrentStep('verify-psc');
          }}
        />
      )}

      {currentStep === 'verify-psc' && (
        <VerifyPSCContactsStep
          providedContacts={pscContact}
          onNext={(contacts, evidence, flag) => {
            setPscContact(contacts);
            setEvidenceFiles(prev => ({
              ...prev,
              pscDecisionNotes: evidence.decisionNotes,
              pscSupportingFiles: evidence.supportingFiles,
            }));
            if (flag) addFlag('PSC Verification', flag.comment);
            setCurrentStep('phone-call');
          }}
        />
      )}

      {currentStep === 'phone-call' && (
        <PhoneCallStep
          pscContact={pscContact}
          claimantName={claimData.claimantName}
          reviewerName={reviewerName}
          onNext={(callData, flag) => {
            setEvidenceFiles(prev => ({ ...prev, callDateTime: callData.callDateTime, callComments: callData.comments }));
            if (flag) addFlag('Phone Call', flag.comment);
            setCurrentStep('join-teams');
          }}
          onCancel={(reason) => {
            setCancelled(true);
          }}
        />
      )}

      {currentStep === 'join-teams' && (
        <JoinTeamsCallStep
          callDateTime={evidenceFiles.callDateTime}
          pscName={pscContact.name}
          claimantName={claimData.claimantName}
          reviewerName={reviewerName}
          onContinue={(flag) => {
            if (flag) addFlag('Teams Call', flag.comment);
            setCurrentStep('record-call');
          }}
        />
      )}

      {currentStep === 'record-call' && (
        <RecordCallStep
          onNext={(recording, comments, flag) => {
            setEvidenceFiles(prev => ({ ...prev, callRecording: recording, callComments: comments }));
            if (flag) addFlag('Call Recording', flag.comment);
            setCurrentStep('upload-email');
          }}
        />
      )}

      {currentStep === 'upload-email' && (
        <UploadEmailStep
          onNext={(email, flag) => {
            setEvidenceFiles(prev => ({ ...prev, emailConfirmation: email }));
            if (flag) addFlag('Email Confirmation', flag.comment);
            setCurrentStep(scenario === 'dispute' ? 'dispute-review' : 'send-review');
          }}
        />
      )}

      {currentStep === 'dispute-review' && (
        <DisputeReviewStep
          organisationName={claimData.organisationName}
          activeRepresentative={disputeData.activeRepresentative}
          claimant={disputeData.claimant}
          initialSelection={evidenceFiles.disputeRecommendation}
          initialReason={evidenceFiles.disputeRecommendationReason}
          onSendForReview={(selection, rationale) => {
            setEvidenceFiles(prev => ({
              ...prev,
              disputeRecommendation: selection,
              disputeRecommendationReason: rationale,
            }));
            setCurrentStep('review-sent');
          }}
        />
      )}

      {currentStep === 'send-review' && evidenceFiles.manualReport && evidenceFiles.callRecording && evidenceFiles.emailConfirmation && (
        <SendForReviewStep
          claimData={claimData}
          evidence={{
            automatedReportsCount: 5,
            manualReportFile: evidenceFiles.manualReport,
            callRecordingFile: evidenceFiles.callRecording,
            emailConfirmationFile: evidenceFiles.emailConfirmation,
            callComments: evidenceFiles.callComments,
            pscDecisionNotes: evidenceFiles.pscDecisionNotes,
            pscSupportingFiles: evidenceFiles.pscSupportingFiles,
          }}
          flags={flags}
          onSendForReview={(flag) => {
            if (flag) addFlag('Final Review', flag.comment);
            setCurrentStep('review-sent');
          }}
        />
      )}

      {currentStep === 'review-sent' && (
        <ReviewSentStep organisationName={claimData.organisationName} />
      )}
    </div>
  );
}
