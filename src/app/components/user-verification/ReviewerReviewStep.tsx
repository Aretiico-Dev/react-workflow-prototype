import { useState } from 'react';
import { ReviewIdStep } from './reviewer/ReviewIdStep';
import { ReviewAddressStep } from './reviewer/ReviewAddressStep';
import { AutomatedTasksStep } from './reviewer/AutomatedTasksStep';
import { ManualTasksStep } from './reviewer/ManualTasksStep';
import { JoinCallStep } from './reviewer/JoinCallStep';
import { RecordCallResultsStep } from './reviewer/RecordCallResultsStep';
import { SendForReviewStep } from './reviewer/SendForReviewStep';
import { ReviewSentStep } from './reviewer/ReviewSentStep';

type ReviewerStep =
  | 'review-id'
  | 'review-address'
  | 'automated-tasks'
  | 'manual-tasks'
  | 'join-call'
  | 'record-results'
  | 'send-for-review'
  | 'review-sent';

export function ReviewerReviewStep() {
  const [currentStep, setCurrentStep] = useState<ReviewerStep>('review-id');
  const [flags, setFlags] = useState<Array<{ step: string; comment: string }>>([]);

  // Mock data - in real app would come from the customer submission
  const [verificationData] = useState({
    idDocument: {
      fileUrl: '/src/imports/driving_license.jpeg',
      type: 'UK Driving License'
    },
    addressDocument: {
      fileUrl: '/src/imports/proof-of-address.jpeg',
      type: 'Proof of Address'
    },
    personalDetails: {
      title: 'Mr',
      firstName: 'John',
      middleName: 'William',
      lastName: 'Smith',
      suffix: '',
      dateOfBirth: '1985-06-15',
      idCountry: 'United Kingdom',
      idType: 'Passport',
    },
    addressDetails: {
      issuer: 'Barclays Bank',
      issueDate: '2026-02-15',
      documentType: 'Bank Statement',
    },
    scheduledDate: '2026-04-25',
    scheduledTime: '10:00',
  });

  const [evidenceFiles, setEvidenceFiles] = useState<{
    manualReport: File | null;
    callRecording: File | null;
    callComments: string;
  }>({
    manualReport: null,
    callRecording: null,
    callComments: '',
  });

  const addFlag = (step: string, comment: string) => {
    setFlags(prev => [...prev, { step, comment }]);
  };

  const steps: { id: ReviewerStep; label: string }[] = [
    { id: 'review-id', label: 'Review ID' },
    { id: 'review-address', label: 'Review Address' },
    { id: 'automated-tasks', label: 'Automated Tasks' },
    { id: 'manual-tasks', label: 'Manual Tasks' },
    { id: 'join-call', label: 'Video Call' },
    { id: 'record-results', label: 'Record Results' },
    { id: 'send-for-review', label: 'Send for Review' },
    { id: 'review-sent', label: 'Complete' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const canNavigateToStep = (stepId: ReviewerStep, stepIndex: number) => {
    // Can't navigate to join-call if we've moved past it
    if (stepId === 'join-call' && currentStepIndex > stepIndex) return false;

    // Can only navigate to completed or current steps
    return stepIndex <= currentStepIndex;
  };

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
              const canNavigate = canNavigateToStep(step.id, index);

              return (
                <div key={step.id} className="flex items-center flex-1 min-w-[100px]">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => canNavigate && setCurrentStep(step.id)}
                      disabled={!canNavigate}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-semibold transition-colors ${
                        isComplete
                          ? 'bg-[#00c853] text-white'
                          : isCurrent
                          ? 'bg-[#101F36] text-white'
                          : 'bg-[#e0e0e0] text-[#616161]'
                      } ${canNavigate && !isCurrent ? 'cursor-pointer hover:opacity-80' : ''} ${!canNavigate ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      {index + 1}
                    </button>
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
      {currentStep === 'review-id' && (
        <ReviewIdStep
          idDocument={verificationData.idDocument}
          extractedDetails={verificationData.personalDetails}
          onNext={(flag) => {
            if (flag) addFlag('ID Document Review', flag.comment);
            setCurrentStep('review-address');
          }}
        />
      )}

      {currentStep === 'review-address' && (
        <ReviewAddressStep
          addressDocument={verificationData.addressDocument}
          extractedDetails={verificationData.addressDetails}
          onNext={(flag) => {
            if (flag) addFlag('Address Document Review', flag.comment);
            setCurrentStep('automated-tasks');
          }}
        />
      )}

      {currentStep === 'automated-tasks' && (
        <AutomatedTasksStep
          onNext={(flag) => {
            if (flag) addFlag('Automated Tasks', flag.comment);
            setCurrentStep('manual-tasks');
          }}
        />
      )}

      {currentStep === 'manual-tasks' && (
        <ManualTasksStep
          onNext={(report, flag) => {
            setEvidenceFiles(prev => ({ ...prev, manualReport: report }));
            if (flag) addFlag('Manual Tasks', flag.comment);
            setCurrentStep('join-call');
          }}
        />
      )}

      {currentStep === 'join-call' && (
        <JoinCallStep
          scheduledDate={verificationData.scheduledDate}
          scheduledTime={verificationData.scheduledTime}
          onRecordResults={(flag) => {
            if (flag) addFlag('Video Call', flag.comment);
            setCurrentStep('record-results');
          }}
        />
      )}

      {currentStep === 'record-results' && (
        <RecordCallResultsStep
          onNext={(recording, comments, flag) => {
            setEvidenceFiles(prev => ({ ...prev, callRecording: recording, callComments: comments }));
            if (flag) addFlag('Call Results', flag.comment);
            setCurrentStep('send-for-review');
          }}
        />
      )}

      {currentStep === 'send-for-review' && evidenceFiles.manualReport && evidenceFiles.callRecording && (
        <SendForReviewStep
          evidence={{
            ...verificationData,
            automatedReportUrl: '/reports/automated-verification.pdf',
            manualReportFile: evidenceFiles.manualReport,
            callRecordingFile: evidenceFiles.callRecording,
            callComments: evidenceFiles.callComments,
          }}
          flags={flags}
          onSendForReview={(flag) => {
            if (flag) addFlag('Final Review', flag.comment);
            setCurrentStep('review-sent');
          }}
        />
      )}

      {currentStep === 'review-sent' && <ReviewSentStep />}
    </div>
  );
}
