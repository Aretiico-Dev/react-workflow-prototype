import { useState } from 'react';
import { FinalApprovalStep } from './approver/FinalApprovalStep';
import { ApprovalConfirmationStep } from './approver/ApprovalConfirmationStep';

type ApproverStep = 'final-approval' | 'confirmation';

export function ApproverReviewStep() {
  const [currentStep, setCurrentStep] = useState<ApproverStep>('final-approval');
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');

  // Mock data - in real app would come from the reviewer submission
  const verificationData = {
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
    automatedReportUrl: '/reports/automated-verification.pdf',
    manualReportFileName: 'research-report-john-smith.pdf',
    callRecordingFileName: 'video-call-2026-04-25.mp4',
    callRecordingSize: 45000000, // 45MB in bytes
    callComments: 'User was cooperative and provided clear responses. ID document shown on camera matched submitted documentation. No concerns raised during the call.',
  };

  // Mock flags from reviewer
  const flags = [
    {
      step: 'Video Call',
      comment: 'User had slight technical difficulties with camera initially, but was resolved. No other concerns.'
    }
  ];

  return (
    <div className="space-y-6">
      {currentStep === 'final-approval' && (
        <FinalApprovalStep
          evidence={verificationData}
          flags={flags}
          onDecision={(finalDecision, reason) => {
            setDecision(finalDecision);
            setCurrentStep('confirmation');
            // In real app, would send decision to backend with reason if rejected
            console.log('Decision:', finalDecision, 'Reason:', reason);
          }}
        />
      )}

      {currentStep === 'confirmation' && (
        <ApprovalConfirmationStep
          decision={decision}
          applicantName={`${verificationData.personalDetails.firstName} ${verificationData.personalDetails.lastName}`}
        />
      )}
    </div>
  );
}
