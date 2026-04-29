import { CheckCircle2, Clock, Circle, XCircle } from 'lucide-react';

export type VerificationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'reviewed'
  | 'approved'
  | 'rejected'
  | 'changes_requested';

interface StatusStep {
  status: VerificationStatus;
  label: string;
  role: 'customer' | 'reviewer' | 'approver';
}

const statusSteps: StatusStep[] = [
  { status: 'submitted', label: 'Submitted', role: 'customer' },
  { status: 'under_review', label: 'Under Review', role: 'reviewer' },
  { status: 'reviewed', label: 'Reviewed', role: 'reviewer' },
  { status: 'approved', label: 'Approved', role: 'approver' },
];

interface VerificationStatusTimelineProps {
  currentStatus: VerificationStatus;
  rejectedAt?: 'under_review' | 'reviewed';
}

export function VerificationStatusTimeline({ currentStatus, rejectedAt }: VerificationStatusTimelineProps) {
  const getStepStatus = (step: StatusStep): 'complete' | 'current' | 'pending' | 'rejected' => {
    if (currentStatus === 'rejected' && rejectedAt === step.status) {
      return 'rejected';
    }

    const currentIndex = statusSteps.findIndex(s => s.status === currentStatus);
    const stepIndex = statusSteps.findIndex(s => s.status === step.status);

    if (currentStatus === 'rejected') {
      return 'rejected';
    }
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-white rounded border border-[#e0e0e0] shadow-[1px_0_20px_rgb(0_0_0_/_8%)] p-6">
      <h4 className="text-[1rem] font-semibold text-[#212121] mb-4">Verification Status</h4>

      <div className="flex items-center justify-between">
        {statusSteps.map((step, index) => {
          const stepStatus = getStepStatus(step);

          return (
            <div key={step.status} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  stepStatus === 'complete' ? 'bg-[#00c853] text-white' :
                  stepStatus === 'current' ? 'bg-[#101F36] text-white' :
                  stepStatus === 'rejected' ? 'bg-[#f44336] text-white' :
                  'bg-[#e0e0e0] text-[#616161]'
                }`}>
                  {stepStatus === 'complete' && <CheckCircle2 className="w-5 h-5" />}
                  {stepStatus === 'current' && <Clock className="w-5 h-5" />}
                  {stepStatus === 'rejected' && <XCircle className="w-5 h-5" />}
                  {stepStatus === 'pending' && <Circle className="w-5 h-5" />}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-[0.75rem] font-medium ${
                    stepStatus === 'current' ? 'text-[#212121]' : 'text-[#616161]'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-[0.625rem] text-[#616161] mt-0.5">
                    {step.role === 'customer' ? 'Customer' :
                     step.role === 'reviewer' ? 'Reviewer' :
                     'Approver'}
                  </p>
                </div>
              </div>

              {index < statusSteps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 transition-colors ${
                  stepStatus === 'complete' ? 'bg-[#00c853]' :
                  stepStatus === 'rejected' ? 'bg-[#f44336]' :
                  'bg-[#e0e0e0]'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {currentStatus === 'rejected' && (
        <div className="mt-4 p-3 bg-[#f9d8d8] border border-[#f44336] rounded">
          <p className="text-[0.875rem] text-[#212121]">
            <strong>Verification Rejected:</strong> This verification was rejected during review.
            The customer may need to resubmit with corrections.
          </p>
        </div>
      )}

      {currentStatus === 'changes_requested' && (
        <div className="mt-4 p-3 bg-[#fff8e1] border border-[#ffc107] rounded">
          <p className="text-[0.875rem] text-[#212121]">
            <strong>Changes Requested:</strong> The reviewer has requested additional information or corrections.
          </p>
        </div>
      )}
    </div>
  );
}
