import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Loader2, MailCheck } from 'lucide-react';
import { CancelOrderDialog } from '../v2/CancelOrderDialog';

interface SmimeEmailChecksStepProps {
  emailAddress: string;
  onSendVerificationEmail: () => void;
  onBack: () => void;
  onCancel?: () => void;
}

type CheckStatus = 'pending' | 'running' | 'success';

interface EmailCheck {
  id: string;
  label: string;
  description: string;
  status: CheckStatus;
}

const initialChecks: EmailCheck[] = [
  {
    id: 'format',
    label: 'Email format',
    description: 'Confirming the address uses a valid mailbox format',
    status: 'pending',
  },
  {
    id: 'domain',
    label: 'Domain availability',
    description: 'Checking the domain accepts email and has valid mail records',
    status: 'pending',
  },
  {
    id: 'blacklist',
    label: 'Spam blacklist',
    description: 'Checking the domain against known spam and abuse lists',
    status: 'pending',
  },
  {
    id: 'disposable',
    label: 'Disposable mailbox',
    description: 'Confirming this is not a temporary mailbox provider',
    status: 'pending',
  },
  {
    id: 'policy',
    label: 'Issuance policy',
    description: 'Confirming the address is eligible for S/MIME issuance',
    status: 'pending',
  },
];

export function SmimeEmailChecksStep({ emailAddress, onSendVerificationEmail, onBack, onCancel }: SmimeEmailChecksStepProps) {
  const [checks, setChecks] = useState<EmailCheck[]>(initialChecks);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const allChecksComplete = checks.every(check => check.status === 'success');
  const anyCheckRunning = checks.some(check => check.status === 'running');

  useEffect(() => {
    const timers = initialChecks.flatMap((_, index) => {
      const startDelay = index * 850;
      const completeDelay = startDelay + 850;

      return [
        window.setTimeout(() => {
          setChecks(prev => prev.map((check, checkIndex) =>
            checkIndex === index ? { ...check, status: 'running' } : check
          ));
        }, startDelay),
        window.setTimeout(() => {
          setChecks(prev => prev.map((check, checkIndex) =>
            checkIndex === index ? { ...check, status: 'success' } : check
          ));
        }, completeDelay),
      ];
    });

    return () => timers.forEach(timer => window.clearTimeout(timer));
  }, []);

  const handleCancelOrder = () => {
    setCancelDialogOpen(false);
    onCancel?.();
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        disabled={anyCheckRunning}
        className="flex items-center gap-2 text-[0.875rem] text-[#616161] hover:text-[#101F36] disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h3 className="text-[1.25rem] font-semibold text-[#212121] mb-2">Check Email Address</h3>
        <p className="text-[0.875rem] text-[#616161]">
          Running automated checks before we send a verification email to {emailAddress}
        </p>
      </div>

      {allChecksComplete && (
        <div className="flex items-start gap-3 p-4 bg-[#b9f6ca] border border-[#00c853] rounded">
          <CheckCircle2 className="h-5 w-5 text-[#00c853] flex-shrink-0 mt-0.5" />
          <p className="text-[0.875rem] text-[#212121]">
            Email address checks completed successfully. You can now send the verification email.
          </p>
        </div>
      )}

      <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)]">
        <div className="border-b border-[#e0e0e0] px-6 py-4">
          <h4 className="text-[1.125rem] font-semibold text-[#212121]">Automated Checks</h4>
          <p className="text-[0.75rem] text-[#616161] mt-1">Checks complete automatically in this prototype</p>
        </div>

        <div className="px-6 py-6 space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="flex items-start gap-3 p-4 border border-[#e0e0e0] rounded">
              {check.status === 'success' && <CheckCircle2 className="w-5 h-5 text-[#00c853] mt-0.5 flex-shrink-0" />}
              {check.status === 'running' && <Loader2 className="w-5 h-5 text-[#101F36] animate-spin mt-0.5 flex-shrink-0" />}
              {check.status === 'pending' && <Clock className="w-5 h-5 text-[#616161] mt-0.5 flex-shrink-0" />}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h5 className="text-[0.875rem] font-medium text-[#212121]">{check.label}</h5>
                  <span className={`px-3 py-1 rounded-full text-[0.625rem] font-semibold border ${
                    check.status === 'success' ? 'bg-[#b9f6ca] text-[#00c853] border-[#00c853]' :
                    check.status === 'running' ? 'bg-[#e3f2fd] text-[#101F36] border-[#90caf9]' :
                    'bg-[#fafafa] text-[#616161] border-[#e0e0e0]'
                  }`}>
                    {check.status === 'success' && 'PASSED'}
                    {check.status === 'running' && 'CHECKING'}
                    {check.status === 'pending' && 'PENDING'}
                  </span>
                </div>
                <p className="text-[0.75rem] text-[#616161] mt-1">{check.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={() => setCancelDialogOpen(true)}
            disabled={anyCheckRunning}
            className="flex-1 px-6 py-3 border border-[#e0e0e0] rounded hover:bg-[#fafafa] transition-colors disabled:opacity-50"
          >
            CANCEL ORDER
          </button>
        )}
        <button
          onClick={onSendVerificationEmail}
          disabled={!allChecksComplete}
          className="flex-1 px-6 py-3 bg-[#101F36] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <MailCheck className="w-4 h-4" />
          SEND VERIFICATION EMAIL
        </button>
      </div>

      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelOrder}
      />
    </div>
  );
}
