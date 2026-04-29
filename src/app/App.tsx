import { useState } from 'react';
import { AppShell } from './components/v2/AppShell';
import { WorkflowType } from './components/workflows/WorkflowSelector';
import { CertificatePurchaseWorkflow } from './components/workflows/CertificatePurchaseWorkflow';
import { UserVerificationWorkflow } from './components/workflows/UserVerificationWorkflow';
import { OrganisationClaimWorkflow } from './components/workflows/OrganisationClaimWorkflow';
import { Toaster } from './components/ui/sonner';
import { DisputeStartStep } from './components/org-claim-dispute/DisputeStartStep';

export default function App() {
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowType>('certificate-purchase');

  return (
    <AppShell currentWorkflow={currentWorkflow} onWorkflowChange={setCurrentWorkflow}>
      {currentWorkflow === 'certificate-purchase' && <CertificatePurchaseWorkflow />}
      {currentWorkflow === 'user-verification' && <UserVerificationWorkflow />}
      {currentWorkflow === 'organisation-claim' && <OrganisationClaimWorkflow />}
      {currentWorkflow === 'organisation-claim-dispute' && <DisputeStartStep />}
      <Toaster />
    </AppShell>
  );
}