import { useState } from 'react';
import { FinalApprovalStep } from './approver/FinalApprovalStep';
import { ApprovalConfirmationStep } from './approver/ApprovalConfirmationStep';

type ApproverStep = 'final-approval' | 'confirmation';

export function ApproverReviewStep() {
  const [currentStep, setCurrentStep] = useState<ApproverStep>('final-approval');
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');

  // Mock data - in real app would come from the reviewer submission
  const claimData = {
    organisationName: 'ABC Limited',
    claimantName: 'John Smith',
    role: 'Director',
  };

  const evidence = {
    automatedReportsCount: 5,
    manualReportFileName: 'abc-limited-research-report.pdf',
    callRecordingFileName: 'teams-call-2026-04-25.mp4',
    callRecordingSize: 45000000, // 45MB
    emailConfirmationFileName: 'organisation-confirmation-email.pdf',
    callComments: 'PSC confirmed claimant\'s authority. No concerns raised during the call.',
  };

  // Mock flags from reviewer
  const flags = [
    {
      step: 'Phone Call',
      comment: 'PSC initially seemed uncertain but confirmed after checking company records.'
    }
  ];

  return (
    <div className="space-y-6">
      {currentStep === 'final-approval' && (
        <FinalApprovalStep
          claimData={claimData}
          evidence={evidence}
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
          claimantName={claimData.claimantName}
          organisationName={claimData.organisationName}
        />
      )}
    </div>
  );
}
