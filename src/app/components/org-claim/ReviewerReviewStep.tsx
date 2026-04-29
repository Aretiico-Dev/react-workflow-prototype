import { useState } from 'react';
import { AutomatedChecksReviewStep } from './reviewer/AutomatedChecksReviewStep';
import { ExtractLocalityStep } from './reviewer/ExtractLocalityStep';
import { ManualResearchStep } from './reviewer/ManualResearchStep';
import { VerifyPSCContactsStep } from './reviewer/VerifyPSCContactsStep';
import { PhoneCallStep } from './reviewer/PhoneCallStep';
import { JoinTeamsCallStep } from './reviewer/JoinTeamsCallStep';
import { RecordCallStep } from './reviewer/RecordCallStep';
import { UploadEmailStep } from './reviewer/UploadEmailStep';
import { SendForReviewStep } from './reviewer/SendForReviewStep';
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
  | 'send-review'
  | 'review-sent';

export function ReviewerReviewStep() {
  const [currentStep, setCurrentStep] = useState<ReviewerStep>('automated-checks');
  const [flags, setFlags] = useState<Array<{ step: string; comment: string }>>([]);
  const [cancelled, setCancelled] = useState(false);

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

  const [evidenceFiles, setEvidenceFiles] = useState<{
    manualReport: File | null;
    callRecording: File | null;
    emailConfirmation: File | null;
    callComments: string;
    callDateTime: string;
  }>({
    manualReport: null,
    callRecording: null,
    emailConfirmation: null,
    callComments: '',
    callDateTime: '',
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
    { id: 'send-review', label: 'Send for Review' },
    { id: 'review-sent', label: 'Complete' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

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

              return (
                <div key={step.id} className="flex items-center flex-1 min-w-[100px]">
                  <div className="flex flex-col items-center">
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
                  </div>
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
          onNext={(contacts, flag) => {
            setPscContact(contacts);
            if (flag) addFlag('PSC Verification', flag.comment);
            setCurrentStep('phone-call');
          }}
        />
      )}

      {currentStep === 'phone-call' && (
        <PhoneCallStep
          pscContact={pscContact}
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
            setCurrentStep('send-review');
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
