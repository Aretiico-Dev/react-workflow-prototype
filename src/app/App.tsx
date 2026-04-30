import { useState } from 'react';
import { AppShell } from './components/v2/AppShell';
import { WorkflowType } from './components/workflows/WorkflowSelector';
import { CertificatePurchaseWorkflow } from './components/workflows/CertificatePurchaseWorkflow';
import { SmimeCertificatePurchaseWorkflow } from './components/workflows/SmimeCertificatePurchaseWorkflow';
import { UserVerificationWorkflow } from './components/workflows/UserVerificationWorkflow';
import { OrganisationClaimWorkflow } from './components/workflows/OrganisationClaimWorkflow';
import { TwoFactorResetWorkflow } from './components/workflows/TwoFactorResetWorkflow';

import { OrganisationJoinRequestStep } from './components/org-claim/OrganisationJoinRequestStep';
import { OrganisationJoinRequestConfirmation } from './components/org-claim/OrganisationJoinRequestConfirmation';
import { Toaster } from './components/ui/sonner';
import { DisputeStartStep } from './components/org-claim-dispute/DisputeStartStep';

export default function App() {
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowType>('certificate-purchase');
  const [joinDecision, setJoinDecision] = useState<null | { decision: 'accepted' | 'rejected' }>(null);

  return (
    <AppShell currentWorkflow={currentWorkflow} onWorkflowChange={w => { setCurrentWorkflow(w); setJoinDecision(null); }}>
      {currentWorkflow === 'certificate-purchase' && <CertificatePurchaseWorkflow />}
      {currentWorkflow === 'smime-certificate-purchase' && <SmimeCertificatePurchaseWorkflow />}
      {currentWorkflow === 'user-verification' && <UserVerificationWorkflow />}
      {currentWorkflow === 'organisation-claim' && <OrganisationClaimWorkflow />}
      {currentWorkflow === 'organisation-claim-dispute' && <DisputeStartStep />}
      {currentWorkflow === 'organisation-join-request' && !joinDecision && (
        <OrganisationJoinRequestStep
          applicantName="Alexandra Johnson"
          onDecision={(decision) => setJoinDecision({ decision })}
        />
      )}
      {currentWorkflow === 'organisation-join-request' && joinDecision && (
        <OrganisationJoinRequestConfirmation decision={joinDecision.decision} />
      )}
      {currentWorkflow === '2fa-reset' && <TwoFactorResetWorkflow />}
      <Toaster />
    </AppShell>
  );
}
