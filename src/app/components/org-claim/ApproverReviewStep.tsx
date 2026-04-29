import { useState } from 'react';
import { FinalApprovalStep } from './approver/FinalApprovalStep';
import { DisputeFinalApprovalStep } from './approver/DisputeFinalApprovalStep';
import { ApprovalConfirmationStep } from './approver/ApprovalConfirmationStep';

type ApproverStep = 'final-approval' | 'confirmation';

interface ApproverReviewStepProps {
  scenario: 'standard' | 'dispute';
}

export function ApproverReviewStep({ scenario }: ApproverReviewStepProps) {
  const [currentStep, setCurrentStep] = useState<ApproverStep>('final-approval');
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [selectedRepresentativeName, setSelectedRepresentativeName] = useState('John Smith');

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
    pscDecisionNotes: 'Reviewed Companies House filings, the company website leadership page, and the reviewer’s public-source checks. The named PSC matched the organisation records and the contact details were consistent across sources.',
    pscSupportingFileNames: ['psc-register-extract.pdf', 'company-website-leadership-screenshot.png'],
  };

  const disputeData = {
    organisationName: claimData.organisationName,
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
      supportedByPsc: 'Jane Director, CEO',
      supportEmail: 'jane.director@abclimited.com',
      claimSummary: 'Submitted a dispute stating the current representative is no longer authorised to act.',
    },
    reviewerRecommendation: {
      selectedRepresentative: 'claimant' as const,
      rationale:
        'The reviewer found current public filings and the PSC verification call aligned more strongly with John Smith as the appropriate representative. The active representative could not demonstrate continuing authority beyond legacy system access.',
    },
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
        scenario === 'dispute' ? (
          <DisputeFinalApprovalStep
            disputeData={disputeData}
            onDecision={(finalDecision, representativeName, reason) => {
              setDecision(finalDecision);
              setSelectedRepresentativeName(representativeName);
              setCurrentStep('confirmation');
              console.log('Decision:', finalDecision, 'Representative:', representativeName, 'Reason:', reason);
            }}
          />
        ) : (
          <FinalApprovalStep
            claimData={claimData}
            evidence={evidence}
            flags={flags}
            onDecision={(finalDecision, reason) => {
              setDecision(finalDecision);
              setSelectedRepresentativeName(claimData.claimantName);
              setCurrentStep('confirmation');
              console.log('Decision:', finalDecision, 'Reason:', reason);
            }}
          />
        )
      )}

      {currentStep === 'confirmation' && (
        <ApprovalConfirmationStep
          decision={decision}
          claimantName={selectedRepresentativeName}
          organisationName={claimData.organisationName}
        />
      )}
    </div>
  );
}
