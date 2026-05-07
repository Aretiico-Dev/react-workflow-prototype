import { useState } from 'react';
import { UploadIdStep } from './customer/UploadIdStep';
import { UploadProofOfAddressStep } from './customer/UploadProofOfAddressStep';
import { ExtractingDetailsStep } from './customer/ExtractingDetailsStep';
import { ConfirmDetailsStep } from './customer/ConfirmDetailsStep';
import { ScheduleCallStep } from './customer/ScheduleCallStep';
import { BackgroundChecksStep } from './customer/BackgroundChecksStep';
import { ResultStep } from './customer/ResultStep';
import { CancelOrderDialog } from '../v2/CancelOrderDialog';

type CustomerStep =
  | 'upload-id'
  | 'upload-address'
  | 'extracting'
  | 'confirm-details'
  | 'schedule-call'
  | 'background-checks'
  | 'result';

export function CustomerSubmitStep() {
  const [currentStep, setCurrentStep] = useState<CustomerStep>('upload-id');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState<'approved' | 'rejected'>('approved');

  // Mock state - in real app, this would be managed globally
  const [verificationData, setVerificationData] = useState({
    idFile: null as File | null,
    idType: '' as 'passport' | 'driving-license' | '',
    addressFile: null as File | null,
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
    scheduledDate: '',
    scheduledTime: '',
  });

  const handleCancelVerification = () => {
    setCancelDialogOpen(false);
    setCurrentStep('upload-id');
    // Reset state
  };

  const steps: { id: CustomerStep; label: string }[] = [
    { id: 'upload-id', label: 'Upload ID' },
    { id: 'upload-address', label: 'Proof of Address' },
    { id: 'extracting', label: 'Processing' },
    { id: 'confirm-details', label: 'Confirm Details' },
    { id: 'schedule-call', label: 'Video Call' },
    { id: 'background-checks', label: 'Final Checks' },
    { id: 'result', label: 'Result' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {currentStep !== 'result' && (
        <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              if (step.id === 'result') return null;

              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.id} className="flex items-center flex-1">
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
                      className={`text-[0.75rem] mt-2 hidden sm:block ${
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
      {currentStep === 'upload-id' && (
        <UploadIdStep
          onNext={(file, idType) => {
            setVerificationData(prev => ({ ...prev, idFile: file, idType }));
            setCurrentStep('upload-address');
          }}
          onCancel={() => setCancelDialogOpen(true)}
        />
      )}

      {currentStep === 'upload-address' && (
        <UploadProofOfAddressStep
          onNext={(file) => {
            setVerificationData(prev => ({ ...prev, addressFile: file }));
            setCurrentStep('extracting');
          }}
          onCancel={() => setCancelDialogOpen(true)}
        />
      )}

      {currentStep === 'extracting' && (
        <ExtractingDetailsStep
          onComplete={() => setCurrentStep('confirm-details')}
        />
      )}

      {currentStep === 'confirm-details' && (
        <ConfirmDetailsStep
          extractedPersonalDetails={verificationData.personalDetails}
          extractedAddressDetails={verificationData.addressDetails}
          onNext={(personalDetails, addressDetails) => {
            setVerificationData(prev => ({ ...prev, personalDetails, addressDetails }));
            setCurrentStep('schedule-call');
          }}
          onCancel={() => setCancelDialogOpen(true)}
        />
      )}

      {currentStep === 'schedule-call' && (
        <ScheduleCallStep
          onNext={(date, time) => {
            setVerificationData(prev => ({ ...prev, scheduledDate: date, scheduledTime: time }));
            setCurrentStep('background-checks');
          }}
          onCancel={() => setCancelDialogOpen(true)}
        />
      )}

      {currentStep === 'background-checks' && <BackgroundChecksStep />}

      {currentStep === 'result' && (
        <ResultStep
          status={resultStatus}
        />
      )}

      {/* Debug - Quick jump to result */}
      {currentStep === 'background-checks' && (
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

      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelVerification}
      />
    </div>
  );
}
